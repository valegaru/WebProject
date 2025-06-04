import { APIProvider, InfoWindow, Map } from "@vis.gl/react-google-maps";
import PoiMarkers from "../PoiMarker/PoiMarkers";
import MapForm from "../MapForm/MapForm";
import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchLocationData } from "../../../utils/googleMapsUtils";

const MapComponent = () => {
    const uid = useSelector((state) => state.auth.userId);
    const name = useSelector((state) => state.auth.username);
    
    const [selectedLocation, setSelectedLocation] = useState();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogLocation, setDialogLocation] = useState("");
    const [locationPhoto, setLocationPhoto] = useState(null);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [initialTripName, setInitialTripName] = useState("");

    const fetchLocationPhotos = async (lat, lng) => {
        setLoadingPhotos(true);
        setLocationPhoto(null);
        setPlaceDetails(null);
        setInitialTripName("");

        const { placeDetails: fetchedPlaceDetails, photoUrl, error } = await fetchLocationData(lat, lng);
        
        if (error) {
            console.error('Error fetching location data:', error);
        }

        if (fetchedPlaceDetails) {
            setPlaceDetails(fetchedPlaceDetails);
            
            if (fetchedPlaceDetails.name) {
                setInitialTripName(`Trip to ${fetchedPlaceDetails.name}`);
            }
        }

        if (photoUrl) {
            setLocationPhoto(photoUrl);
        }

        setLoadingPhotos(false);
    };

    const handleMapClick = (mapInfo) => {
        if (mapInfo && mapInfo.detail && mapInfo.detail.latLng) {
            const lat = mapInfo.detail.latLng.lat;
            const lng = mapInfo.detail.latLng.lng;
            
            setDialogLocation({ lat, lng });
            setSelectedLocation({ lat, lng });
            setShowDialog(true);
            
            fetchLocationPhotos(lat, lng);
        } else {
            console.log("NO LOCATION SPECIFIED", mapInfo);
        }
    };

    const handleTripAdded = (tripId) => {
        setShowDialog(false);
        setSelectedLocation(null);
        setPlaceDetails(null);
        setLocationPhoto(null);
        setInitialTripName("");
    };

    const handleCancelTrip = () => {
        setShowDialog(false);
        setSelectedLocation(null);
        setPlaceDetails(null);
        setLocationPhoto(null);
        setInitialTripName("");
    };

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
                                    {locationPhoto ? (
                                        <div className="photos-section">
                                            <p className="photos-label">Photo:</p>
                                            <div className="photo-container">
                                                <img 
                                                    src={locationPhoto} 
                                                    alt="Location"
                                                    className="location-photo"
                                                    style={{ width: '100%', maxWidth: '280px', height: 'auto', borderRadius: '8px' }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="no-photos">No photos available</p>
                                    )}
                                </div>
                            )}

                            <MapForm
                                uid={uid}
                                placeDetails={placeDetails}
                                dialogLocation={dialogLocation}
                                locationPhoto={locationPhoto}
                                onTripAdded={handleTripAdded}
                                onCancel={handleCancelTrip}
                                initialTripName={initialTripName}
                            />
                        </div>
                    </InfoWindow>
                )}
            </Map>
        </APIProvider>
    )
}

export default MapComponent;