import React, { useRef, useState, useEffect } from 'react';

const DestinationSearch = ({ selectedCountries, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);
  const autocompleteService = useRef(null);
  const searchInputRef = useRef(null);

  const checkGoogleMapsReady = () => {
    return window.google &&
           window.google.maps &&
           window.google.maps.places &&
           window.google.maps.places.AutocompleteService;
  };

  useEffect(() => {
    const initializeServices = () => {
      if (checkGoogleMapsReady()) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        setIsGoogleMapsReady(true);
        return;
      }

      setTimeout(initializeServices, 100);
    };

    initializeServices();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    if (!isGoogleMapsReady || !autocompleteService.current) {
      console.warn('Google Maps API not ready yet');
      return;
    }

    setIsLoading(true);
    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        types: ['(regions)'], // This focuses on countries and regions
        componentRestrictions: {} // No country restriction to get all countries
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Filter to prioritize countries (they usually have shorter descriptions)
          const filteredPredictions = predictions
            .filter(prediction => {
              const desc = prediction.description.toLowerCase();
              // Filter out cities and specific places, keep countries and regions
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
  };

  const handlePredictionSelect = (prediction) => {
    const countryName = prediction.description;

    // Check if country is already selected
    if (!selectedCountries.includes(countryName)) {
      const updatedCountries = [...selectedCountries, countryName];
      onChange(updatedCountries);
    }

    setInputValue('');
    setShowPredictions(false);
    setPredictions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && predictions.length > 0) {
      e.preventDefault();
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
          disabled={!isGoogleMapsReady}
          style={{
            width: '100%',
            backgroundColor: isGoogleMapsReady ? 'white' : '#f5f5f5',
            cursor: isGoogleMapsReady ? 'text' : 'not-allowed',
            position: 'relative'
          }}
        />

        {isLoading && (
          <div style={{
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
          }}></div>
        )}

        {showPredictions && predictions.length > 0 && (
          <div style={{
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
          }}>
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