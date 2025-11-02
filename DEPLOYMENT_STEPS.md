# Deployment Steps - MintAi to Google Cloud Run

## ✅ Step 1: Environment File Created

The `.env` file has been created with all necessary API keys and URLs:
- ✅ Firebase configuration
- ✅ Gemini API key
- ✅ YouTube API key
- ✅ Quote API URL
- ✅ Meme API URL

## 📋 Step 2: Build to Google Cloud

### Option A: Use the build script (Recommended)
```powershell
.\build-now.ps1
```

### Option B: Use build-cloud-run script (Reads from .env)
```powershell
.\build-cloud-run.ps1
```

### Option C: Manual build command
```powershell
gcloud builds submit --config cloudbuild.yaml --substitutions="_FIREBASE_API_KEY=AIzaSyBm5kiQRDNE7AVqP5NKPvQw_50urX9ds2k,_AUTH_DOMAIN=mintai-a8150.firebaseapp.com,_PROJECT_ID=mintai-a8150,_STORAGE_BUCKET=mintai-a8150.appspot.com,_MESSAGING_SENDER_ID=631540909763,_APP_ID=1:631540909763:web:d501089d9ae1f109f5c476,_MEASUREMENT_ID=G-K40051YNE8,_GEMINI_API_KEY=AIzaSyC4jnNa7-9ax7kJgasZJLT6NBtMXI3k4Uo,_YOUTUBE_API_KEY=AIzaSyC4jnNa7-9ax7kJgasZJLT6NBtMXI3k4Uo,_QUOTE_API=https://zenquotes.io/api/random,_MEME_API=https://meme-api.com/gimme,_API_BASE_URL=https://mintai-476913.el.r.appspot.com,_USE_BACKEND_API=true"
```

**Note:** Make sure `gcloud` is in your PATH. If you get "gcloud not recognized", open a new PowerShell window or add gcloud to your PATH.

## 🚀 Step 3: Deploy to Cloud Run

After the build completes successfully, deploy with:

```powershell
gcloud run deploy mintai-app `
  --image gcr.io/mintai-476913/mintai-app:latest `
  --platform managed `
  --region asia-south1 `
  --allow-unauthenticated `
  --port 8080
```

Or as a single line:
```powershell
gcloud run deploy mintai-app --image gcr.io/mintai-476913/mintai-app:latest --platform managed --region asia-south1 --allow-unauthenticated --port 8080
```

## ✅ Step 4: Verify Deployment

After deployment, you'll receive a URL like:
```
https://mintai-app-280630776377.asia-south1.run.app
```

Visit this URL to verify:
- ✅ App loads correctly
- ✅ Firebase authentication works
- ✅ Quote widget fetches from ZenQuotes API
- ✅ Meme widget fetches from Meme API
- ✅ Music widget searches YouTube
- ✅ Photo captioning uses Gemini Vision

## 🧪 Testing Locally (Optional)

Before deploying, test locally:

```powershell
npm start
```

Then test each widget:
- Navigate to dashboard
- Check Quote widget
- Check Meme widget  
- Check Music widget
- Upload a photo and test caption generation

## 📝 Troubleshooting

### Issue: `gcloud` not recognized
**Solution:** 
1. Open a new PowerShell window
2. Or run: `refreshenv` (if using Chocolatey)
3. Or add Google Cloud SDK to PATH manually

### Issue: Build fails with "API key not set"
**Solution:** 
- Verify all substitutions are passed correctly
- Check that `.env` file exists in project root
- Ensure no commas in API key values

### Issue: Deployment fails with "port not listening"
**Solution:**
- Ensure `nginx.conf.template` uses `${PORT}` variable
- Check that Dockerfile sets `ENV PORT=8080`
- Verify health check endpoint is configured

### Issue: Widgets show fallback data
**Solution:**
- Check browser console for API errors
- Verify API keys are set correctly in `.env`
- For YouTube, ensure API key has YouTube Data API v3 enabled
- For Gemini, check API key is valid in Google AI Studio

## 🎉 Success!

Once deployed, your MintAi app will have:
- ✅ Live quote fetching from ZenQuotes
- ✅ Real meme API integration
- ✅ YouTube music recommendations
- ✅ Gemini-powered chat and captions

All ready for your hackathon demo! 🚀

