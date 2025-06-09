import { APIProvider, InfoWindow, Map } from '@vis.gl/react-google-maps';
import PoiMarkers from '../PoiMarker/PoiMarkers';
import MapForm from '../MapForm/MapForm';
import SearchBar from '../SearchBar/SearchBar';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLocationData } from '../../../utils/googleMapsUtils';
import { clearMapMarkers, setMapType } from '../../../store/mapInfo/MapInfo';

const MapComponent = () => {
  
  const dispatch = useDispatch()
  const uid = useSelector((state) => state.auth.userId);
  const name = useSelector((state) => state.auth.username);
  const mapType = useSelector((state) => state.mapInfo.type)
  const mapMarkers = useSelector((state) => state.mapInfo.markers)

  const [selectedLocation, setSelectedLocation] = useState();
  const [showPanel, setShowPanel] = useState(false);
  const [dialogLocation, setDialogLocation] = useState("");
  const [locationPhoto, setLocationPhoto] = useState(null);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [initialTripName, setInitialTripName] = useState("");

  const [defaultMapCenter] = useState({ lat: 22.54992, lng: 0 });
  const [defaultMapZoom] = useState(3);

  const mapRef = useRef(null);

	const fetchLocationPhotos = async (lat, lng) => {
		setLoadingPhotos(true);
		setLocationPhoto(null);
		setPlaceDetails(null);
		setInitialTripName('');

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
      setShowPanel(true);
      fetchLocationPhotos(lat, lng);
    } else {
      console.log("NO LOCATION SPECIFIED", mapInfo);
    }
  };

  const handleSearchLocationSelect = (location) => {
    const { lat, lng, placeDetails: searchPlaceDetails } = location;

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }

    setDialogLocation({ lat, lng });
    setSelectedLocation({ lat, lng });
    setShowPanel(true);

		if (searchPlaceDetails) {
			setPlaceDetails(searchPlaceDetails);
			setLoadingPhotos(false);
			if (searchPlaceDetails.name) {
				setInitialTripName(`Trip to ${searchPlaceDetails.name}`);
			}
			if (searchPlaceDetails.photos?.length > 0) {
				const photoUrl = searchPlaceDetails.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 });
				setLocationPhoto(photoUrl);
			} else {
				setLocationPhoto(null);
			}
		} else {
			fetchLocationPhotos(lat, lng);
		}
	};

  const handleTripAdded = (tripId) => {
    setShowPanel(false);
    setSelectedLocation(null);
    setPlaceDetails(null);
    setLocationPhoto(null);
    setInitialTripName("");
  };

  const handleCancelTrip = () => {
    setShowPanel(false);
    setSelectedLocation(null);
    setPlaceDetails(null);
    setLocationPhoto(null);
    setInitialTripName("");
  };

  useEffect(()=>{
    dispatch(clearMapMarkers())
    dispatch(setMapType("places"))
  },[dispatch])

  return (
    <div style={{ position: 'relative', width: '100%', height: '50vh', display: 'flex' }}>
      {showPanel && (
        <div style={{
          width: '400px',
          minWidth: '400px',
          height: '100%',
          backgroundColor: 'white',
          borderRight: '1px solid #ddd',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <button 
                onClick={handleCancelTrip}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '3px'
                }}
              >
                ✕
              </button>
            </div>

            {placeDetails && (
              <div className="place-details" style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <h4 className="place-name" style={{ margin: '0 0 8px 0' }}>{placeDetails.name}</h4>
                {placeDetails.rating && (
                  <p className="place-rating" style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                    Rating: {placeDetails.rating}/5 ⭐
                  </p>
                )}
                <p className="place-address" style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  {placeDetails.address}
                </p>
              </div>
            )}

            {loadingPhotos ? (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p>Loading photos...</p>
              </div>
            ) : (
              locationPhoto && (
                <div style={{ marginBottom: '20px' }}>
                  <img
                    src={locationPhoto}
                    alt="Location"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              )
            )}
            {mapType == "places" &&
            <MapForm
              uid={uid}
              placeDetails={placeDetails}
              dialogLocation={dialogLocation}
              locationPhoto={locationPhoto}
              onTripAdded={handleTripAdded}
              onCancel={handleCancelTrip}
              initialTripName={initialTripName}
            />}
          </div>
        </div>
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            {mapType == "places" &&
            <SearchBar
              onLocationSelect={handleSearchLocationSelect}
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            />
            }
          </div>
        </div>

        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
          <Map
            ref={mapRef}
            style={{ width: '100%', height: '100%' }}
            defaultCenter={defaultMapCenter}
            defaultZoom={defaultMapZoom}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={"624601b44f7f9812ef057a38"}
            onClick={(mapInfo) => handleMapClick(mapInfo)}
          >
            <PoiMarkers locationInfo={selectedLocation}></PoiMarkers>
            {mapMarkers && mapMarkers.length > 0 && mapMarkers.map((marker, index) => (
              <PoiMarkers 
                key={marker.id || `marker-${index}`} 
                locationInfo={marker.coordinates || marker.position}
              />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default MapComponent;
