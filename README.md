# Allergen Safe Eats - Production Setup Guide

## 🚀 Quick Start

This is a **production-ready** application that uses real restaurant data from Google Places API.

### Current Status

✅ **Works Now (Demo Mode)**:
- Real geolocation
- Mock restaurant data near your location
- Curated allergen database for 10+ major chains
- Full UI and filtering

⚠️ **Needs API Key for Full Production**:
- Real restaurant search
- Actual business data
- Live menus from known chains

---

## 📋 Setup Instructions

### Option 1: Run in Demo Mode (No API Key Needed)

The app will work immediately with mock data:

1. Open `index.html` in a browser
2. Allow location access
3. App shows demo restaurants near you

### Option 2: Production Mode with Google Places API

#### Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable these APIs:
   - Places API
   - Maps JavaScript API
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **API Key**
6. Copy your API key

#### Step 2: Secure Your API Key

IMPORTANT: Restrict your API key to prevent unauthorized use:

1. Click on your API key in the credentials list
2. Under **Application restrictions**:
   - Select "HTTP referrers"
   - Add your domain (e.g., `yourdomain.com/*`)
3. Under **API restrictions**:
   - Select "Restrict key"
   - Choose: Places API, Maps JavaScript API
4. Save

#### Step 3: Add API Key to Your App

1. Open `config.js`
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   GOOGLE_PLACES_API_KEY: 'your-actual-api-key-here',
   ```

3. Open `index.html`
4. Find the Google Maps script tag and update it:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places" async defer></script>
   ```

#### Step 4: Test

1. Open `index.html` in a browser
2. Allow location access
3. Check browser console for:
   ```
   ✓ Location obtained
   ✓ Google Maps API loaded - using real restaurant data
   ✓ App initialized with X restaurants
   ```

---

## 🏗️ Architecture

### Production Data Flow

```
User Location → Google Places API → Real Restaurants
                      ↓
          Allergen Database (Local)
                      ↓
          Filter by Safe Items
                      ↓
          Display Results
```

### Files Structure

```
allergen-safe-eats/
├── index.html           # Main HTML
├── styles.css           # Full design system
├── config.js            # API configuration ⚙️
├── allergen-db.js       # Curated allergen database
├── places-service.js    # Google Places integration
├── data.js              # Mock data (fallback)
└── app.js               # Main application logic
```

### Curated Restaurant Chains

The app includes allergen data for:
- Chipotle
- Panera Bread
- Sweetgreen
- Blaze Pizza / MOD Pizza
- P.F. Chang's
- Qdoba
- Red Robin
- Starbucks
- And more...

---

## 💰 Cost Estimates

### Google Places API Pricing

| Feature | Cost | Usage Limit (Free Tier) |
|---------|------|------------------------|
| Nearby Search | $32/1000 requests | ~6,250/month |
| Place Details | $17/1000 requests | ~11,750/month |
| Maps Display | Free | Unlimited |

**Free Tier**: $200/month credit

### Optimization Strategies

✅ **Implemented**:
- 24-hour caching
- Limited search radius (5km)
- Details only loaded when modal opens

📝 **Recommended**:
- Cache to localStorage
- Lazy load place details
- Implement request rate limiting

---

##  📱 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
```

### Option 3: GitHub Pages

1. Create `.nojekyll` file in root
2. Push to GitHub
3. Enable Pages in repo settings

### Environment Variables for Production

Create `vercel.json` or `.env`:

```json
{
  "env": {
    "GOOGLE_PLACES_API_KEY": "your-key-here"
  }
}
```

Then update `config.js` to read from environment.

---

## 🔒 Security Checklist

- [ ] API key has HTTP referrer restrictions
- [ ] API key has API restrictions (Places + Maps only)
- [ ] API key not committed to git
- [ ] `.gitignore` includes `config.js` (if storing key there)
- [ ] Using environment variables in production
- [ ] HTTPS enabled on production domain

---

## 🎯 Current Limitations & Future Enhancements

### Current Limitations

1. **Allergen data is limited** to curated chains
2. **No user accounts** (yet)
3. **No menu photo upload**
4. **Client-side only** (no backend database)

### Planned Enhancements

**Phase 2** (Next):
- Firebase backend for shared allergen database
- User accounts and authentication
- Community submissions for menu items
- Voting/verification system

**Phase 3** (Later):
- AI-powered menu analysis (OCR + LLM)
- Admin moderation panel
- Mobile app (React Native)
- Offline mode

---

## 🐛 Troubleshooting

### "Geolocation not supported"
- Use HTTPS (required for geolocation)
- Try a different browser

### "Google Maps API error"
- Check API key is correct
- Verify APIs are enabled in Google Cloud
- Check browser console for specific error

### "No restaurants found"
- Check internet connection
- Verify location permission granted
- Check console for API errors
- App will fallback to demo mode

### "No safe items for restaurant"
- Restaurant not in curated database yet
- Can add custom items (feature coming soon)

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify API key setup
3. Review this README

---

## 📄 License

This is a production application. Add your license here.

---

**Ready to go live?** Follow the setup instructions above and deploy! 🚀
