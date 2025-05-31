
export const fetchLocationData = async (lat, lng) => {
    try {
        // Check if Google Maps Places API is loaded
        if (!window.google || !window.google.maps || !window.google.maps.places) {
            console.error('Google Maps Places API not loaded');
            return {
                placeDetails: null,
                photoUrl: null,
                error: 'Google Maps Places API not loaded'
            };
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
            // Try to find a place with photos first
            let placeWithPhotos = null;
            
            for (const place of places) {
                if (place.photos && place.photos.length > 0) {
                    placeWithPhotos = place;
                    break;
                }
            }
            
            // Use the first place with photos, or just the first place if none have photos
            const selectedPlace = placeWithPhotos || places[0];
            
            // Prepare place details
            const placeDetails = {
                name: selectedPlace.displayName,
                address: selectedPlace.formattedAddress,
                rating: selectedPlace.rating
            };

            // Get high-resolution photo if available
            let photoUrl = null;
            if (selectedPlace.photos && selectedPlace.photos.length > 0) {
                try {
                    // Add delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Get high-resolution photo (increased from 200x150 to 800x600)
                    const photo = selectedPlace.photos[0];
                    photoUrl = photo.getURI({ 
                        maxWidth: 800, 
                        maxHeight: 600 
                    });
                } catch (photoError) {
                    console.warn('Photo loading failed (rate limited):', photoError);
                    // Continue without photo if rate limited
                }
            }

            return {
                placeDetails,
                photoUrl,
                error: null
            };
        } else {
            return {
                placeDetails: null,
                photoUrl: null,
                error: 'No places found at this location'
            };
        }
        
    } catch (error) {
        console.error('Error fetching location data:', error);
        return {
            placeDetails: null,
            photoUrl: null,
            error: error.message || 'Failed to fetch location data'
        };
    }
};