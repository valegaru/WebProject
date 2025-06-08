class GooglePlacesRateLimiter {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.lastRequestTime = 0;
        this.minDelay = 1000;
        this.maxRetries = 3;
        this.backoffMultiplier = 2;
    }

    async addToQueue(requestFn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ requestFn, resolve, reject, retries: 0 });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.processing || this.queue.length === 0) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0) {
            const { requestFn, resolve, reject, retries } = this.queue.shift();
            
            try {
                const timeSinceLastRequest = Date.now() - this.lastRequestTime;
                if (timeSinceLastRequest < this.minDelay) {
                    await new Promise(r => setTimeout(r, this.minDelay - timeSinceLastRequest));
                }

                this.lastRequestTime = Date.now();
                const result = await requestFn();
                resolve(result);
                
                await new Promise(r => setTimeout(r, 200));
                
            } catch (error) {
                if (error.status === 429 && retries < this.maxRetries) {
                    const delay = this.minDelay * Math.pow(this.backoffMultiplier, retries);
                    console.warn(`Rate limited, retrying in ${delay}ms (attempt ${retries + 1})`);
                    
                    await new Promise(r => setTimeout(r, delay));
                    
                    this.queue.unshift({ requestFn, resolve, reject, retries: retries + 1 });
                } else {
                    reject(error);
                }
            }
        }

        this.processing = false;
    }
}


const rateLimiter = new GooglePlacesRateLimiter();


const loadPhotoWithRateLimit = async (photo) => {
    try {
        console.log('Adding photo request to rate-limited queue...');
        
        const resolutions = [
            { maxWidth: 400, maxHeight: 300, name: 'medium' }, 
            { maxWidth: 200, maxHeight: 150, name: 'low' },
            { maxWidth: 800, maxHeight: 600, name: 'high' }
        ];
        
        for (const resolution of resolutions) {
            try {
                const photoUrl = await rateLimiter.addToQueue(async () => {
                    console.log(`Attempting ${resolution.name}-res photo...`);
                    const url = photo.getURI(resolution);
                    console.log(`Generated ${resolution.name}-res URL:`, url);
                    return url;
                });
                
                const isValid = await rateLimiter.addToQueue(async () => {
                    return await validateImageUrlSafe(photoUrl);
                });
                
                if (isValid) {
                    console.log(`${resolution.name}-res photo validated successfully`);
                    return photoUrl;
                } else {
                    console.warn(`${resolution.name}-res photo failed validation`);
                }
            } catch (error) {
                console.warn(`${resolution.name}-res photo failed:`, error);
                continue;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Rate-limited photo loading failed:', error);
        return null;
    }
};

const validateImageUrlSafe = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => {
            console.warn('Image validation timeout');
            resolve(false);
        }, 8000); 
        
        img.onload = () => {
            clearTimeout(timeout);
            console.log('Image validation successful');
            resolve(true);
        };
        
        img.onerror = (error) => {
            clearTimeout(timeout);
            console.warn('Image validation failed:', error);
            resolve(false);
        };
        
        img.src = url;
    });
};

const loadPhotoWithoutValidation = async (photo) => {
    try {
        console.log('Loading photo without validation (to avoid rate limits)...');
        
        const url = photo.getURI({ maxWidth: 400, maxHeight: 300 });
        console.log('Generated photo URL:', url);
        
        return url;
    } catch (error) {
        console.error('Photo URL generation failed:', error);
        return null;
    }
};

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
                maxResultCount: 5, 
            };

            console.log('Searching for places near:', lat, lng);
            
            const response = await rateLimiter.addToQueue(async () => {
                return await Place.searchNearby(request);
            });
            
            places = response.places || [];
            
            if (places.length === 0) {
                console.log('No places found, trying broader search...');
                const broaderRequest = {
                    ...request,
                    locationRestriction: {
                        center: { lat: lat, lng: lng },
                        radius: 500.0,
                    },
                    includedTypes: ['restaurant', 'store'], // Fewer types
                    maxResultCount: 3
                };
                
                const broaderResponse = await rateLimiter.addToQueue(async () => {
                    return await Place.searchNearby(broaderRequest);
                });
                places = broaderResponse.places || [];
            }
            
        } catch (searchError) {
            console.error('Places search failed:', searchError);
            places = [];
        }
        
        if (places && places.length > 0) {
            console.log(`Found ${places.length} places`);
            
            const selectedPlace = places.find(place => place.photos && place.photos.length > 0) || places[0];
            
            console.log('Selected place:', selectedPlace.displayName);
            
            const placeDetails = {
                name: selectedPlace.displayName || 'Unknown Location',
                address: selectedPlace.formattedAddress || 'Address not available',
                rating: selectedPlace.rating || null
            };

            let photoUrl = null;
            if (selectedPlace.photos && selectedPlace.photos.length > 0) {
                console.log('Photos available, attempting to load with rate limiting...');
                
                try {
                    photoUrl = await loadPhotoWithoutValidation(selectedPlace.photos[0]);
                    
                } catch (photoError) {
                    console.warn('Photo loading failed:', photoError);
                }
            }

            return {
                placeDetails,
                photoUrl,
                error: null
            };
            
        } else {
            console.log('No places found, trying reverse geocoding...');
            
            try {
                const geocoder = new window.google.maps.Geocoder();
                const geocodeResult = await rateLimiter.addToQueue(async () => {
                    return new Promise((resolve, reject) => {
                        const timeoutId = setTimeout(() => reject(new Error('Geocoding timeout')), 8000);
                        
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
                });

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

export const clearRateLimiterQueue = () => {
    rateLimiter.queue = [];
    rateLimiter.processing = false;
    console.log('Rate limiter queue cleared');
};

export const getRateLimiterStatus = () => {
    return {
        queueLength: rateLimiter.queue.length,
        processing: rateLimiter.processing,
        lastRequestTime: rateLimiter.lastRequestTime
    };
};