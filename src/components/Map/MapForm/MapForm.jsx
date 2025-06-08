import { useState, useEffect } from "react";
import { addTrip } from "../../../utils/firebaseUtils";
import { useSelector } from "react-redux";
import { fetchLocationData } from "../../../utils/googleMapsUtils";
import "./MapForm.css";

const MapForm = ({ 
    uid, 
    dialogLocation, 
    onTripAdded, 
    onCancel,
    initialTripName = "" 
}) => {
    const mapType = useSelector((state) => state.mapInfo.type);

    const [isAddingTrip, setIsAddingTrip] = useState(false);
    const [loadingLocationData, setLoadingLocationData] = useState(false);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [locationPhoto, setLocationPhoto] = useState(null);
    const [MapForm, setMapForm] = useState({
        name: initialTripName,
        description: "",
        startDate: "",
        endDate: "",
        participants: []
    });

    useEffect(() => {
        if (dialogLocation && dialogLocation.lat && dialogLocation.lng) {
            fetchLocationInfo(dialogLocation.lat, dialogLocation.lng);
        }
    }, [dialogLocation]);

    useEffect(() => {
        if (initialTripName && !MapForm.name) {
            setMapForm(prev => ({
                ...prev,
                name: initialTripName
            }));
        }
    }, [initialTripName, MapForm.name]);

    const fetchLocationInfo = async (lat, lng) => {
        setLoadingLocationData(true);
        setLocationPhoto(null);
        setPlaceDetails(null);

        try {
            const { placeDetails: fetchedPlaceDetails, photoUrl, error } = await fetchLocationData(lat, lng);

            if (error) {
                console.error('Error fetching location data:', error);
            }

            if (fetchedPlaceDetails) {
                setPlaceDetails(fetchedPlaceDetails);
                if (fetchedPlaceDetails.name && !MapForm.name) {
                    setMapForm(prev => ({
                        ...prev,
                        name: `Trip to ${fetchedPlaceDetails.name}`
                    }));
                }
            }

            if (photoUrl) {
                setLocationPhoto(photoUrl);
            }
        } catch (error) {
            console.error('Error fetching location info:', error);
        } finally {
            setLoadingLocationData(false);
        }
    };

    const handleFormChange = (field, value) => {
        setMapForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleParticipantsChange = (value) => {
        const participantsList = value.split(',').map(p => p.trim()).filter(p => p.length > 0);
        setMapForm(prev => ({
            ...prev,
            participants: participantsList
        }));
    };

    const onAddTrip = async () => {
        if (!uid) {
            console.error("User ID is required to add a trip");
            alert("Please log in to add a trip");
            return;
        }

        if (!placeDetails || !MapForm.name || !MapForm.startDate || !MapForm.endDate) {
            alert("Please fill in all required fields (Trip Name, Start Date, End Date)");
            return;
        }

        setIsAddingTrip(true);

        try {
            const destination = placeDetails ? 
                `${placeDetails.name}, ${placeDetails.address}` : 
                `${dialogLocation.lat}, ${dialogLocation.lng}`;

            const tripPic = locationPhoto || null;

            const tripId = await addTrip(
                uid,
                MapForm.description,
                destination,
                MapForm.startDate,
                MapForm.endDate,
                MapForm.name,
                MapForm.participants,
                tripPic
            );

            if (tripId) {
                console.log("Trip added successfully with ID:", tripId);
                alert("Trip added successfully!");
                
                setMapForm({
                    name: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    participants: []
                });
                
                onTripAdded(tripId);
            } else {
                alert("Failed to add trip. Please try again.");
            }
        } catch (error) {
            console.error("Error adding trip:", error);
            alert("Error adding trip. Please try again.");
        } finally {
            setIsAddingTrip(false);
        }
    };

    return (
        <div className="trip-form">
            <h4 className="form-title">Create Trip</h4>
            
            {loadingLocationData ? (
                <div className="loading-container">
                    <p>Loading location data...</p>
                </div>
            ) : (
                placeDetails && (
                    <div className="place-details">
                        <h5 className="place-name">{placeDetails.name}</h5>
                        {placeDetails.rating && (
                            <p className="place-rating">
                                Rating: {placeDetails.rating}/5 ⭐
                            </p>
                        )}
                        <p className="place-address">
                            {placeDetails.address}
                        </p>
                        {locationPhoto && (
                            <div className="location-photo-container">
                                <img 
                                    src={locationPhoto} 
                                    alt="Location" 
                                    className="location-photo"
                                />
                            </div>
                        )}
                    </div>
                )
            )}
            
            <div className="form-field">
                <label>Trip Name *</label>
                <input
                    type="text"
                    value={MapForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter trip name"
                    className="form-input"
                />
            </div>

            <div className="form-field">
                <label>Description</label>
                <textarea
                    value={MapForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Trip description (optional)"
                    className="form-textarea"
                />
            </div>

            <div className="date-fields">
                <div className="date-field">
                    <label>Start Date *</label>
                    <input
                        type="date"
                        value={MapForm.startDate}
                        onChange={(e) => handleFormChange('startDate', e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="date-field">
                    <label>End Date *</label>
                    <input
                        type="date"
                        value={MapForm.endDate}
                        onChange={(e) => handleFormChange('endDate', e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="form-field participants-field">
                <label>Participants</label>
                <input
                    type="text"
                    value={MapForm.participants.join(', ')}
                    onChange={(e) => handleParticipantsChange(e.target.value)}
                    placeholder="Enter participant names/emails"
                    className="form-input"
                />
            </div>

            <div className="button-group">
                {mapType === "trip" && (
                    <button
                        className={`app-button add-trip-button ${(isAddingTrip || loadingLocationData) ? 'disabled' : ''}`}
                        onClick={onAddTrip}
                        disabled={isAddingTrip || loadingLocationData}
                    >
                        {isAddingTrip ? 'Adding Trip...' : 'Add Trip'}
                    </button>
                )}
                
                {onCancel && (
                    <button 
                        onClick={onCancel}
                        disabled={isAddingTrip || loadingLocationData}
                        className={`cancel-button ${(isAddingTrip || loadingLocationData) ? 'disabled' : ''}`}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default MapForm;