import { useState, useRef, useEffect } from "react";

const SearchBar = ({ onLocationSelect, googleMapsApiKey }) => {
  const [searchValue, setSearchValue] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const dummyMap = new window.google.maps.Map(document.createElement('div'));
      placesService.current = new window.google.maps.places.PlacesService(dummyMap);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    if (autocompleteService.current) {
      setIsLoading(true);
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['establishment', 'geocode'],
        },
        (predictions, status) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions.slice(0, 5));
            setShowPredictions(true);
          } else {
            setPredictions([]);
            setShowPredictions(false);
          }
        }
      );
    }
  };

  const handlePredictionSelect = (prediction) => {
    setSearchValue(prediction.description);
    setShowPredictions(false);
    setPredictions([]);

    if (placesService.current) {
      setIsLoading(true);
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['geometry', 'name', 'formatted_address', 'rating', 'photos']
        },
        (place, status) => {
          setIsLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              placeDetails: {
                name: place.name,
                address: place.formatted_address,
                rating: place.rating,
                photos: place.photos
              }
            };
            onLocationSelect(location);
          } else {
            console.error('Error getting place details:', status);
            alert('Error getting location details. Please try again.');
          }
        }
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && predictions.length > 0) {
      handlePredictionSelect(predictions[0]);
    }
  };

  const handleClickOutside = (e) => {
    if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
      setShowPredictions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div 
      className="search-bar-container" 
      style={{ 
        position: 'relative', 
        zIndex: 1000,
        // KEY FIX: Add pointer-events: none to the container
        pointerEvents: 'none',
        width: 'fit-content', // Constrain container to actual content size
        margin: '0 auto' // Center the search bar
      }}
    >
      <div 
        ref={searchInputRef} 
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '400px',
          // KEY FIX: Re-enable pointer events for the actual search elements
          pointerEvents: 'auto'
        }}
      >
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            placeholder="Search for a location..."
            style={{
              width: '100%',
              padding: '12px 45px 12px 15px',
              fontSize: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '25px',
              outline: 'none',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              backgroundColor: 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 4px 15px rgba(0,123,255,0.2)';
            }}
            onBlur={(e) => {
              if (!showPredictions) {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }
            }}
          />
          <div style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666',
            pointerEvents: 'none'
          }}>
            {isLoading ? (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #f3f3f3',
                borderTop: '2px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            )}
          </div>
        </div>

        {showPredictions && predictions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            marginTop: '5px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1001
          }}>
            {predictions.map((prediction, index) => (
              <div
                key={prediction.place_id}
                onClick={() => handlePredictionSelect(prediction)}
                style={{
                  padding: '12px 15px',
                  cursor: 'pointer',
                  borderBottom: index < predictions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background-color 0.2s ease',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                <div style={{ fontWeight: '500', color: '#333' }}>
                  {prediction.structured_formatting?.main_text || prediction.description}
                </div>
                {prediction.structured_formatting?.secondary_text && (
                  <div style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>
                    {prediction.structured_formatting.secondary_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;