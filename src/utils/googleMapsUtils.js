export const fetchLocationData = async (lat, lng) => {
    try {
        if (!window.google || !window.google.maps || !window.google.maps.places || !window.google.maps.places.Place) {
            console.error('Google Maps Places API (New) not loaded');
            return {
                placeDetails: null,
                photoUrl: null,
                error: 'Google Maps Places API not loaded'
            };
        }

        const { Place } = window.google.maps.places;
        
        let places = [];
        
        try {
            const request = {
                fields: ['displayName', 'photos', 'formattedAddress', 'rating', 'id', 'location'],
                locationRestriction: {
                    center: { lat: lat, lng: lng },
                    radius: 100.0,
                },
                includedTypes: [
                    'tourist_attraction', 
                    'restaurant', 
                    'lodging', 
                    'store',
                    'park',
                    'museum',
                    'shopping_mall',
                    'gas_station',
                    'hospital',
                    'school',
                    'bank',
                    'church',
                    'library'
                ],
                maxResultCount: 10,
            };

            console.log('Searching for places near:', lat, lng);
            const response = await Place.searchNearby(request);
            places = response.places || [];
            
            if (places.length === 0) {
                const broaderRequest = {
                    ...request,
                    locationRestriction: {
                        center: { lat: lat, lng: lng },
                        radius: 500.0, 
                    },
                    includedTypes: [
                        'tourist_attraction',
                        'restaurant',
                        'store',
                        'park'
                    ]
                };
                
                console.log('Trying broader search...');
                const broaderResponse = await Place.searchNearby(broaderRequest);
                places = broaderResponse.places || [];
            }

            if (places.length === 0) {
                const evenBroaderRequest = {
                    ...request,
                    locationRestriction: {
                        center: { lat: lat, lng: lng },
                        radius: 1000.0, 
                    },
                    includedTypes: ['restaurant'],
                };
                
                console.log('Trying even broader search with restaurants only...');
                const evenBroaderResponse = await Place.searchNearby(evenBroaderRequest);
                places = evenBroaderResponse.places || [];
            }
            
        } catch (searchError) {
            console.error('Places search failed:', searchError);
            places = [];
        }
        
        if (places && places.length > 0) {
            console.log(`Found ${places.length} places`);
            
            let selectedPlace = null;
            
            selectedPlace = places.find(place => 
                place.photos && place.photos.length > 0 && 
                place.rating && place.rating >= 4.0
            );
            
            if (!selectedPlace) {
                selectedPlace = places.find(place => place.photos && place.photos.length > 0);
            }
            
            if (!selectedPlace) {
                selectedPlace = places.find(place => place.rating && place.rating >= 4.0);
            }
            
            if (!selectedPlace) {
                selectedPlace = places[0];
            }
            
            console.log('Selected place:', selectedPlace.displayName);
            
            const placeDetails = {
                name: selectedPlace.displayName || 'Unknown Location',
                address: selectedPlace.formattedAddress || 'Address not available',
                rating: selectedPlace.rating || null
            };

            let photoUrl = null;
            if (selectedPlace.photos && selectedPlace.photos.length > 0) {
                try {
                    console.log('Attempting to load photo...');
                    
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                    const photo = selectedPlace.photos[0];
                    
                    try {
                        photoUrl = photo.getURI({ 
                            maxWidth: 800, 
                            maxHeight: 600 
                        });
                        console.log('High-res photo loaded successfully');
                    } catch (highResError) {
                        console.warn('High-res photo failed, trying medium:', highResError);
                        try {
                            photoUrl = photo.getURI({ 
                                maxWidth: 400, 
                                maxHeight: 300 
                            });
                            console.log('Medium-res photo loaded successfully');
                        } catch (medResError) {
                            console.warn('Medium-res photo failed, trying low:', medResError);
                            try {
                                photoUrl = photo.getURI({ 
                                    maxWidth: 200, 
                                    maxHeight: 150 
                                });
                                console.log('Low-res photo loaded successfully');
                            } catch (lowResError) {
                                console.warn('All photo resolutions failed:', lowResError);
                            }
                        }
                    }
                } catch (photoError) {
                    console.warn('Photo loading completely failed:', photoError);
                }
            } else {
                console.log('No photos available for this place');
            }

            return {
                placeDetails,
                photoUrl,
                error: null
            };
            
        } else {
            console.log('No places found, trying reverse geocoding...');
            
            try {
                let geocodeResult = null;
                
                if (window.google.maps.geocoding && window.google.maps.geocoding.Geocoder) {
                    const geocoder = new window.google.maps.geocoding.Geocoder();
                    const response = await geocoder.geocode({
                        location: { lat, lng }
                    });
                    geocodeResult = response.results[0];
                } else {
                    const geocoder = new window.google.maps.Geocoder();
                    geocodeResult = await new Promise((resolve, reject) => {
                        const timeoutId = setTimeout(() => reject(new Error('Geocoding timeout')), 5000);
                        
                        geocoder.geocode({ 
                            location: { lat, lng } 
                        }, (results, status) => {
                            clearTimeout(timeoutId);
                            if (status === 'OK' && results && results.length > 0) {
                                resolve(results[0]);
                            } else {
                                resolve(null);
                            }
                        });
                    });
                }

                if (geocodeResult) {
                    const addressComponents = geocodeResult.formatted_address.split(',');
                    const placeDetails = {
                        name: addressComponents[0]?.trim() || 'Unknown Location',
                        address: geocodeResult.formatted_address,
                        rating: null
                    };

                    console.log('Geocoding successful:', placeDetails.name);
                    return {
                        placeDetails,
                        photoUrl: null,
                        error: null
                    };
                }
            } catch (geocodeError) {
                console.warn('Geocoding failed:', geocodeError);
            }

            const placeDetails = {
                name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                address: 'Address not available',
                rating: null
            };

            console.log('Using coordinate-based fallback');
            return {
                placeDetails,
                photoUrl: null,
                error: null
            };
        }
        
    } catch (error) {
        console.error('Error in fetchLocationData:', error);
        
        return {
            placeDetails: {
                name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                address: 'Unable to fetch location data',
                rating: null
            },
            photoUrl: null,
            error: error.message || 'Failed to fetch location data'
        };
    }
};

export const checkPlacesAPIAvailability = () => {
    const hasOldAPI = !!(window.google?.maps?.places?.PlacesService);
    const hasNewAPI = !!(window.google?.maps?.places?.Place);
    
    return {
        hasOldAPI,
        hasNewAPI,
        recommendation: hasNewAPI ? 'Use new API' : hasOldAPI ? 'Use old API' : 'No API available'
    };
};

export const getSupportedPlaceTypes = () => {
    return [
        'accounting',
        'airport',
        'amusement_park',
        'aquarium',
        'art_gallery',
        'atm',
        'bakery',
        'bank',
        'bar',
        'beauty_salon',
        'bicycle_store',
        'book_store',
        'bowling_alley',
        'bus_station',
        'cafe',
        'campground',
        'car_dealer',
        'car_rental',
        'car_repair',
        'car_wash',
        'casino',
        'cemetery',
        'church',
        'city_hall',
        'clothing_store',
        'convenience_store',
        'courthouse',
        'dentist',
        'department_store',
        'doctor',
        'drugstore',
        'electrician',
        'electronics_store',
        'embassy',
        'fire_station',
        'florist',
        'funeral_home',
        'furniture_store',
        'gas_station',
        'gym',
        'hair_care',
        'hardware_store',
        'hindu_temple',
        'home_goods_store',
        'hospital',
        'insurance_agency',
        'jewelry_store',
        'laundry',
        'lawyer',
        'library',
        'light_rail_station',
        'liquor_store',
        'local_government_office',
        'locksmith',
        'lodging',
        'meal_delivery',
        'meal_takeaway',
        'mosque',
        'movie_rental',
        'movie_theater',
        'moving_company',
        'museum',
        'night_club',
        'painter',
        'park',
        'parking',
        'pet_store',
        'pharmacy',
        'physiotherapist',
        'plumber',
        'police',
        'post_office',
        'primary_school',
        'real_estate_agency',
        'restaurant',
        'roofing_contractor',
        'rv_park',
        'school',
        'secondary_school',
        'shoe_store',
        'shopping_mall',
        'spa',
        'stadium',
        'storage',
        'store',
        'subway_station',
        'supermarket',
        'synagogue',
        'taxi_stand',
        'tourist_attraction',
        'train_station',
        'transit_station',
        'travel_agency',
        'university',
        'veterinary_care',
        'zoo'
    ];
};

export const fetchLocationDataSimple = async (lat, lng) => {
    try {
        console.log('Using simple geocoding approach...');
        
        if (!window.google?.maps?.Geocoder) {
            throw new Error('Google Maps Geocoder not available');
        }

        const geocoder = new window.google.maps.Geocoder();
        
        const result = await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('Geocoding timeout'));
            }, 5000);
            
            geocoder.geocode({ 
                location: { lat, lng } 
            }, (results, status) => {
                clearTimeout(timeoutId);
                if (status === 'OK' && results && results.length > 0) {
                    resolve(results[0]);
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });

        const addressComponents = result.formatted_address.split(',');
        
        return {
            placeDetails: {
                name: addressComponents[0]?.trim() || 'Unknown Location',
                address: result.formatted_address,
                rating: null
            },
            photoUrl: null, 
            error: null
        };
        
    } catch (error) {
        console.error('Simple location fetch failed:', error);
        return {
            placeDetails: {
                name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                address: 'Address unavailable',
                rating: null
            },
            photoUrl: null,
            error: error.message
        };
    }
};