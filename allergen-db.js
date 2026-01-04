// ==========================================
// CURATED ALLERGEN DATABASE
// ==========================================

// Known allergen-safe restaurant chains and their safe menu items
const ALLERGEN_DATABASE = {
    // Fast food chains
    'chipotle': {
        matches: ['chipotle', 'chipotle mexican grill'],
        safeItems: {
            'dairy': ['burrito bowl', 'tacos (no cheese/sour cream)', 'salad', 'guacamole', 'chips', 'sofritas'],
            'gluten': ['burrito bowl', 'salad', 'guacamole', 'chips and guacamole'],
            'nuts': ['most items', 'burrito', 'bowl', 'tacos', ' salad'],
            'soy': ['burrito', 'bowl', 'tacos', 'salad (no sofritas)']
        },
        allergenWarnings: {
            'dairy': ['cheese', 'sour cream', 'queso'],
            'gluten': ['tortilla', 'flour tortilla'],
            'soy': ['sofritas (tofu)']
        }
    },

    'panera': {
        matches: ['panera', 'panera bread'],
        safeItems: {
            'dairy': ['green goddess cobb salad (no cheese)', 'mediterranean bowl'],
            'gluten': ['power bowls', 'salads (no croutons)'],
            'nuts': ['most items except some salads']
        }
    },

    'sweetgreen': {
        matches: ['sweetgreen', 'sweet green'],
        safeItems: {
            'dairy': ['most salads without cheese', 'bowls'],
            'gluten': ['all salads and bowls (no bread)'],
            'nuts': ['most items - check specific salads']
        }
    },

    // Pizza chains with options
    'blaze pizza': {
        matches: ['blaze', 'blaze pizza'],
        safeItems: {
            'dairy': ['vegan cheese option available'],
            'gluten': ['gluten-free crust available']
        }
    },

    'mod pizza': {
        matches: ['mod', 'mod pizza'],
        safeItems: {
            'dairy': ['dairy-free cheese available'],
            'gluten': ['gluten-friendly crust available']
        }
    },

    // Asian cuisine
    'pf changs': {
        matches: ['pf chang', 'p.f. chang'],
        safeItems: {
            'gluten': ['gluten-free menu available', 'lettuce wraps', 'buddha\'s feast'],
            'dairy': ['most items except desserts']
        }
    },

    // Mexican
    'qdoba': {
        matches: ['qdoba'],
        safeItems: {
            'dairy': ['bowl (no cheese/sour cream)', 'guacamole', 'chips'],
            'gluten': ['bowl', 'salad', 'guacamole']
        }
    },

    // American casual
    'red robin': {
        matches: ['red robin'],
        safeItems: {
            'gluten': ['gluten-free buns available', 'wedgie burger (lettuce wrap)'],
            'dairy': ['burgers without cheese']
        }
    },

    // Coffee shops
    'starbucks': {
        matches: ['starbucks'],
        safeItems: {
            'dairy': ['almond milk', 'oat milk', 'soy milk', 'coconut milk options'],
            'gluten': ['most drinks', 'egg bites', 'protein boxes (check specific items)']
        }
    }
};

// ==========================================
// ALLERGEN DATABASE METHODS
// ==========================================

const GENERIC_CUISINE_ADVICE = {
    'fast_food_restaurant': {
        'dairy': ['Burgers (no cheese)', 'Fries', 'Garden Salad (no cheese)', 'Grilled Chicken (unbreaded)'],
        'gluten': ['Burger Bowls (no bun)', 'Salads (no croutons)', 'Grilled Chicken', 'Fries (verify dedicated fryer)'],
        'nuts': ['Most basic burgers', 'Fries', 'Standard salads'],
        'peanuts': ['Most basic burgers', 'Fries', 'Standard salads']
    },
    'pizza_restaurant': {
        'dairy': ['Salads (no cheese)', 'Pizza with NO cheese', 'Vegan cheese options (if available)'],
        'gluten': ['Gluten-free crust (if available)', 'Salads (no croutons)'],
        'dairy-free': ['Pizza without cheese', 'Breadsticks (without butter/cheese)']
    },
    'mexican_restaurant': {
        'dairy': ['Tacos/Burritos (no cheese or sour cream)', 'Guacamole', 'Ceviche', 'Frijoles (check for lard/cheese)'],
        'gluten': ['Corn tortillas', 'Rice and Beans', 'Carnitas', 'Fajitas (with corn tortillas)'],
        'soy': ['Grilled meats', 'Fresh salsas']
    },
    'italian_restaurant': {
        'dairy': ['Pasta with marinara (no parm)', 'Grilled fish/chicken', 'Minestrone soup (check for cheese)', 'Bruschetta (no cheese)'],
        'gluten': ['Gluten-free pasta (if available)', 'Grilled meats', 'Risotto (check for bouillon/butter)']
    },
    'japanese_restaurant': {
        'dairy': ['Most sushi rolls', 'Sashimi', 'Miso soup', 'Edamame', 'Teriyaki (check for soy/gluten)'],
        'gluten': ['Sashimi', 'Steamed rice', 'Tamari-based sauces'],
        'soy': ['Sashimi (no soy sauce)', 'Steamed rice', 'Grilled fish']
    },
    'american_restaurant': {
        'dairy': ['Steak/Grilled Chicken', 'Baked Potato (no butter/sour cream)', 'Steamed Vegetables', 'Salads (no cheese/creamy dressing)'],
        'gluten': ['Grilled proteins', 'Baked potato', 'Steamed vegetables', 'Salads (no croutons/bread)']
    }
};

class AllergenDB {
    constructor() {
        this.database = ALLERGEN_DATABASE;
        this.genericAdvice = GENERIC_CUISINE_ADVICE;
        this.userCustomData = this.loadUserData();
    }

    // Match restaurant name to known chains
    findMatch(restaurantName, cuisineTypes = []) {
        const searchName = restaurantName.toLowerCase();

        // 1. Check curated chains
        for (const [chain, data] of Object.entries(this.database)) {
            if (data.matches.some(match => searchName.includes(match))) {
                return { type: 'curated', chain, data };
            }
        }

        // 2. Check generic advice by cuisine type
        if (cuisineTypes && cuisineTypes.length > 0) {
            for (const type of cuisineTypes) {
                const normalizedType = type.toLowerCase();
                if (this.genericAdvice[normalizedType]) {
                    return {
                        type: 'generic',
                        data: { safeItems: this.genericAdvice[normalizedType] }
                    };
                }
            }
        }

        // 3. Try to guess from name if no types provided
        const nameKeywords = {
            'pizza': 'pizza_restaurant',
            'taco': 'mexican_restaurant',
            'mexican': 'mexican_restaurant',
            'burger': 'fast_food_restaurant',
            'sushi': 'japanese_restaurant',
            'italian': 'italian_restaurant'
        };

        for (const [keyword, adviceKey] of Object.entries(nameKeywords)) {
            if (searchName.includes(keyword)) {
                return {
                    type: 'generic',
                    data: { safeItems: this.genericAdvice[adviceKey] }
                };
            }
        }

        return null;
    }

    // Get safe items for a restaurant
    getSafeItemsForRestaurant(restaurantName, selectedAllergens, cuisineTypes = []) {
        const match = this.findMatch(restaurantName, cuisineTypes);

        if (!match) {
            // Check user custom data
            return this.getUserCustomItems(restaurantName, selectedAllergens);
        }

        const safeItems = [];
        const { data, type } = match;

        // For each allergen the user has selected, check what's safe
        selectedAllergens.forEach(allergen => {
            if (data.safeItems[allergen]) {
                safeItems.push(...data.safeItems[allergen].map(item => ({
                    name: item,
                    category: 'menu item',
                    allergens: [],
                    source: type === 'curated' ? 'curated' : 'general advice'
                })));
            }
        });

        // Remove duplicates
        return Array.from(new Set(safeItems.map(i => i.name)))
            .map(name => safeItems.find(i => i.name === name));
    }

    // Check if restaurant has any safe items
    hasSafeItems(restaurantName, selectedAllergens, cuisineTypes = []) {
        if (selectedAllergens.size === 0) return true;

        const match = this.findMatch(restaurantName, cuisineTypes);
        if (match) {
            return Array.from(selectedAllergens).some(allergen =>
                match.data.safeItems[allergen] && match.data.safeItems[allergen].length > 0
            );
        }

        // Check user custom data
        const customItems = this.getUserCustomItems(restaurantName, selectedAllergens);
        return customItems.length > 0;
    }

    // Get count of safe items
    getSafeItemsCount(restaurantName, selectedAllergens) {
        const items = this.getSafeItemsForRestaurant(restaurantName, selectedAllergens);
        return items ? items.length : 0;
    }

    // User custom data methods
    loadUserData() {
        const stored = localStorage.getItem('allergen_safe_eats_custom_data');
        return stored ? JSON.parse(stored) : {};
    }

    saveUserData() {
        localStorage.setItem('allergen_safe_eats_custom_data', JSON.stringify(this.userCustomData));
    }

    addCustomItem(restaurantId, restaurantName, menuItem) {
        if (!this.userCustomData[restaurantId]) {
            this.userCustomData[restaurantId] = {
                name: restaurantName,
                items: []
            };
        }

        // Default source to 'user' if not specified
        if (!menuItem.source) menuItem.source = 'user';

        this.userCustomData[restaurantId].items.push(menuItem);
        this.saveUserData();
    }

    getUserCustomItems(restaurantName, selectedAllergens) {
        // Find in user data by name
        const entry = Object.values(this.userCustomData).find(
            data => data.name.toLowerCase() === restaurantName.toLowerCase()
        );

        if (!entry) return [];

        // Filter items that don't contain selected allergens
        return entry.items.filter(item => {
            const hasSelectedAllergen = item.allergens.some(allergen => selectedAllergens.has(allergen));
            return !hasSelectedAllergen;
        }).map(item => ({
            ...item,
            source: item.source || 'user'
        }));
    }

    // Export user data
    exportUserData() {
        return JSON.stringify(this.userCustomData, null, 2);
    }

    // Import user data
    importUserData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.userCustomData = { ...this.userCustomData, ...data };
            this.saveUserData();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Create singleton instance
const allergenDB = new AllergenDB();
