// ==========================================
// GOOGLE PLACES API SERVICE
// ==========================================

class PlacesService {
    constructor() {
        this.cache = new Map();
        this.lastSearchLocation = null;
    }

    // Fetch nearby restaurants
    async getNearbyRestaurants(lat, lng, radius = (typeof CONFIG !== 'undefined' ? CONFIG.SEARCH_RADIUS : 5000)) {
        const cacheKey = `nearby_${lat}_${lng}_${radius}`;

        // Check cache first
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('✓ Using cached restaurant data');
            return cached;
        }

        // Note: Direct API calls from browser will fail due to CORS
        // In production, you need either:
        // 1. A backend proxy server
        // 2. Use Google Maps JavaScript API (loaded via script tag)

        try {
            // Using Maps JavaScript API (if available)
            if (typeof google !== 'undefined' && google.maps) {
                return await this.searchWithMapsAPI(lat, lng, radius);
            } else {
                console.warn('⚠ Google Maps API not loaded. Using fallback mode.');
                return this.getFallbackData(lat, lng);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            return this.getFallbackData(lat, lng);
        }
    }

    // Search using Google Maps JavaScript API
    async searchWithMapsAPI(lat, lng, radius) {
        return new Promise((resolve, reject) => {
            const map = new google.maps.Map(document.createElement('div'));
            const service = new google.maps.places.PlacesService(map);

            const request = {
                location: new google.maps.LatLng(lat, lng),
                radius: radius,
                type: 'restaurant'
            };

            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const restaurants = results.map(place => ({
                        id: place.place_id,
                        name: place.name,
                        address: place.vicinity,
                        coordinates: {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        },
                        rating: place.rating || 0,
                        userRatingsTotal: place.user_ratings_total || 0,
                        priceLevel: place.price_level,
                        types: place.types,
                        photos: place.photos ? place.photos.map(photo => ({
                            url: photo.getUrl({ maxWidth: 400 })
                        })) : [],
                        isOpen: place.opening_hours?.isOpen(),
                        distance: this.calculateDistance(lat, lng,
                            place.geometry.location.lat(),
                            place.geometry.location.lng())
                    }));

                    // Cache the results
                    const cacheKey = `nearby_${lat}_${lng}_${radius}`;
                    this.saveToCache(cacheKey, restaurants);

                    resolve(restaurants);
                } else {
                    reject(new Error(`Places API error: ${status}`));
                }
            });
        });
    }

    // Get place details
    async getPlaceDetails(placeId) {
        const cacheKey = `details_${placeId}`;

        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        return new Promise((resolve, reject) => {
            if (typeof google === 'undefined' || !google.maps) {
                reject(new Error('Google Maps API not loaded'));
                return;
            }

            const map = new google.maps.Map(document.createElement('div'));
            const service = new google.maps.places.PlacesService(map);

            const request = {
                placeId: placeId,
                fields: ['name', 'formatted_phone_number', 'opening_hours', 'website', 'url']
            };

            service.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const details = {
                        phone: place.formatted_phone_number,
                        website: place.website,
                        googleMapsUrl: place.url,
                        hours: place.opening_hours?.weekday_text,
                        isOpen: place.opening_hours?.isOpen()
                    };

                    this.saveToCache(cacheKey, details);
                    resolve(details);
                } else {
                    reject(new Error(`Place details error: ${status}`));
                }
            });
        });
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
