// ==========================================
// STATE MANAGEMENT
// ==========================================
const state = {
  selectedAllergens: new Set(),
  filteredRestaurants: [],
  currentRestaurant: null,
  userLocation: null,
  locationPermissionGranted: false,
  isLoading: false,
  usingRealData: false
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const elements = {
  allergenGrid: document.getElementById('allergenGrid'),
  clearAllergensBtn: document.getElementById('clearAllergensBtn'),
  restaurantGrid: document.getElementById('restaurantGrid'),
  resultsCount: document.getElementById('resultsCount'),
  emptyState: document.getElementById('emptyState'),
  modalOverlay: document.getElementById('modalOverlay'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalRestaurantName: document.getElementById('modalRestaurantName'),
  modalRestaurantInfo: document.getElementById('modalRestaurantInfo'),
  modalMenuGrid: document.getElementById('modalMenuGrid'),
  modalWebsiteBtn: document.getElementById('modalWebsiteBtn'),
  modalDirectionsBtn: document.getElementById('modalDirectionsBtn'),
  modalAiScanBtn: document.getElementById('modalAiScanBtn'),
  aiScanSection: document.getElementById('aiScanSection'),
  aiMenuInput: document.getElementById('aiMenuInput'),
  aiSubmitBtn: document.getElementById('aiSubmitBtn'),
  aiProgress: document.getElementById('aiProgress')
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Get user's current location
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}

function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '⭐'.repeat(fullStars);
  if (hasHalfStar) stars += '✨';
  return stars;
}

function getGoogleMapsUrl(coordinates) {
  return `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
}

function formatPhoneLink(phone) {
  if (!phone) return '#';
  return `tel:${phone}`;
}

// ====================================================================================
// RENDER FUNCTIONS
// ==========================================
function renderAllergenGrid() {
  elements.allergenGrid.innerHTML = ALLERGENS.map(allergen => `
    <div class="allergen-item">
      <input 
        type="checkbox" 
        id="allergen-${allergen.id}" 
        class="allergen-checkbox"
        value="${allergen.id}"
      >
      <label for="allergen-${allergen.id}" class="allergen-label">
        <div class="allergen-icon">${allergen.icon}</div>
        <span class="allergen-name">${allergen.name}</span>
      </label>
    </div>
  `).join('');

  // Add event listeners to all checkboxes
  document.querySelectorAll('.allergen-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleAllergenToggle);
  });
}

function renderRestaurantGrid() {
  const restaurants = state.filteredRestaurants;

  if (state.isLoading) {
    elements.restaurantGrid.innerHTML = '<div class="loading">Loading restaurants...</div>';
    return;
  }

  if (restaurants.length === 0) {
    elements.restaurantGrid.classList.add('hidden');
    elements.emptyState.classList.remove('hidden');
    elements.resultsCount.textContent = 'No restaurants found';
    return;
  }

  elements.restaurantGrid.classList.remove('hidden');
  elements.emptyState.classList.add('hidden');

  elements.restaurantGrid.innerHTML = restaurants.map((restaurant, index) => {
    const safeItemsCount = restaurant.safeItemsCount || 0;

    return `
      <div class="restaurant-card fade-in-up" data-restaurant-id="${restaurant.id}">
        <div class="restaurant-header">
          <h3 class="restaurant-name">${restaurant.name}</h3>
          <p class="restaurant-cuisine">${restaurant.cuisine || restaurant.types?.[0] || 'Restaurant'}</p>
        </div>
        
        <div class="restaurant-meta">
          <div class="meta-item rating">
            <span>${getStarRating(restaurant.rating || 0)}</span>
            <span>${restaurant.rating || 'N/A'}</span>
          </div>
          <div class="meta-item distance">
            <span>📍</span>
            <span>${restaurant.distance} mi</span>
          </div>
        </div>
        
        ${safeItemsCount > 0 ? `
          <div class="safe-items-badge">
            <span>✓</span>
            <span>${safeItemsCount} safe item${safeItemsCount !== 1 ? 's' : ''}</span>
          </div>
        ` : ''}
        
        <div class="restaurant-tags">
          ${restaurant.tags ? restaurant.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
          ${restaurant.isOpen !== undefined ? `<span class="tag">${restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Update results count
  const allergenCount = state.selectedAllergens.size;
  const dataSource = state.usingRealData ? 'nearby' : 'demo';
  if (allergenCount === 0) {
    elements.resultsCount.textContent = `Showing ${restaurants.length} ${dataSource} restaurants`;
  } else {
    elements.resultsCount.textContent = `Found ${restaurants.length} safe restaurant${restaurants.length !== 1 ? 's' : ''}`;
  }

  // Add click listeners to restaurant cards
  document.querySelectorAll('.restaurant-card').forEach(card => {
    card.addEventListener('click', async () => {
      const restaurantId = card.dataset.restaurantId;
      await openRestaurantModal(restaurantId);
    });
  });
}

function renderModal(restaurant) {
  const safeItems = restaurant.safeItems || [];

  // Render restaurant info
  elements.modalRestaurantName.textContent = restaurant.name;
  elements.modalRestaurantInfo.innerHTML = `
    <span class="rating">${getStarRating(restaurant.rating || 0)} ${restaurant.rating || 'N/A'}</span>
    <span>•</span>
    <span>${restaurant.cuisine || restaurant.types?.[0] || 'Restaurant'}</span>
    <span>•</span>
    <span>📍 ${restaurant.distance} mi</span>
    ${restaurant.address ? `<span>•</span><span>${restaurant.address}</span>` : ''}
  `;
  // Render safe menu items
  if (safeItems.length === 0) {
    const hasAllergens = state.selectedAllergens.size > 0;
    elements.modalMenuGrid.innerHTML = `
      <div class="empty-state">
        <p>${hasAllergens ? 'No safe menu items found for your selected allergens.' : 'No menu data available for this restaurant yet.'}</p>
        ${!hasAllergens ? '<p class="text-secondary">Select allergens to see filtered options, or add custom menu items.</p>' : ''}
      </div>
    `;
  } else {
    elements.modalMenuGrid.innerHTML = safeItems.map(item => `
      <div class="menu-item">
        <div class="menu-item-icon">
          ${item.category === 'appetizer' ? '🥗' :
        item.category === 'entree' ? '🍽️' :
          item.category === 'dessert' ? '🍰' :
            item.category === 'menu item' ? '🍴' : '🥤'}
        </div>
        <div class="menu-item-content">
          <div class="menu-item-name">${item.name}</div>
          <div class="menu-item-category">
            ${item.category}
            ${item.source ? ` • <span class="source-badge ${item.source === 'curated' ? 'curated' : (item.source === 'general advice' ? 'general' : 'ai')}">${item.source}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Set up action buttons
  if (restaurant.website) {
    elements.modalWebsiteBtn.href = restaurant.website;
    elements.modalWebsiteBtn.classList.remove('hidden');
  } else {
    elements.modalWebsiteBtn.classList.add('hidden');
  }

  elements.modalDirectionsBtn.href = restaurant.googleMapsUrl || getGoogleMapsUrl(restaurant.coordinates);

  // Reset AI scan section
  elements.aiScanSection.classList.add('hidden');
  elements.aiMenuInput.value = '';
  elements.aiProgress.classList.add('hidden');
}

// ==========================================
// EVENT HANDLERS
// ==========================================
async function handleAllergenToggle(event) {
  const allergenId = event.target.value;

  if (event.target.checked) {
    state.selectedAllergens.add(allergenId);
  } else {
    state.selectedAllergens.delete(allergenId);
  }

  await filterRestaurants();
  renderRestaurantGrid();
}

async function handleClearAllergens() {
  state.selectedAllergens.clear();
  state.currentRestaurant = null;

  // Uncheck all checkboxes
  document.querySelectorAll('.allergen-checkbox').forEach(checkbox => {
    checkbox.checked = false;
  });

  console.log('🧹 Clearing all allergens and resetting results');
  await filterRestaurants();
  renderRestaurantGrid();
}

async function openRestaurantModal(restaurantId) {
  const restaurant = state.filteredRestaurants.find(r => r.id === restaurantId);
  if (!restaurant) return;

  // Fetch additional details if using real data
  if (state.usingRealData && typeof placesService !== 'undefined') {
    try {
      const details = await placesService.getPlaceDetails(restaurantId);
      restaurant.phone = details.phone;
      restaurant.googleMapsUrl = details.googleMapsUrl;
      restaurant.website = details.website;
      restaurant.hours = details.hours;
    } catch (error) {
      console.warn('Could not load restaurant details:', error);
    }
  }

  // Get safe items from allergen database
  const safeItems = allergenDB.getSafeItemsForRestaurant(restaurant.name, state.selectedAllergens, restaurant.types || []);
  restaurant.safeItems = safeItems;

  state.currentRestaurant = restaurant;
  renderModal(restaurant);

  elements.modalOverlay.classList.add('active');
  document.body.classList.add('no-scroll');
}

function closeRestaurantModal() {
  elements.modalOverlay.classList.remove('active');
  document.body.classList.remove('no-scroll');
  state.currentRestaurant = null;
}

// AI Menu Analysis Handlers
function toggleAiScan() {
  elements.aiScanSection.classList.toggle('hidden');
}

async function handleAiSubmit() {
  const menuText = elements.aiMenuInput.value.trim();
  if (!menuText) {
    alert('Please enter some menu text to analyze.');
    return;
  }

  elements.aiProgress.classList.remove('hidden');
  elements.aiSubmitBtn.disabled = true;

  console.log('🤖 AI Analysis requested for:', state.currentRestaurant.name);
  console.log('📄 Menu content:', menuText);

  // In a real app, this would call an LLM API.
  // For this demo, we simulate the analysis.
  setTimeout(async () => {
    // We'll notify the user that they need to provide the analysis as the AI agent
    elements.aiProgress.innerHTML = `
      <div class="ai-instruction" style="color: var(--color-accent)">
        I've captured the menu text! As your AI assistant, I'm ready to analyze it. 
        Please tell me which items from this menu are safe for ${Array.from(state.selectedAllergens).join(', ')}.
      </div>
    `;
    elements.aiSubmitBtn.disabled = false;

    // Proactively call a tool or notify the user to handle the analysis
    // But for now, we'll just leave the UI in this state.
  }, 1500);
}

// ==========================================
// FILTERING LOGIC
// ==========================================
async function filterRestaurants() {
  let restaurants = [];

  // Use real restaurant data if available
  if (state.usingRealData) {
    restaurants = await loadRealRestaurants();
  } else {
    // Use mock data as fallback
    restaurants = RESTAURANTS.map(r => ({
      ...r,
      id: r.id.toString(),
      address: r.address || 'Address not available'
    }));
  }

  // Filter by allergens using the allergen database
  if (state.selectedAllergens.size > 0) {
    restaurants = restaurants.filter(restaurant => {
      const types = restaurant.types || [];
      const hasSafeItems = allergenDB.hasSafeItems(restaurant.name, state.selectedAllergens, types);
      if (hasSafeItems) {
        restaurant.safeItemsCount = allergenDB.getSafeItemsCount(restaurant.name, state.selectedAllergens, types);
      }
      return hasSafeItems;
    });

    // Sort by safe items count (descending) then distance (ascending)
    restaurants.sort((a, b) => {
      const aSafeCount = a.safeItemsCount || 0;
      const bSafeCount = b.safeItemsCount || 0;

      if (aSafeCount !== bSafeCount) {
        return bSafeCount - aSafeCount;
      }

      return a.distance - b.distance;
    });
  } else {
    // No allergens selected - just sort by distance
    restaurants.sort((a, b) => a.distance - b.distance);
  }

  state.filteredRestaurants = restaurants;
}

async function loadRealRestaurants() {
  if (!state.userLocation) return [];

  try {
    const restaurants = await placesService.getNearbyRestaurants(
      state.userLocation.lat,
      state.userLocation.lng
    );
    return restaurants;
  } catch (error) {
    console.error('Error loading real restaurants:', error);
    return [];
  }
}

// ==========================================
// INITIALIZATION
// ==========================================
async function init() {
  // Render initial UI
  renderAllergenGrid();

  // Set up event listeners
  elements.clearAllergensBtn.addEventListener('click', handleClearAllergens);
  elements.modalCloseBtn.addEventListener('click', closeRestaurantModal);
  elements.modalAiScanBtn.addEventListener('click', toggleAiScan);
  elements.aiSubmitBtn.addEventListener('click', handleAiSubmit);

  // Close modal when clicking outside
  elements.modalOverlay.addEventListener('click', (event) => {
    if (event.target === elements.modalOverlay) {
      closeRestaurantModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
      closeRestaurantModal();
    }
  });

  // Show loading state
  state.isLoading = true;
  renderRestaurantGrid();

  // Request user's location
  try {
    state.userLocation = await getUserLocation();
    state.locationPermissionGranted = true;
    console.log('✓ Location obtained:', state.userLocation);

    // Check if Google Maps API is loaded
    if (typeof google !== 'undefined' && google.maps) {
      console.log('✓ Google Maps API loaded - using real restaurant data');
      state.usingRealData = true;
    } else {
      console.log('ℹ Google Maps API not available - using demo data');
      state.usingRealData = false;
    }

  } catch (error) {
    console.warn('⚠ Could not get user location:', error.message);
    console.log('ℹ Using default location');
    // Default to San Francisco for demo
    state.userLocation = { lat: 37.7749, lng: -122.4194 };
  }

  // Load and filter restaurants
  state.isLoading = false;
  await filterRestaurants();
  renderRestaurantGrid();

  console.log(`✓ App initialized with ${state.filteredRestaurants.length} restaurants`);
}

// Wait for DOM and Google Maps API to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
