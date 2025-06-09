import { useState, useEffect } from "react";
import { addPlace, createList, getSavedLists } from "../../../utils/firebaseUtils";
import SavedListsDropdown from "../../SavedListsDropdown/SavedListsDropdown";
import "./MapForm.css";
import { setSavedLists } from "../../../store/mapInfo/MapInfo";
import { useDispatch } from "react-redux";

const MapForm = ({ 
    uid, 
    dialogLocation, 
    placeDetails,
    tripPic, 
    description,          
    loadingLocationData,
    onLocationAdded, 
    onCancel
}) => {
    const dispatch = useDispatch(); 
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [isCreatingList, setIsCreatingList] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [showCreateListForm, setShowCreateListForm] = useState(false);
    const [savedLists, setLocalSavedLists] = useState([]); 
    const [loadingLists, setLoadingLists] = useState(false);
    const [newListForm, setNewListForm] = useState({ name: "", description: "" });

    useEffect(() => {
        const fetchSavedLists = async () => {
            if (!uid) {
                setLocalSavedLists([]);
                return;
            }
            setLoadingLists(true);
            try {
                const lists = await getSavedLists(uid);
                setLocalSavedLists(lists); 
            } catch (error) {
                console.error("Error fetching saved lists:", error);
                setLocalSavedLists([]);
            } finally {
                setLoadingLists(false);
            }
        };
        fetchSavedLists();
    }, [uid]);

    const handleCreateNewList = () => {
        setShowCreateListForm(true);
        setSelectedList(null);
    };

    const handleSelectList = (list) => {
        setSelectedList(list);
        setShowCreateListForm(false);
    };

    const handleNewListFormChange = (field, value) => {
        setNewListForm(prev => ({ ...prev, [field]: value }));
    };

    const onCreateList = async () => {
        if (!uid) {
            alert("Please log in to create a list");
            return;
        }
        if (!newListForm.name.trim()) {
            alert("Please enter a list name");
            return;
        }
        setIsCreatingList(true);
        try {
            const listId = await createList(
                uid,
                newListForm.name.trim(),
                newListForm.description.trim(),
                tripPic 
            );
            if (listId) {
                const placeId = await addPlace(
                    listId,
                    dialogLocation.lat,
                    dialogLocation.lng,
                    tripPic,
                    placeDetails?.name || 'Untitled Place',
                    placeDetails?.address || ''
                );
                if (placeId) {
                    alert("List created and location added successfully!");
                    setNewListForm({ name: "", description: "" });
                    setShowCreateListForm(false);
                    
                    const updatedLists = await getSavedLists(uid);
                    
                    setLocalSavedLists(updatedLists);
                    
                    const formattedLists = updatedLists.map(list => ({
                        id: list.id,
                        tripPic: list.tripPic,
                        name: list.name || 'Untitled List',
                        onClick: () => {
                        }
                    }));
                    dispatch(setSavedLists(formattedLists)); 
                    
                    onLocationAdded(listId, placeId);
                } else {
                    alert("List created but failed to add location. Please try again.");
                }
            } else {
                alert("Failed to create list. Please try again.");
            }
        } catch (error) {
            console.error("Error creating list:", error);
            alert("Error creating list. Please try again.");
        } finally {
            setIsCreatingList(false);
        }
    };

    const onAddLocation = async () => {
        if (!uid) {
            alert("Please log in to add a location");
            return;
        }
        if (!selectedList) {
            alert("Please select a list to add the location to");
            return;
        }
        if (!dialogLocation || !dialogLocation.lat || !dialogLocation.lng) {
            alert("Location data is not available");
            return;
        }
        setIsAddingLocation(true);
        try {
            const placeId = await addPlace(
                selectedList.id,
                dialogLocation.lat,
                dialogLocation.lng,
                tripPic,
                placeDetails?.name || 'Untitled Place',
                placeDetails?.address || ''
            );
            if (placeId) {
                alert("Location added to list successfully!");
                setSelectedList(null);
                onLocationAdded(selectedList.id, placeId);
            } else {
                alert("Failed to add location. Please try again.");
            }
        } catch (error) {
            console.error("Error adding location:", error);
            alert("Error adding location. Please try again.");
        } finally {
            setIsAddingLocation(false);
        }
    };

    const handleCancelCreateList = () => {
        setShowCreateListForm(false);
        setNewListForm({ name: "", description: "" });
        setSelectedList(null);
    };

    return (
        <div className="trip-form">
            {loadingLocationData ? (
                <div className="loading-container">
                    <p>Loading location data...</p>
                </div>
            ) : (
                placeDetails && (
                    <div className="place-details">
                        {tripPic && (
                            <div className="location-photo-container">
                                <img src={tripPic} alt="Location" className="location-photo" />
                            </div>
                        )}
                        <h5 className="place-name">{placeDetails.name}</h5>
                        {placeDetails.rating && (
                            <p className="place-rating">
                                Rating: {placeDetails.rating}/5 ⭐
                            </p>
                        )}
                        <p className="place-address">{placeDetails.address}</p>
                    </div>
                )
            )}

            {showCreateListForm ? (
                <div className="create-list-form">
                    <h5>Create New List</h5>
                    <div className="form-field">
                        <label>List Name *</label>
                        <input
                            type="text"
                            value={newListForm.name}
                            onChange={(e) => handleNewListFormChange('name', e.target.value)}
                            placeholder="Enter list name"
                            className="form-input"
                        />
                    </div>
                    <div className="form-field">
                        <label>Description</label>
                        <textarea
                            value={newListForm.description}
                            onChange={(e) => handleNewListFormChange('description', e.target.value)}
                            placeholder="List description (optional)"
                            className="form-textarea"
                        />
                    </div>
                    <div className="button-group">
                        <button
                            className={`app-button add-trip-button ${(isCreatingList || loadingLocationData) ? 'disabled' : ''}`}
                            onClick={onCreateList}
                            disabled={isCreatingList || loadingLocationData}
                        >
                            {isCreatingList ? 'Creating List...' : 'Create List & Add Location'}
                        </button>
                        <button
                            onClick={handleCancelCreateList}
                            disabled={isCreatingList || loadingLocationData}
                            className={`cancel-button ${(isCreatingList || loadingLocationData) ? 'disabled' : ''}`}
                        >
                            Back
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="form-field">
                        <label>Select List *</label>
                        {loadingLists ? (
                            <div className="loading-dropdown">
                                <p>Loading lists...</p>
                            </div>
                        ) : (
                            <SavedListsDropdown
                                savedLists={savedLists}
                                onCreateNewList={handleCreateNewList}
                                onSelectList={handleSelectList}
                                placeholder="Choose a list to add location to..."
                            />
                        )}
                    </div>

                    <div className="button-group">
                        <button
                            className={`app-button add-trip-button ${(isAddingLocation || loadingLocationData || loadingLists || !selectedList) ? 'disabled' : ''}`}
                            onClick={onAddLocation}
                            disabled={isAddingLocation || loadingLocationData || loadingLists || !selectedList}
                        >
                            {isAddingLocation ? 'Adding Location...' : 'Add Location'}
                        </button>

                        {onCancel && (
                            <button
                                onClick={onCancel}
                                disabled={isAddingLocation || loadingLocationData || loadingLists}
                                className={`cancel-button ${(isAddingLocation || loadingLocationData || loadingLists) ? 'disabled' : ''}`}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MapForm;