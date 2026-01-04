# 🔧 API Activation Error - Quick Fix

## ❌ Current Issue

**Error**: `ApiNotActivatedMapError`  
**Meaning**: The Maps JavaScript API is not enabled for your project

## ✅ How to Fix

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com

### Step 2: Select Your Project
Make sure "Allergen Safe Eats" (or your project name) is selected in the dropdown at the top

### Step 3: Enable Maps JavaScript API

1. You should see **"Maps JavaScript API"**
2. Click the blue **"ENABLE"** button
3. Wait for it to activate (~30 seconds)

### Step 4: Enable Places API (if not already done)

Visit: https://console.cloud.google.com/apis/library/places-backend.googleapis.com

1. Click **"ENABLE"**
2. Wait for activation

### Step 5: Set Up Billing (Required)

1. Go to: https://console.cloud.google.com/billing
2. Click **"Link a Billing Account"**
3. Add payment method
4. **Don't worry**: You get $200 FREE per month - you won't be charged unless you exceed that

### Step 6: Reload Your App

Once both APIs are enabled and billing is set up:

```bash
# Refresh the browser page
# Or open again:
open /Users/kiranb/.gemini/antigravity/scratch/allergen-safe-eats/index.html
```

### Step 7: Verify Success

Open browser console (F12) and look for:
```
✓ Location obtained
✓ Google Maps API loaded - using real restaurant data
✓ App initialized with 20 restaurants
```

---

## 🎯 Required APIs Checklist

- [ ] **Places API** - Enabled
- [ ] **Maps JavaScript API** - Enabled  ← **This is the missing one!**
- [ ] **Billing Account** - Linked

---

## Common Issues

### "API key not enabled"
- Make sure BOTH APIs are enabled (not just one)

### "This API project is not authorized"
- Check that billing is set up
- Wait a few minutes after enabling APIs

### "Quota exceeded"
- Check your usage at: https://console.cloud.google.com/apis/dashboard
- You have $200/month free credit

---

## Need Help?

The console error message usually tells you exactly what's wrong. Check the browser console (F12) for specific errors.

Your API key is correctly configured - we just need to enable the APIs! 🚀
