import { useState } from "react";
import { addTrip } from "../../../utils/firebaseUtils";

const MapForm = ({ 
    uid, 
    placeDetails, 
    dialogLocation, 
    locationPhoto, 
    onTripAdded, 
    onCancel,
    initialTripName = "" 
}) => {
    const [isAddingTrip, setIsAddingTrip] = useState(false);
    const [MapForm, setMapForm] = useState({
        name: initialTripName,
        description: "",
        startDate: "",
        endDate: "",
        participants: []
    });

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

    if (initialTripName && !MapForm.name) {
        setMapForm(prev => ({
            ...prev,
            name: initialTripName
        }));
    }

    return (
        <div className="trip-form" style={{ marginBottom: '15px' }}>
            <h4>Create Trip</h4>
            
            <div style={{ marginBottom: '10px' }}>
                <label>Trip Name *</label>
                <input
                    type="text"
                    value={MapForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter trip name"
                    style={{ width: '100%', padding: '5px', marginTop: '3px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Description</label>
                <textarea
                    value={MapForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Trip description (optional)"
                    style={{ width: '100%', padding: '5px', marginTop: '3px', minHeight: '60px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                    <label>Start Date *</label>
                    <input
                        type="date"
                        value={MapForm.startDate}
                        onChange={(e) => handleFormChange('startDate', e.target.value)}
                        style={{ width: '100%', padding: '5px', marginTop: '3px' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label>End Date *</label>
                    <input
                        type="date"
                        value={MapForm.endDate}
                        onChange={(e) => handleFormChange('endDate', e.target.value)}
                        style={{ width: '100%', padding: '5px', marginTop: '3px' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Participants</label>
                <input
                    type="text"
                    value={MapForm.participants.join(', ')}
                    onChange={(e) => handleParticipantsChange(e.target.value)}
                    placeholder="Enter participant names/emails"
                    style={{ width: '100%', padding: '5px', marginTop: '3px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    className="app-button" 
                    onClick={onAddTrip}
                    disabled={isAddingTrip}
                    style={{ 
                        flex: 1,
                        padding: '10px',
                        backgroundColor: isAddingTrip ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isAddingTrip ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isAddingTrip ? 'Adding Trip...' : 'Add Trip'}
                </button>
                
                {onCancel && (
                    <button 
                        onClick={onCancel}
                        disabled={isAddingTrip}
                        style={{ 
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isAddingTrip ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default MapForm;