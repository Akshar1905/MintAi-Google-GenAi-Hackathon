# API Integration Guide

Complete guide for the API-based features in MintAi.

## ✅ Implemented Features

All API integrations are now working and connected to widgets:

### 1. **Gemini AI API** (`src/utils/gemini.js`)
- ✅ `generateGeminiResponse()` - Chat responses
- ✅ `generateImageCaption()` - Photo captions  
- ✅ `analyzeSentiment()` - Mood analysis
- ✅ `generateMotivationalQuote()` - AI-generated quotes

### 2. **ZenQuotes API** (`src/utils/quoteApi.js`)
- ✅ `getDailyQuote()` - Fetch random inspirational quotes
- ✅ Falls back to Gemini if API fails

### 3. **Meme API** (`src/utils/memeApi.js`)
- ✅ `getRandomMeme()` - Fetch random memes from meme-api.com
- ✅ Supports subreddit filtering (e.g., 'wholesomememes')
- ✅ Falls back to curated positive memes if API fails

### 4. **YouTube Music API** (`src/utils/youtubeMusic.js`)
- ✅ `getYouTubeRecommendations()` - Search YouTube for mood-based music
- ✅ Uses YouTube Data API v3
- ✅ Falls back to mock data if API key missing

## 📁 Widget Connections

### MotivationalQuoteWidget
- **Uses**: `getDailyQuote()` from `quoteApi.js`
- **Flow**: ZenQuotes API → Gemini fallback → Hardcoded fallback

### MemeUpliftWidget
- **Uses**: `getRandomMeme()` from `memeApi.js`
- **Flow**: meme-api.com → Curated memes fallback

### MusicRecommendationWidget
- **Uses**: `getYouTubeRecommendations()` from `youtubeMusic.js`
- **Flow**: YouTube Data API → Mock data fallback

### PhotoCaptionWidget
- **Uses**: `generateImageCaption()` from `gemini.js`
- **Already working** - No changes needed

### TapToUpliftWidget
- **Uses**: All three APIs (quotes, memes, visuals)
- **Updated**: Now uses `getDailyQuote()` and async `getRandomMeme()`

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# Gemini AI
VITE_GEMINI_API_KEY=AIzaSyC4jnNa7-9ax7kJgasZJLT6NBtMXI3k4Uo

# YouTube Music
VITE_YOUTUBE_API_KEY=AIzaSyC4jnNa7-9ax7kJgasZJLT6NBtMXI3k4Uo

# External APIs
VITE_QUOTE_API=https://zenquotes.io/api/random
VITE_MEME_API=https://meme-api.com/gimme
```

## 🚀 Deployment to Cloud Run

All environment variables are now included in the build process:

### Build with New Variables

```powershell
.\build-now.ps1
```

Or manually:

```powershell
gcloud builds submit --config cloudbuild.yaml --substitutions="_FIREBASE_API_KEY=...,_GEMINI_API_KEY=AIzaSyC4jnNa7-9ax7kJgasZJLT6NBtMXI3k4Uo,_YOUTUBE_API_KEY=AIzaSyC4jnNa7-9ax7kJgasZJLT6NBtMXI3k4Uo,_QUOTE_API=https://zenquotes.io/api/random,_MEME_API=https://meme-api.com/gimme,..."
```

## 📋 API Helper Functions

### getDailyQuote(mood?)
```javascript
import { getDailyQuote } from './utils/quoteApi';

const quote = await getDailyQuote('happy');
// Returns: { text: "Quote text", author: "Author name" }
```

### getRandomMeme(subreddit?)
```javascript
import { getRandomMeme } from './utils/memeApi';

const meme = await getRandomMeme('wholesomememes');
// Returns: { title, imageUrl, caption, category, subreddit }
```

### getYouTubeRecommendations(emotion, sentimentScore)
```javascript
import { getYouTubeRecommendations } from './utils/youtubeMusic';

const music = await getYouTubeRecommendations('happy', 0.8);
// Returns: { title, artist, videoId, thumbnail, mood }
```

### generateGeminiResponse(userText, opts)
```javascript
import { generateGeminiResponse } from './utils/gemini';

const response = await generateGeminiResponse('Hello!', {
  conversationHistory: [...],
  systemInstruction: 'You are a friendly wellness assistant',
});
```

## 🎯 Testing

### Test in Browser Console

```javascript
// Test Gemini
testGeminiConnection();

// Test Quote API
import { getDailyQuote } from './utils/quoteApi';
getDailyQuote().then(console.log);

// Test Meme API
import { getRandomMeme } from './utils/memeApi';
getRandomMeme().then(console.log);

// Test YouTube
import { getYouTubeRecommendations } from './utils/youtubeMusic';
getYouTubeRecommendations('happy', 0.5).then(console.log);
```

## 🔍 How It Works

1. **Vite reads** `VITE_*` env vars at **build time**
2. **Values are embedded** in the JavaScript bundle
3. **Helpers access** via `import.meta.env.VITE_*`
4. **APIs are called** directly from frontend (no backend needed)
5. **Fallbacks** ensure features work even if APIs fail

## ✅ Status

- ✅ All helper functions created
- ✅ Widgets updated to use new helpers
- ✅ Environment variables added to Dockerfile
- ✅ Cloud Build config updated
- ✅ Build scripts updated
- ✅ Fallback mechanisms in place

## 🎉 Ready to Deploy!

Your APIs are now integrated and ready for the hackathon demo!

