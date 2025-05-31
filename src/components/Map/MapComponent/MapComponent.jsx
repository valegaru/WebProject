import { APIProvider, InfoWindow, Map } from "@vis.gl/react-google-maps";
import PoiMarkers from "../PoiMarker/PoiMarkers";
import { useState } from "react";
import { useSelector } from "react-redux";
import { addTrip } from "../../../utils/firebaseUtils";


const MapComponent = () => {

    const uid = useSelector((state) => state.auth.userId);
    const name = useSelector((state) => state.auth.username);
    
    const [selectedLocation, setSelectedLocation] = useState();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogLocation, setDialogLocation] = useState("");
    const [locationPhotos, setLocationPhotos] = useState([]);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [isAddingTrip, setIsAddingTrip] = useState(false);

    const [tripForm, setTripForm] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        participants: []
    });

    const onAddLocation = async () => {
        if (!uid) {
            console.error("User ID is required to add a trip");
            alert("Please log in to add a trip");
            return;
        }

        if (!placeDetails || !tripForm.name || !tripForm.startDate || !tripForm.endDate) {
            alert("Please fill in all required fields (Trip Name, Start Date, End Date)");
            return;
        }

        setIsAddingTrip(true);

        try {
            const destination = placeDetails ? 
                `${placeDetails.name}, ${placeDetails.address}` : 
                `${dialogLocation.lat}, ${dialogLocation.lng}`;

            const tripPic = locationPhotos.length > 0 ? locationPhotos[0] : null;

            const tripId = await addTrip(
                uid,
                tripForm.description,
                destination,
                tripForm.startDate,
                tripForm.endDate,
                tripForm.name,
                tripForm.participants,
                tripPic
            );

            if (tripId) {
                console.log("Trip added successfully with ID:", tripId);
                alert("Trip added successfully!");
                
                // Reset form and close dialog
                setTripForm({
                    name: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    participants: []
                });
                setShowDialog(false);
                setSelectedLocation(null);
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

    const handleFormChange = (field, value) => {
        setTripForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleParticipantsChange = (value) => {
        const participantsList = value.split(',').map(p => p.trim()).filter(p => p.length > 0);
        setTripForm(prev => ({
            ...prev,
            participants: participantsList
        }));
    };

    const fetchLocationPhotos = async (lat, lng) => {
        setLoadingPhotos(true);
        setLocationPhotos([]);
        setPlaceDetails(null);

        try {
            if (!window.google || !window.google.maps || !window.google.maps.places) {
                console.error('Google Maps Places API not loaded');
                setLoadingPhotos(false);
                return;
            }

            const { Place } = window.google.maps.places;
            
            const request = {
                fields: ['displayName', 'photos', 'formattedAddress', 'rating', 'id'],
                locationRestriction: {
                    center: { lat: lat, lng: lng },
                    radius: 100.0,
                },
                includedTypes: ['tourist_attraction', 'restaurant', 'lodging', 'store', 'park'],
                maxResultCount: 3,
            };

            const { places } = await Place.searchNearby(request);
            
            if (places && places.length > 0) {
                let placeWithPhotos = null;
                
                for (const place of places) {
                    if (place.photos && place.photos.length > 0) {
                        placeWithPhotos = place;
                        break;
                    }
                }
                
                const selectedPlace = placeWithPhotos || places[0];
                
                setPlaceDetails({
                    name: selectedPlace.displayName,
                    address: selectedPlace.formattedAddress,
                    rating: selectedPlace.rating
                });

                if (selectedPlace.displayName && !tripForm.name) {
                    setTripForm(prev => ({
                        ...prev,
                        name: `Trip to ${selectedPlace.displayName}`
                    }));
                }

                if (selectedPlace.photos && selectedPlace.photos.length > 0) {
                    try {
                        const photoUrls = [];
                        const photo = selectedPlace.photos[0];
                        
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        const photoUrl = photo.getURI({ 
                            maxWidth: 200, 
                            maxHeight: 150 
                        });
                        
                        photoUrls.push(photoUrl);
                        setLocationPhotos(photoUrls);
                    } catch (photoError) {
                        console.warn('Photo loading failed (rate limited):', photoError);
                    }
                }
            }
            
            setLoadingPhotos(false);

        } catch (error) {
            console.error('Error fetching photos:', error);
            setLoadingPhotos(false);
        }
    };

    const handleMapClick = (mapInfo) => {
        if (mapInfo && mapInfo.detail && mapInfo.detail.latLng) {
            const lat = mapInfo.detail.latLng.lat;
            const lng = mapInfo.detail.latLng.lng;
            
            setDialogLocation({ lat, lng });
            setSelectedLocation({ lat, lng });
            setShowDialog(true);
            
            setTripForm({
                name: "",
                description: "",
                startDate: "",
                endDate: "",
                participants: []
            });
            
            fetchLocationPhotos(lat, lng);
        } else {
            console.log("NO LOCATION SPECIFIED", mapInfo);
        }
    }

    return (
        <APIProvider 
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={['places']}
        >
            <Map
                style={{width: '100vw', height: '50vh'}}
                defaultCenter={{lat: 22.54992, lng: 0}}
                defaultZoom={3}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId={"3559db7569081dbf973e4ebf"}
                onClick={(mapInfo)=>handleMapClick(mapInfo)}
            >
                <PoiMarkers locationInfo={selectedLocation}></PoiMarkers>
                
                {showDialog && (
                    <InfoWindow position={dialogLocation}>
                        <div className="info-window-container" style={{ minWidth: '300px', padding: '10px' }}>
                            {placeDetails && (
                                <div className="place-details" style={{ marginBottom: '15px' }}>
                                    <h4 className="place-name">{placeDetails.name}</h4>
                                    {placeDetails.rating && (
                                        <p className="place-rating">
                                            Rating: {placeDetails.rating}/5 ⭐
                                        </p>
                                    )}
                                    <p className="place-address">
                                        {placeDetails.address}
                                    </p>
                                </div>
                            )}
                            
                            {loadingPhotos ? (
                                <p>Loading photos...</p>
                            ) : (
                                <div style={{ marginBottom: '15px' }}>
                                    {locationPhotos.length > 0 ? (
                                        <div className="photos-section">
                                            <p className="photos-label">Photos:</p>
                                            <div className="photos-grid">
                                                {locationPhotos.map((photoUrl, index) => (
                                                    <img 
                                                        key={index}
                                                        src={photoUrl} 
                                                        alt={`Location ${index + 1}`}
                                                        className="location-photo"
                                                        style={{ width: '100%', maxWidth: '200px', height: 'auto' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="no-photos">No photos available</p>
                                    )}
                                </div>
                            )}

                            {/* Trip Form */}
                            <div className="trip-form" style={{ marginBottom: '15px' }}>
                                <h4>Create Trip</h4>
                                
                                <div style={{ marginBottom: '10px' }}>
                                    <label>Trip Name *</label>
                                    <input
                                        type="text"
                                        value={tripForm.name}
                                        onChange={(e) => handleFormChange('name', e.target.value)}
                                        placeholder="Enter trip name"
                                        style={{ width: '100%', padding: '5px', marginTop: '3px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <label>Description</label>
                                    <textarea
                                        value={tripForm.description}
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
                                            value={tripForm.startDate}
                                            onChange={(e) => handleFormChange('startDate', e.target.value)}
                                            style={{ width: '100%', padding: '5px', marginTop: '3px' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label>End Date *</label>
                                        <input
                                            type="date"
                                            value={tripForm.endDate}
                                            onChange={(e) => handleFormChange('endDate', e.target.value)}
                                            style={{ width: '100%', padding: '5px', marginTop: '3px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <label>Participants (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={tripForm.participants.join(', ')}
                                        onChange={(e) => handleParticipantsChange(e.target.value)}
                                        placeholder="Enter participant names/emails"
                                        style={{ width: '100%', padding: '5px', marginTop: '3px' }}
                                    />
                                </div>
                            </div>
                            
                            <button 
                                className="app-button" 
                                onClick={onAddLocation}
                                disabled={isAddingTrip}
                                style={{ 
                                    width: '100%', 
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
                        </div>
                    </InfoWindow>
                )}
            </Map>
        </APIProvider>
    )
}

export default MapComponent;