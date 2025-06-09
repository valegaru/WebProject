import { useState } from "react";
import { addPlace, createList } from "../../../utils/firebaseUtils";
import { useSelector } from "react-redux";
import "./MapForm.css";
import SavedListsDropdown from "../../SavedListsDropdown/SavedListsDropdown";

const MapForm = ({ 
    uid, 
    dialogLocation, 
    placeDetails,
    locationPhoto,
    loadingLocationData,
    onLocationAdded, 
    onCancel,
    savedLists = []
}) => {
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [isCreatingList, setIsCreatingList] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [showCreateListForm, setShowCreateListForm] = useState(false);
    const [newListForm, setNewListForm] = useState({
        name: "",
        description: ""
    });

    const handleCreateNewList = () => {
        setShowCreateListForm(true);
        setSelectedList(null);
    };

    const handleSelectList = (list) => {
        setSelectedList(list);
        setShowCreateListForm(false);
    };

    const handleNewListFormChange = (field, value) => {
        setNewListForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const onCreateList = async () => {
        if (!uid) {
            console.error("User ID is required to create a list");
            alert("Please log in to create a list");
            return;
        }

        if (!newListForm.name.trim()) {
            alert("Please enter a list name");
            return;
        }

        setIsCreatingList(true);

        try {
            const listId = await createList(uid, newListForm.name.trim(), newListForm.description.trim());

            if (listId) {
                console.log("List created successfully with ID:", listId);
                
                const placeId = await addPlace(listId, dialogLocation.lat, dialogLocation.lng);
                
                if (placeId) {
                    alert("List created and location added successfully!");
                    setNewListForm({ name: "", description: "" });
                    setShowCreateListForm(false);
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
            console.error("User ID is required to add a location");
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
            const placeId = await addPlace(selectedList.id, dialogLocation.lat, dialogLocation.lng);

            if (placeId) {
                console.log("Location added successfully with ID:", placeId);
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
                        {locationPhoto && (
                            <div className="location-photo-container">
                                <img 
                                    src={locationPhoto} 
                                    alt="Location" 
                                    className="location-photo"
                                />
                            </div>
                        )}
                        <h5 className="place-name">{placeDetails.name}</h5>
                        {placeDetails.rating && (
                            <p className="place-rating">
                                Rating: {placeDetails.rating}/5 ⭐
                            </p>
                        )}
                        <p className="place-address">
                            {placeDetails.address}
                        </p>
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
                        <SavedListsDropdown 
                            savedLists={savedLists}
                            onCreateNewList={handleCreateNewList}
                            onSelectList={handleSelectList}
                            placeholder="Choose a list to add location to..."
                        />
                    </div>

                    <div className="button-group">
                        <button
                            className={`app-button add-trip-button ${(isAddingLocation || loadingLocationData || !selectedList) ? 'disabled' : ''}`}
                            onClick={onAddLocation}
                            disabled={isAddingLocation || loadingLocationData || !selectedList}
                        >
                            {isAddingLocation ? 'Adding Location...' : 'Add Location'}
                        </button>
                        
                        {onCancel && (
                            <button 
                                onClick={onCancel}
                                disabled={isAddingLocation || loadingLocationData}
                                className={`cancel-button ${(isAddingLocation || loadingLocationData) ? 'disabled' : ''}`}
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