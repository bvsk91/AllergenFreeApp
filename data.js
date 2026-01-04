// ==========================================
// ALLERGEN DATA
// ==========================================
const ALLERGENS = [
    { id: 'nuts', name: 'Tree Nuts', icon: '🌰' },
    { id: 'peanuts', name: 'Peanuts', icon: '🥜' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'eggs', name: 'Eggs', icon: '🥚' },
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'soy', name: 'Soy', icon: '🫘' },
    { id: 'shellfish', name: 'Shellfish', icon: '🦞' },
    { id: 'fish', name: 'Fish', icon: '🐟' },
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'sesame', name: 'Sesame', icon: '🫘' },
    { id: 'mustard', name: 'Mustard', icon: '🌭' },
    { id: 'celery', name: 'Celery', icon: '🥬' }
];

// ==========================================
// RESTAURANT DATA WITH MENUS
// ==========================================
const RESTAURANTS = [
    {
        id: 1,
        name: 'Green Leaf Bistro',
        cuisine: 'Vegan',
        rating: 4.8,
        distance: 0.5,
        phone: '+1-555-0101',
        coordinates: { lat: 37.7749, lng: -122.4194 },
        tags: ['vegan', 'organic', 'gluten-free-options'],
        menu: [
            { name: 'Quinoa Power Bowl', category: 'entree', allergens: [] },
            { name: 'Avocado Toast', category: 'appetizer', allergens: ['gluten'] },
            { name: 'Almond Butter Smoothie', category: 'beverage', allergens: ['nuts'] },
            { name: 'Chickpea Curry', category: 'entree', allergens: [] },
            { name: 'Coconut Chia Pudding', category: 'dessert', allergens: [] },
            { name: 'Tahini Buddha Bowl', category: 'entree', allergens: ['sesame'] },
            { name: 'Green Goddess Salad', category: 'appetizer', allergens: [] },
            { name: 'Cashew Cream Pasta', category: 'entree', allergens: ['nuts', 'gluten'] }
        ]
    },
    {
        id: 2,
        name: 'Ocean Breeze Seafood',
        cuisine: 'Seafood',
        rating: 4.5,
        distance: 1.2,
        phone: '+1-555-0102',
        coordinates: { lat: 37.7849, lng: -122.4094 },
        tags: ['seafood', 'fresh-catch'],
        menu: [
            { name: 'Grilled Salmon', category: 'entree', allergens: ['fish'] },
            { name: 'Lobster Bisque', category: 'appetizer', allergens: ['shellfish', 'dairy'] },
            { name: 'Caesar Salad', category: 'appetizer', allergens: ['dairy', 'eggs', 'gluten'] },
            { name: 'Shrimp Scampi', category: 'entree', allergens: ['shellfish', 'gluten', 'dairy'] },
            { name: 'Oysters on the Half Shell', category: 'appetizer', allergens: ['shellfish'] },
            { name: 'Tuna Tartare', category: 'appetizer', allergens: ['fish', 'soy', 'sesame'] },
            { name: 'Grilled Vegetables', category: 'entree', allergens: [] },
            { name: 'Chocolate Lava Cake', category: 'dessert', allergens: ['dairy', 'eggs', 'gluten'] }
        ]
    },
    {
        id: 3,
        name: 'Mama Rosa\'s Trattoria',
        cuisine: 'Italian',
        rating: 4.7,
        distance: 0.8,
        phone: '+1-555-0103',
        coordinates: { lat: 37.7649, lng: -122.4294 },
        tags: ['italian', 'vegetarian-options'],
        menu: [
            { name: 'Margherita Pizza', category: 'entree', allergens: ['gluten', 'dairy'] },
            { name: 'Spaghetti Carbonara', category: 'entree', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'Bruschetta', category: 'appetizer', allergens: ['gluten'] },
            { name: 'Tiramisu', category: 'dessert', allergens: ['dairy', 'eggs', 'gluten'] },
            { name: 'Caprese Salad', category: 'appetizer', allergens: ['dairy'] },
            { name: 'Pesto Gnocchi', category: 'entree', allergens: ['gluten', 'dairy', 'nuts'] },
            { name: 'Minestrone Soup', category: 'appetizer', allergens: [] },
            { name: 'Risotto Primavera', category: 'entree', allergens: ['dairy'] }
        ]
    },
    {
        id: 4,
        name: 'Tokyo Sushi House',
        cuisine: 'Japanese',
        rating: 4.9,
        distance: 1.5,
        phone: '+1-555-0104',
        coordinates: { lat: 37.7949, lng: -122.3994 },
        tags: ['japanese', 'sushi', 'gluten-free-options'],
        menu: [
            { name: 'California Roll', category: 'entree', allergens: ['fish', 'shellfish', 'soy'] },
            { name: 'Miso Soup', category: 'appetizer', allergens: ['soy'] },
            { name: 'Edamame', category: 'appetizer', allergens: ['soy'] },
            { name: 'Teriyaki Chicken', category: 'entree', allergens: ['soy', 'wheat', 'sesame'] },
            { name: 'Sashimi Platter', category: 'entree', allergens: ['fish'] },
            { name: 'Tempura Vegetables', category: 'appetizer', allergens: ['gluten', 'eggs'] },
            { name: 'Green Tea Ice Cream', category: 'dessert', allergens: ['dairy'] },
            { name: 'Seaweed Salad', category: 'appetizer', allergens: ['soy', 'sesame'] }
        ]
    },
    {
        id: 5,
        name: 'The Burger Joint',
        cuisine: 'American',
        rating: 4.3,
        distance: 0.3,
        phone: '+1-555-0105',
        coordinates: { lat: 37.7549, lng: -122.4394 },
        tags: ['american', 'burgers', 'casual'],
        menu: [
            { name: 'Classic Cheeseburger', category: 'entree', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'Sweet Potato Fries', category: 'appetizer', allergens: [] },
            { name: 'Onion Rings', category: 'appetizer', allergens: ['gluten', 'dairy'] },
            { name: 'Grilled Chicken Sandwich', category: 'entree', allergens: ['gluten', 'dairy'] },
            { name: 'Garden Salad', category: 'appetizer', allergens: [] },
            { name: 'Milkshake', category: 'beverage', allergens: ['dairy'] },
            { name: 'French Fries', category: 'appetizer', allergens: [] },
            { name: 'Apple Pie', category: 'dessert', allergens: ['gluten', 'dairy', 'eggs'] }
        ]
    },
    {
        id: 6,
        name: 'Spice Route Indian',
        cuisine: 'Indian',
        rating: 4.6,
        distance: 2.1,
        phone: '+1-555-0106',
        coordinates: { lat: 37.8049, lng: -122.3894 },
        tags: ['indian', 'vegetarian-options', 'vegan-options'],
        menu: [
            { name: 'Chicken Tikka Masala', category: 'entree', allergens: ['dairy'] },
            { name: 'Vegetable Samosas', category: 'appetizer', allergens: ['gluten'] },
            { name: 'Chana Masala', category: 'entree', allergens: [] },
            { name: 'Naan Bread', category: 'appetizer', allergens: ['gluten', 'dairy'] },
            { name: 'Dal Makhani', category: 'entree', allergens: ['dairy'] },
            { name: 'Mango Lassi', category: 'beverage', allergens: ['dairy'] },
            { name: 'Vegetable Biryani', category: 'entree', allergens: [] },
            { name: 'Gulab Jamun', category: 'dessert', allergens: ['dairy', 'gluten'] }
        ]
    },
    {
        id: 7,
        name: 'Mediterranean Mezze',
        cuisine: 'Mediterranean',
        rating: 4.8,
        distance: 1.0,
        phone: '+1-555-0107',
        coordinates: { lat: 37.7749, lng: -122.4094 },
        tags: ['mediterranean', 'healthy', 'vegetarian-options'],
        menu: [
            { name: 'Falafel Platter', category: 'entree', allergens: ['sesame'] },
            { name: 'Hummus with Pita', category: 'appetizer', allergens: ['sesame', 'gluten'] },
            { name: 'Greek Salad', category: 'appetizer', allergens: ['dairy'] },
            { name: 'Lamb Kebab', category: 'entree', allergens: [] },
            { name: 'Baba Ganoush', category: 'appetizer', allergens: ['sesame'] },
            { name: 'Grilled Halloumi', category: 'entree', allergens: ['dairy'] },
            { name: 'Tabbouleh', category: 'appetizer', allergens: ['gluten'] },
            { name: 'Baklava', category: 'dessert', allergens: ['nuts', 'gluten', 'dairy'] }
        ]
    },
    {
        id: 8,
        name: 'Thai Orchid',
        cuisine: 'Thai',
        rating: 4.7,
        distance: 1.8,
        phone: '+1-555-0108',
        coordinates: { lat: 37.7849, lng: -122.4294 },
        tags: ['thai', 'spicy', 'vegetarian-options'],
        menu: [
            { name: 'Pad Thai', category: 'entree', allergens: ['peanuts', 'eggs', 'shellfish', 'soy'] },
            { name: 'Tom Yum Soup', category: 'appetizer', allergens: ['shellfish'] },
            { name: 'Green Curry', category: 'entree', allergens: [] },
            { name: 'Spring Rolls', category: 'appetizer', allergens: ['soy'] },
            { name: 'Mango Sticky Rice', category: 'dessert', allergens: [] },
            { name: 'Basil Fried Rice', category: 'entree', allergens: ['soy', 'eggs'] },
            { name: 'Papaya Salad', category: 'appetizer', allergens: ['peanuts', 'fish'] },
            { name: 'Massaman Curry', category: 'entree', allergens: ['peanuts'] }
        ]
    },
    {
        id: 9,
        name: 'Parisian Café',
        cuisine: 'French',
        rating: 4.9,
        distance: 1.3,
        phone: '+1-555-0109',
        coordinates: { lat: 37.7649, lng: -122.4194 },
        tags: ['french', 'bakery', 'brunch'],
        menu: [
            { name: 'Croissant', category: 'appetizer', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'French Onion Soup', category: 'appetizer', allergens: ['gluten', 'dairy'] },
            { name: 'Quiche Lorraine', category: 'entree', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'Croque Monsieur', category: 'entree', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'Ratatouille', category: 'entree', allergens: [] },
            { name: 'Crème Brûlée', category: 'dessert', allergens: ['dairy', 'eggs'] },
            { name: 'Salade Niçoise', category: 'appetizer', allergens: ['fish', 'eggs'] },
            { name: 'Macaron Assortment', category: 'dessert', allergens: ['nuts', 'eggs', 'dairy'] }
        ]
    },
    {
        id: 10,
        name: 'El Toro Taqueria',
        cuisine: 'Mexican',
        rating: 4.4,
        distance: 0.7,
        phone: '+1-555-0110',
        coordinates: { lat: 37.7549, lng: -122.4294 },
        tags: ['mexican', 'tacos', 'casual'],
        menu: [
            { name: 'Street Tacos', category: 'entree', allergens: ['gluten'] },
            { name: 'Guacamole & Chips', category: 'appetizer', allergens: [] },
            { name: 'Quesadilla', category: 'entree', allergens: ['gluten', 'dairy'] },
            { name: 'Black Bean Soup', category: 'appetizer', allergens: [] },
            { name: 'Carne Asada Burrito', category: 'entree', allergens: ['gluten', 'dairy'] },
            { name: 'Elote (Mexican Corn)', category: 'appetizer', allergens: ['dairy'] },
            { name: 'Churros', category: 'dessert', allergens: ['gluten', 'dairy'] },
            { name: 'Pico de Gallo', category: 'appetizer', allergens: [] }
        ]
    },
    {
        id: 11,
        name: 'Seoul Kitchen',
        cuisine: 'Korean',
        rating: 4.8,
        distance: 2.3,
        phone: '+1-555-0111',
        coordinates: { lat: 37.8149, lng: -122.3794 },
        tags: ['korean', 'bbq', 'kimchi'],
        menu: [
            { name: 'Bibimbap', category: 'entree', allergens: ['soy', 'eggs', 'sesame'] },
            { name: 'Kimchi', category: 'appetizer', allergens: ['shellfish'] },
            { name: 'Korean BBQ Ribs', category: 'entree', allergens: ['soy', 'sesame'] },
            { name: 'Japchae Noodles', category: 'entree', allergens: ['soy', 'sesame'] },
            { name: 'Mandu Dumplings', category: 'appetizer', allergens: ['gluten', 'soy', 'eggs'] },
            { name: 'Tofu Stew', category: 'entree', allergens: ['soy', 'shellfish'] },
            { name: 'Seaweed Rice Rolls', category: 'appetizer', allergens: ['soy', 'sesame'] },
            { name: 'Sweet Rice Cakes', category: 'dessert', allergens: [] }
        ]
    },
    {
        id: 12,
        name: 'Harvest Table',
        cuisine: 'Farm-to-Table',
        rating: 4.9,
        distance: 1.6,
        phone: '+1-555-0112',
        coordinates: { lat: 37.7949, lng: -122.4194 },
        tags: ['organic', 'local', 'vegetarian-options', 'gluten-free-options'],
        menu: [
            { name: 'Roasted Beet Salad', category: 'appetizer', allergens: ['nuts', 'dairy'] },
            { name: 'Grilled Free-Range Chicken', category: 'entree', allergens: [] },
            { name: 'Butternut Squash Soup', category: 'appetizer', allergens: ['dairy'] },
            { name: 'Wild Mushroom Risotto', category: 'entree', allergens: ['dairy'] },
            { name: 'Seasonal Fruit Tart', category: 'dessert', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'Heirloom Tomato Salad', category: 'appetizer', allergens: [] },
            { name: 'Grass-Fed Beef Steak', category: 'entree', allergens: [] },
            { name: 'Vegan Chocolate Cake', category: 'dessert', allergens: ['gluten', 'nuts'] }
        ]
    },
    {
        id: 13,
        name: 'Dragon Wok',
        cuisine: 'Chinese',
        rating: 4.5,
        distance: 1.9,
        phone: '+1-555-0113',
        coordinates: { lat: 37.7849, lng: -122.3894 },
        tags: ['chinese', 'dim-sum'],
        menu: [
            { name: 'Kung Pao Chicken', category: 'entree', allergens: ['peanuts', 'soy'] },
            { name: 'Spring Rolls', category: 'appetizer', allergens: ['gluten', 'soy'] },
            { name: 'Steamed Dumplings', category: 'appetizer', allergens: ['gluten', 'soy', 'shellfish'] },
            { name: 'Fried Rice', category: 'entree', allergens: ['soy', 'eggs'] },
            { name: 'Sweet & Sour Pork', category: 'entree', allergens: ['gluten', 'soy'] },
            { name: 'Wonton Soup', category: 'appetizer', allergens: ['gluten', 'soy', 'shellfish'] },
            { name: 'General Tso\'s Tofu', category: 'entree', allergens: ['soy', 'gluten', 'sesame'] },
            { name: 'Fortune Cookies', category: 'dessert', allergens: ['gluten', 'eggs'] }
        ]
    },
    {
        id: 14,
        name: 'The Breakfast Club',
        cuisine: 'Breakfast',
        rating: 4.6,
        distance: 0.4,
        phone: '+1-555-0114',
        coordinates: { lat: 37.7649, lng: -122.4394 },
        tags: ['breakfast', 'brunch', 'all-day'],
        menu: [
            { name: 'Pancake Stack', category: 'entree', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'Avocado Toast', category: 'entree', allergens: ['gluten'] },
            { name: 'Eggs Benedict', category: 'entree', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'Fruit Bowl', category: 'appetizer', allergens: [] },
            { name: 'Oatmeal with Berries', category: 'entree', allergens: [] },
            { name: 'Breakfast Burrito', category: 'entree', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'Greek Yogurt Parfait', category: 'appetizer', allergens: ['dairy', 'nuts'] },
            { name: 'Fresh Juice Bar', category: 'beverage', allergens: [] }
        ]
    },
    {
        id: 15,
        name: 'Pizza Paradiso',
        cuisine: 'Pizza',
        rating: 4.7,
        distance: 1.1,
        phone: '+1-555-0115',
        coordinates: { lat: 37.7749, lng: -122.4294 },
        tags: ['pizza', 'italian', 'vegan-options'],
        menu: [
            { name: 'Pepperoni Pizza', category: 'entree', allergens: ['gluten', 'dairy'] },
            { name: 'Garlic Knots', category: 'appetizer', allergens: ['gluten', 'dairy'] },
            { name: 'Vegan Margherita', category: 'entree', allergens: ['gluten'] },
            { name: 'Caesar Salad', category: 'appetizer', allergens: ['dairy', 'eggs', 'gluten'] },
            { name: 'BBQ Chicken Pizza', category: 'entree', allergens: ['gluten', 'dairy'] },
            { name: 'Antipasto Platter', category: 'appetizer', allergens: ['dairy', 'gluten'] },
            { name: 'Calzone', category: 'entree', allergens: ['gluten', 'dairy', 'eggs'] },
            { name: 'Gelato', category: 'dessert', allergens: ['dairy', 'eggs'] }
        ]
    }
];
