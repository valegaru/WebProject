import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

const DestinationSearch = ({ selectedCountries, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);
  
  // Use refs to persist services across re-renders
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const searchInputRef = useRef(null);

  // Memoize the Google Maps ready check
  const checkGoogleMapsReady = useCallback(() => {
    return window.google && 
           window.google.maps && 
           window.google.maps.places && 
           window.google.maps.places.AutocompleteService &&
           window.google.maps.places.PlacesService;
  }, []);

  // Initialize services only once
  useEffect(() => {
    const initializeServices = () => {
      if (checkGoogleMapsReady()) {
        if (!autocompleteService.current) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
        if (!placesService.current) {
          const dummyDiv = document.createElement('div');
          placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
        }
        setIsGoogleMapsReady(true);
        return;
      }
      
      setTimeout(initializeServices, 100);
    };

    initializeServices();
  }, [checkGoogleMapsReady]);

  // Debounced search function to prevent too many API calls
  const searchTimeoutRef = useRef(null);

  const performSearch = useCallback((value) => {
    if (!isGoogleMapsReady || !autocompleteService.current) {
      console.warn('Google Maps API not ready yet');
      return;
    }

    setIsLoading(true);
    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        types: ['(regions)'],
        componentRestrictions: {}
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const filteredPredictions = predictions
            .filter(prediction => {
              const desc = prediction.description.toLowerCase();
              return !desc.includes(',') || desc.split(',').length <= 2;
            })
            .slice(0, 5);
          
          setPredictions(filteredPredictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      }
    );
  }, [isGoogleMapsReady]);

  // Use useCallback to prevent function recreation on every render
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim() === "") {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    // Debounce the search to avoid too many API calls
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [performSearch]);

  const getPlaceDetails = useCallback((placeId) => {
    return new Promise((resolve, reject) => {
      if (!placesService.current) {
        reject(new Error('Places service not available'));
        return;
      }

      placesService.current.getDetails(
        {
          placeId: placeId,
          fields: ['geometry', 'name', 'formatted_address']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              name: place.formatted_address || place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
          } else {
            reject(new Error('Failed to get place details'));
          }
        }
      );
    });
  }, []);

  const handlePredictionSelect = useCallback(async (prediction) => {
    try {
      setIsLoading(true);
      
      const placeDetails = await getPlaceDetails(prediction.place_id);
      
      const existingCountry = selectedCountries.find(country => 
        typeof country === 'string' ? country === placeDetails.name : country.name === placeDetails.name
      );
      
      if (!existingCountry) {
        const destinationWithCoords = {
          name: placeDetails.name,
          coordinates: {
            lat: placeDetails.lat,
            lng: placeDetails.lng
          }
        };
        
        const updatedCountries = [...selectedCountries, destinationWithCoords];
        onChange(updatedCountries);
      }
      
    } catch (error) {
      console.error('Error getting place details:', error);
      const countryName = prediction.description;
      if (!selectedCountries.some(country => 
        typeof country === 'string' ? country === countryName : country.name === countryName
      )) {
        const updatedCountries = [...selectedCountries, { name: countryName, coordinates: null }];
        onChange(updatedCountries);
      }
    } finally {
      setIsLoading(false);
      setInputValue('');
      setShowPredictions(false);
      setPredictions([]);
    }
  }, [selectedCountries, onChange, getPlaceDetails]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && predictions.length > 0) {
      e.preventDefault();
      handlePredictionSelect(predictions[0]);
    }
  }, [predictions, handlePredictionSelect]);

  const handleClickOutside = useCallback((e) => {
    if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
      setShowPredictions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clear timeout on unmount
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [handleClickOutside]);

  // Memoize the input style to prevent recreation
  const inputStyle = useMemo(() => ({
    width: '100%',
    backgroundColor: isGoogleMapsReady && !isLoading ? 'white' : '#f5f5f5',
    cursor: isGoogleMapsReady && !isLoading ? 'text' : 'not-allowed',
    position: 'relative'
  }), [isGoogleMapsReady, isLoading]);

  // Memoize the loading spinner style
  const spinnerStyle = useMemo(() => ({
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }), []);

  // Memoize the dropdown style
  const dropdownStyle = useMemo(() => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    marginTop: '5px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1001
  }), []);

  return (
    <div className='form-group'>
      <label>Destination (country):</label>
      <div 
        ref={searchInputRef}
        style={{ position: 'relative' }}
      >
        <input
          type='text'
          placeholder={isGoogleMapsReady ? 'Start typing a country...' : 'Loading...'}
          className='input'
          value={inputValue}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          disabled={!isGoogleMapsReady || isLoading}
          style={inputStyle}
        />
        
        {isLoading && (
          <div style={spinnerStyle}></div>
        )}

        {showPredictions && predictions.length > 0 && (
          <div style={dropdownStyle}>
            {predictions.map((prediction, index) => (
              <div
                key={prediction.place_id}
                onClick={() => handlePredictionSelect(prediction)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderBottom: index < predictions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background-color 0.2s ease',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                {prediction.description}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DestinationSearch;