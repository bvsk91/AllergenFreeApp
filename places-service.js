// ==========================================
// GOOGLE PLACES API SERVICE (NEW API)
// ==========================================

class PlacesService {
    constructor() {
        this.cache = new Map();
        this.lastSearchLocation = null;
        this.placesLibrary = null;
    }

    // Initialize the new Places library
    async initPlacesLibrary() {
        if (this.placesLibrary) return this.placesLibrary;

        try {
            if (typeof google !== 'undefined' && google.maps) {
                this.placesLibrary = await google.maps.importLibrary('places');
                console.log('✓ New Places API library loaded');
                return this.placesLibrary;
            }
        } catch (error) {
            console.warn('⚠ Could not load new Places library:', error);
            return null;
        }
    }

    // Fetch nearby restaurants using NEW Places API
    async getNearbyRestaurants(lat, lng, radius = (typeof CONFIG !== 'undefined' ? CONFIG.SEARCH_RADIUS : 5000)) {
        const cacheKey = `nearby_${lat}_${lng}_${radius}`;

        // Check cache first
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('✓ Using cached restaurant data');
            return cached;
        }

        try {
            // Try new Places API first
            const placesLib = await this.initPlacesLibrary();
            if (placesLib) {
                return await this.searchWithNewAPI(lat, lng, radius, placesLib);
            } else {
                console.warn('⚠ New Places API not available. Using fallback mode.');
                return this.getFallbackData(lat, lng);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            return this.getFallbackData(lat, lng);
        }
    }

    // Search using NEW Google Places API
    async searchWithNewAPI(lat, lng, radius, placesLib) {
        try {
            const { Place } = placesLib;
            const center = { lat, lng };

            // Define the search request with field mask
            const request = {
                locationRestriction: {
                    circle: {
                        center: center,
                        radius: radius
                    }
                },
                includedPrimaryTypes: ['restaurant'],
                maxResultCount: 20,
                rankPreference: 'DISTANCE'
            };

            console.log('🔍 Searching for restaurants with new Places API...');

            // Perform the nearby search
            const { places } = await Place.searchNearby(request);

            if (!places || places.length === 0) {
                console.log('ℹ No restaurants found nearby, using fallback data');
                return this.getFallbackData(lat, lng);
            }

            console.log(`✓ Found ${places.length} restaurants from Google Places API`);

            // Transform the results to our format
            const restaurants = await Promise.all(places.map(async (place) => {
                // Fetch required fields for this place
                try {
                    await place.fetchFields({
                        fields: ['id', 'displayName', 'formattedAddress', 'location', 'rating', 'userRatingCount', 'priceLevel', 'types', 'photos', 'regularOpeningHours']
                    });
                } catch (error) {
                    console.warn('Could not fetch all fields for place:', error);
                }

                const placeLocation = place.location;

                return {
                    id: place.id,
                    name: place.displayName || 'Unknown Restaurant',
                    address: place.formattedAddress || 'Address unavailable',
                    coordinates: {
                        lat: placeLocation ? placeLocation.lat() : lat,
                        lng: placeLocation ? placeLocation.lng() : lng
                    },
                    rating: place.rating || 0,
                    userRatingsTotal: place.userRatingCount || 0,
                    priceLevel: place.priceLevel || null,
                    types: place.types || [],
                    photos: place.photos ? place.photos.slice(0, 3).map(photo => ({
                        url: photo.getURI ? photo.getURI({ maxWidth: 400 }) : null
                    })).filter(p => p.url) : [],
                    isOpen: place.regularOpeningHours?.isOpen?.() || null,
                    distance: this.calculateDistance(lat, lng,
                        placeLocation ? placeLocation.lat() : lat,
                        placeLocation ? placeLocation.lng() : lng)
                };
            }));

            // Cache the results
            this.saveToCache(cacheKey, restaurants);

            return restaurants;
        } catch (error) {
            console.error('New Places API error:', error);
            console.log('ℹ Falling back to demo data');
            return this.getFallbackData(lat, lng);
        }
    }

    // Get place details (still using the new API)
    async getPlaceDetails(placeId) {
        const cacheKey = `details_${placeId}`;

        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const placesLib = await this.initPlacesLibrary();
            if (!placesLib) {
                throw new Error('Places library not loaded');
            }

            const { Place } = placesLib;
            const place = new Place({ id: placeId });

            await place.fetchFields({
                fields: ['displayName', 'formattedAddress', 'nationalPhoneNumber', 'websiteURI', 'googleMapsURI', 'regularOpeningHours']
            });

            const details = {
                phone: place.nationalPhoneNumber,
                website: place.websiteURI,
                googleMapsUrl: place.googleMapsURI,
                hours: place.regularOpeningHours?.weekdayDescriptions,
                isOpen: place.regularOpeningHours?.isOpen?.()
            };

            this.saveToCache(cacheKey, details);
            return details;
        } catch (error) {
            console.error('Place details error:', error);
            return null;
        }
    }

    // Fallback data when API is not available
    getFallbackData(lat, lng) {
        console.log('ℹ Using fallback restaurant data');

        // Return the original mock data but redistributed around user location
        const redistributed = RESTAURANTS.map((restaurant, index) => {
            const latOffset = (Math.random() - 0.5) * 0.1;
            const lngOffset = (Math.random() - 0.5) * 0.1;

            return {
                ...restaurant,
                id: restaurant.id.toString(),
                address: 'Address unavailable',
                coordinates: {
                    lat: lat + latOffset,
                    lng: lng + lngOffset
                },
                distance: this.calculateDistance(lat, lng, lat + latOffset, lng + lngOffset),
                photos: [],
                isOpen: true,
                userRatingsTotal: Math.floor(Math.random() * 500) + 50
            };
        });

        return redistributed;
    }

    // Calculate distance using Haversine formula
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10;
    }

    // Cache management
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const age = Date.now() - cached.timestamp;
        const cacheDuration = typeof CONFIG !== 'undefined' ? CONFIG.CACHE_DURATION : (24 * 60 * 60 * 1000);
        if (age > cacheDuration) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    saveToCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }
}

// Create singleton instance
const placesService = new PlacesService();
