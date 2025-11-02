# MintAi — Mindful Intelligence for Gen Z Wellbeing

> **"MintAi — Where AI meets mindfulness. Refresh your mind, one widget at a time."**

A mobile-first mental wellness web application designed for Gen Z users who face stress, anxiety, or emotional burnout but prefer non-traditional therapy. MintAi provides AI-powered emotional support, personalized mood upliftment, and daily positivity through interactive widgets — all integrated with Google's GenAI ecosystem.

![MintAi](https://img.shields.io/badge/MintAi-Wellness-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Gemini](https://img.shields.io/badge/Gemini-AI-orange) ![Firebase](https://img.shields.io/badge/Firebase-Auth-green) ![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![Cloud-Run](https://img.shields.io/badge/Cloud%20Run-Deployed-green)

## 🧩 Project Overview

MintAi is a personal mental wellness dashboard featuring a rotating widget system that changes dynamically based on the user's emotional state. Each widget provides a unique AI experience — from personalized captions and empathetic chats to AI-generated art and memes — encouraging self-expression, relaxation, and positivity.

**Built for Google GenAI Hackathon** — Demonstrating comprehensive use of Google's AI tools for mental wellness.

**Deployed on Google Cloud Run** — Production-ready with Docker containerization and automated builds.

---

## ✨ Key Features

### 🤖 AI-Powered Widgets (Rotating Dashboard)

#### 1. **Photo + Auto Caption Generator**
- AI analyzes user's photos from Google Photos integration
- Generates emotionally intelligent captions using **Gemini Vision API**
- Helps users reflect positivity through visual self-expression
- **Tech**: Gemini 1.5 Flash / Gemini Vision + Firebase Storage

#### 2. **YouTube Music Recommendation** 🎵
- **Live API Integration**: Searches YouTube Data API v3 based on user's mood
- Sentiment-aware music selection using Gemini analysis
- Real-time music recommendations from YouTube's vast library
- Falls back to curated recommendations if API unavailable
- **Tech**: Gemini (sentiment analysis) + YouTube Data API v3

#### 3. **MintChat — AI Therapy Chatbot**
- Friendly, empathetic chatbot for emotional conversations
- Detects emotional cues and responds supportively using **Gemini 1.5 Flash**
- Maintains conversation history for context-aware responses
- Can summarize mood insights and suggest coping actions
- Available in widget form and full-screen mode
- **Tech**: Gemini 1.5 Pro/Flash (text + emotion understanding) + Firebase for session memory

#### 4. **Motivational Quote Widget** 💭
- **Live API Integration**: Fetches inspirational quotes from ZenQuotes API
- Falls back to Gemini-generated quotes if API unavailable
- Displays personalized daily quotes or affirmations
- Context-aware positive messaging based on user mood
- **Tech**: ZenQuotes API + Gemini Text API (fallback) + Firestore for personalization

#### 5. **"Remember to Laugh" — Meme Uplift Widget** 😂
- **Live API Integration**: Fetches random memes from meme-api.com
- Supports subreddit filtering (e.g., 'wholesomememes', 'MadeMeSmile')
- Falls back to curated positive memes if API unavailable
- Lifts mood instantly through laughter and relatability
- **Tech**: Meme API (meme-api.com) + Curated dataset (fallback)

#### 6. **Google Image Generation Widget**
- Uses **Gemini** to generate prompts for AI visuals
- Creates calming visuals based on user mood
- Emotionally uplifting content
- **Tech**: Gemini for prompt generation + Image API

#### 7. **"Tap to Uplift" Button** ⚡
- Instantly triggers a random AI-positive experience
- Delivers quotes (from ZenQuotes), memes (from Meme API), calming images, or affirmations
- All APIs integrated with live fetching
- Designed for quick emotional resets
- **Tech**: Multiple API orchestrations (ZenQuotes, Meme API, Gemini)

#### 8. **Daily Wellness Summary** ⭐
- AI-generated personalized daily wellness summary
- Analyzes user activity (mood entries, journal, chat)
- Provides actionable wellness tips and encouragement
- **Tech**: Gemini 1.5 Flash with multi-source data analysis

### 📊 Enhanced Analytics & Tracking

#### **Mood Tracking with AI Analytics**
- Visual mood timeline chart (last 30 days)
- **AI-powered mood trend analysis** using Gemini
- Mood statistics dashboard with percentages
- Trend detection (improving/declining/stable)
- Real-time emotional insights
- **Tech**: Recharts for visualization + Gemini for analysis

#### **Daily Journal with AI Summarization**
- Rich text journaling with auto-save
- **AI-generated insights** from journal entries (last 7 days)
- Emotional theme detection
- Growth highlights and concern identification
- **Tech**: Gemini 1.5 Flash for journal analysis

#### **Wellness Insights Dashboard**
- Comprehensive analytics view
- Key wellness statistics
- Interactive charts and graphs
- AI-powered recommendations
- Date range filtering
- **Tech**: Recharts + Gemini for insights

### 🎨 Additional Features

- **Beautiful Animated Login Page** with Google Sign-In
- **Protected Routes** with proper authentication flow
- **Community View** for wellness connection
- **Progress Tracking** with badges and milestones
- **Breathing Exercises** with guided animations
- **Meditation Timer** with customizable sessions
- **Daily Tasks** for habit building

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Firebase project with Authentication enabled
- Google AI Studio account (for Gemini API key)
- YouTube Data API v3 key (optional, for music recommendations)
- Google Cloud account (for Cloud Run deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mintai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

   # Gemini AI Configuration
   VITE_GEMINI_API_KEY=your-gemini-api-key

   # YouTube Music API (Optional but recommended)
   VITE_YOUTUBE_API_KEY=your-youtube-api-key

   # External APIs
   VITE_QUOTE_API=https://zenquotes.io/api/random
   VITE_MEME_API=https://meme-api.com/gimme

   # Backend API (Optional)
   VITE_API_BASE_URL=https://your-backend-url.com
   VITE_USE_BACKEND_API=false
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:53000/`

### Building for Production

```bash
npm run build
```

The production build will be in the `build/` directory.

---

## 🐳 Docker Deployment

### Local Docker Build

1. **Build Docker image with environment variables**
   ```bash
   docker build \
     --build-arg VITE_FIREBASE_API_KEY=your-key \
     --build-arg VITE_GEMINI_API_KEY=your-key \
     --build-arg VITE_YOUTUBE_API_KEY=your-key \
     --build-arg VITE_QUOTE_API=https://zenquotes.io/api/random \
     --build-arg VITE_MEME_API=https://meme-api.com/gimme \
     -t mintai-app .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up
   ```

   Or use the build script:
   ```powershell
   # Windows
   .\build-with-env.ps1

   # Linux/Mac
   ./build-with-env.sh
   ```

### Google Cloud Run Deployment

#### Option 1: Quick Build Script
```powershell
# Windows
.\build-now.ps1

# Then deploy
gcloud run deploy mintai-app --image gcr.io/mintai-476913/mintai-app:latest --platform managed --region asia-south1 --allow-unauthenticated --port 8080
```

#### Option 2: Automated Build from .env
```powershell
# Windows
.\build-cloud-run.ps1

# Linux/Mac
./build-cloud-run.sh
```

#### Option 3: Manual Cloud Build
```bash
gcloud builds submit --config cloudbuild.yaml --substitutions="_FIREBASE_API_KEY=...,_GEMINI_API_KEY=...,_YOUTUBE_API_KEY=...,_QUOTE_API=https://zenquotes.io/api/random,_MEME_API=https://meme-api.com/gimme,..."
```

For detailed deployment instructions, see:
- `DEPLOYMENT_STEPS.md` — Step-by-step deployment guide
- `CLOUD_RUN_DEPLOY.md` — Comprehensive Cloud Run deployment
- `DOCKER_SETUP.md` — Docker setup and troubleshooting

---

## 🧰 Tech Stack

### Frontend
- **React 18.2** — Modern UI framework
- **Vite 5.0** — Lightning-fast build tool
- **TailwindCSS 3.4** — Utility-first CSS framework
- **Framer Motion** — Smooth animations
- **React Router v6** — Client-side routing
- **Recharts** — Data visualization

### Backend & Services
- **Firebase Authentication** — Google Sign-In
- **Firebase Firestore** — User data storage
- **Firebase Storage** — Media storage

### AI & Machine Learning
- **Google Gemini 1.5 Flash** — Primary AI model for:
  - Natural language conversations
  - Sentiment analysis
  - Content generation
  - Wellness insights
- **Gemini Vision API** — Image analysis and captioning
- **Gemini API** — Text generation, quotes, summaries

### APIs & Integrations
- **ZenQuotes API** — Daily inspirational quotes (`https://zenquotes.io/api/random`)
- **Meme API** — Random meme fetching (`https://meme-api.com/gimme`)
- **YouTube Data API v3** — Music recommendations and search
- **Google Photos API** — Photo integration
- **Firebase APIs** — Authentication, Storage, Firestore

### DevOps & Deployment
- **Docker** — Containerization
- **Nginx** — Production web server
- **Google Cloud Run** — Serverless deployment
- **Google Cloud Build** — CI/CD pipeline

---

## 📁 Project Structure

```
mintai/
├── public/                    # Static assets
│   └── assets/               # Images and media
├── src/
│   ├── components/           # Reusable components
│   │   ├── ui/              # UI components (Button, Input, etc.)
│   │   └── widgets/         # Feature widgets
│   │       ├── PhotoCaptionWidget.jsx
│   │       ├── MintChatWidget.jsx
│   │       ├── MusicRecommendationWidget.jsx
│   │       ├── MotivationalQuoteWidget.jsx
│   │       ├── MemeUpliftWidget.jsx
│   │       ├── ImageGenerationWidget.jsx
│   │       ├── TapToUpliftWidget.jsx
│   │       └── DailyWellnessSummaryWidget.jsx
│   ├── pages/               # Page components
│   │   ├── authentication/  # Login/Auth pages
│   │   ├── main-dashboard/  # Main app dashboard
│   │   ├── mint-chat-full-screen/ # Full-screen chat
│   │   ├── mood-tracking/   # Mood tracking (with analytics)
│   │   ├── daily-journal/   # Journal (with AI summary)
│   │   ├── insights-view/   # Analytics dashboard
│   │   └── ...              # Other pages
│   ├── utils/               # Utility functions
│   │   ├── gemini.js        # Gemini API integration
│   │   ├── quoteApi.js      # ZenQuotes API integration ⭐ NEW
│   │   ├── memeApi.js       # Meme API integration ⭐ NEW
│   │   ├── youtubeMusic.js  # YouTube API integration ⭐ ENHANCED
│   │   ├── wellnessAnalytics.js
│   │   ├── apiHelpers.js    # Centralized API exports ⭐ NEW
│   │   ├── googlePhotos.js
│   │   └── ...
│   ├── context/             # React Context providers
│   │   └── AuthContext.jsx   # Authentication context
│   ├── config/              # Configuration files
│   │   └── googleConfig.js
│   ├── firebase.js          # Firebase initialization
│   ├── App.jsx              # Main app component
│   ├── Routes.jsx           # Route configuration
│   └── index.jsx            # Entry point
├── .env                     # Environment variables (not in git)
├── Dockerfile               # Docker build configuration
├── docker-compose.yml       # Docker Compose configuration
├── cloudbuild.yaml          # Google Cloud Build config
├── nginx.conf.template      # Nginx config template (for Cloud Run)
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── vite.config.mjs          # Vite configuration
└── README.md                # This file
```

---

## 🎯 Core Features Implementation

### API Integrations

#### 1. **Gemini AI API** (`src/utils/gemini.js`)
- `generateGeminiResponse()` — Chat responses with conversation history
- `generateImageCaption()` — Photo captions with emotional intelligence
- `analyzeSentiment()` — Mood and sentiment analysis
- `generateMotivationalQuote()` — AI-generated quotes (fallback)

#### 2. **ZenQuotes API** (`src/utils/quoteApi.js`) ⭐ NEW
- `getDailyQuote(mood?)` — Fetches random inspirational quotes
- Automatic fallback to Gemini if API fails
- Returns: `{ text: string, author: string | null }`

#### 3. **Meme API** (`src/utils/memeApi.js`) ⭐ NEW
- `getRandomMeme(subreddit?)` — Fetches random memes from meme-api.com
- Supports subreddit filtering (e.g., 'wholesomememes')
- Falls back to curated positive memes if API fails
- Returns: `{ title, imageUrl, caption, category, subreddit }`

#### 4. **YouTube Data API** (`src/utils/youtubeMusic.js`) ⭐ ENHANCED
- `getYouTubeRecommendations(emotion, sentimentScore)` — Searches YouTube for mood-based music
- Uses YouTube Data API v3
- Falls back to mock data if API key missing
- Returns: `{ title, artist, videoId, thumbnail, mood }`

### Widget System

The rotating widget system automatically cycles through different wellness experiences:
- Auto-rotates every 30 seconds
- Manual navigation with arrows
- Pause on hover
- Touch/swipe support for mobile
- **8 widgets total**: Photo Caption, Music, Quote, Meme, Image Gen, Tap to Uplift, MintChat, Wellness Summary

### Authentication & Security

- **Google Sign-In** via Firebase Authentication
- Protected routes with authentication checks
- Secure API key management via environment variables
- User data stored in Firestore
- Docker secrets support for production

---

## 🧪 Testing Features

### Test Gemini API Connection

Open browser console and run:
```javascript
testGeminiConnection()
```

This will verify your Gemini API key is working correctly.

### Test API Integrations

```javascript
// Test Quote API
import { getDailyQuote } from './utils/quoteApi';
getDailyQuote().then(console.log);

// Test Meme API
import { getRandomMeme } from './utils/memeApi';
getRandomMeme('wholesomememes').then(console.log);

// Test YouTube API
import { getYouTubeRecommendations } from './utils/youtubeMusic';
getYouTubeRecommendations('happy', 0.8).then(console.log);
```

---

## 📱 App Experience Flow

1. **User logs in** — Google Auth via Firebase
2. **Dashboard loads** — Rotating widgets powered by AI
3. **User interacts** — Chat, photo, quote, meme, or music widgets
4. **APIs fetch live data** — ZenQuotes, Meme API, YouTube, Gemini
5. **Gemini understands** — Continuously adapts to user mood
6. **Visual therapy** — AI-generated soothing visuals
7. **Data stored** — Firebase for journaling & analytics
8. **Daily summary** — AI-generated wellness insights

---

## 🌟 Recent Enhancements

### ✨ New Features Added

- **Live API Integrations**
  - ✅ ZenQuotes API for inspirational quotes
  - ✅ Meme API (meme-api.com) for uplifting memes
  - ✅ YouTube Data API v3 for music recommendations
  - ✅ Enhanced Gemini integration with conversation history

- **Enhanced Widgets**
  - ✅ Quote widget now uses ZenQuotes API
  - ✅ Meme widget fetches from meme-api.com
  - ✅ Music widget searches YouTube in real-time
  - ✅ All widgets have fallback mechanisms

- **Deployment Infrastructure**
  - ✅ Docker containerization
  - ✅ Google Cloud Run deployment
  - ✅ Automated Cloud Build pipeline
  - ✅ Environment variable management

- **Daily Wellness Summary Widget** — AI-powered daily wellness insights
- **Mood Analytics Dashboard** — Visual timeline with AI trend analysis
- **Journal AI Summarization** — Intelligent insights from journal entries
- **Enhanced MintChat** — Conversation history and context awareness
- **Visual Mood Timeline** — Interactive charts tracking emotional growth
- **Beautiful Login Page** — Animated authentication with error handling

### 🔧 Improvements Made

- Enhanced API error handling with graceful fallbacks
- Better user feedback during API calls
- Improved UI/UX with smooth animations
- Wellness analytics utility functions
- Better code organization and reusability
- Centralized API helpers (`apiHelpers.js`)
- Production-ready Docker configuration
- Cloud Run deployment automation

---

## 🔐 Environment Variables

All sensitive configuration is handled via environment variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes | - |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes | - |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes | - |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes | - |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes | - |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes | - |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID | Optional | - |
| `VITE_GEMINI_API_KEY` | Gemini AI API key | Yes | - |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API v3 key | Optional | - |
| `VITE_QUOTE_API` | ZenQuotes API URL | Optional | `https://zenquotes.io/api/random` |
| `VITE_MEME_API` | Meme API URL | Optional | `https://meme-api.com/gimme` |
| `VITE_API_BASE_URL` | Backend API URL | Optional | - |
| `VITE_USE_BACKEND_API` | Enable backend API | Optional | `false` |

**Note:** For production deployments, pass these as build arguments to Docker or Cloud Build.

---

## 📚 Documentation

Additional documentation files:

### Setup & Configuration
- `GOOGLE_PHOTOS_SETUP.md` — Google Photos integration guide
- `GOOGLE_CLOUD_SETUP.md` — Google Cloud configuration
- `DOCKER_SETUP.md` — Docker setup and troubleshooting

### API Integration
- `API_INTEGRATION_GUIDE.md` — Complete API integration documentation
- `BACKEND_INTEGRATION.md` — Backend API integration
- `FRONTEND_BACKEND_MIGRATION.md` — Migration guide

### Deployment
- `DEPLOYMENT_STEPS.md` — Step-by-step deployment guide
- `CLOUD_RUN_DEPLOY.md` — Comprehensive Cloud Run deployment
- `QUICK_DEPLOY.md` — Quick deployment reference
- `FIX_SUBSTITUTIONS.md` — Cloud Build troubleshooting

### Troubleshooting
- `FIREBASE_BUILD_FIX.md` — Firebase build issues
- `DEBUG_BUILD.md` — Build debugging guide
- `BUILD_DEBUG.md` — Additional build debugging

---

## 🎨 Design Features

- **Mobile-First Design** — Optimized for Gen Z mobile users
- **Neumorphic UI** — Modern, soft-shadow design language
- **Smooth Animations** — Framer Motion powered transitions
- **Dark/Light Mode Support** — Theme-aware components
- **Responsive Layout** — Works on all screen sizes
- **Accessible UX** — Screen reader friendly

---

## 🚦 Development

### Available Scripts

- `npm start` — Start development server (port 53000)
- `npm run build` — Build for production
- `npm run serve` — Preview production build

### Code Style

- ESLint configured
- Prettier formatting (recommended)
- Component-based architecture
- Utility function organization
- Centralized API helpers

### Docker Commands

```bash
# Build locally
docker-compose up

# Build with custom env
docker build --build-arg VITE_GEMINI_API_KEY=... -t mintai-app .

# Run container
docker run -p 8080:8080 mintai-app
```

---

## 🔮 Future Roadmap

- [ ] Voice-based chat using Gemini multimodal input
- [ ] Google Fit API integration for health-linked wellness
- [ ] Community sharing mode (anonymized and AI-moderated)
- [ ] MintAi+ subscription with deeper analytics
- [ ] Video generation using Vertex AI Veo
- [ ] Enhanced Firebase persistence (cloud sync)
- [ ] Progressive Web App (PWA) optimization
- [ ] Real-time collaboration features
- [ ] Multi-language support

---

## 🏆 Hackathon Compliance

✅ **Built using Google Cloud's AI Tools:**
- Gemini 1.5 Pro/Flash
- Gemini Vision API
- Firebase (Auth, Firestore, Storage)
- Google Photos API integration
- YouTube Data API v3
- Google Cloud Run
- Google Cloud Build

✅ **Demonstrates AI Capabilities:**
- Real-time conversational AI
- Image analysis and captioning
- Sentiment analysis
- Content generation
- Pattern recognition
- Live API integrations

✅ **Scalable and Mobile-Compatible:**
- Mobile-first responsive design
- Serverless-ready architecture
- Docker containerization
- Cloud Run deployment
- Production-ready configuration

✅ **Aligns with Mental Wellness Cause:**
- Focused on Gen Z mental health
- Promotes positive behavior
- Encourages mindfulness and self-care
- Accessible and stigma-free

✅ **Creative and Socially Valuable:**
- Unique rotating widget concept
- Combines humor, creativity, and empathy
- Live API integrations for real-time content
- High potential for social impact

---

## 📄 License

This project is part of the Google GenAI Hackathon submission.

---

## 🙏 Acknowledgments

- Powered by **React** and **Vite**
- Styled with **Tailwind CSS**
- AI capabilities by **Google Gemini**
- Backend infrastructure by **Firebase**
- APIs: **ZenQuotes**, **Meme API**, **YouTube Data API**
- Hosted on **Google Cloud Run**

---

## 📞 Support

For issues or questions:

1. **Check Documentation**
   - Review documentation files in the project root
   - See `API_INTEGRATION_GUIDE.md` for API usage
   - See `DEPLOYMENT_STEPS.md` for deployment help

2. **Debugging**
   - Review browser console for detailed error messages
   - Verify environment variables are set correctly
   - Run `testGeminiConnection()` in browser console

3. **Common Issues**
   - API keys not working → Check `.env` file and build arguments
   - Widgets showing fallbacks → Verify API keys and network
   - Deployment fails → See `CLOUD_RUN_DEPLOY.md` and `FIREBASE_BUILD_FIX.md`

---

**Built with ❤️ for Gen Z Wellbeing**

*MintAi — Refresh your mind, one widget at a time.*

---

## 🚀 Quick Deploy Checklist

Before deploying, ensure:

- [ ] `.env` file created with all API keys
- [ ] Firebase project configured
- [ ] Gemini API key from Google AI Studio
- [ ] YouTube Data API v3 enabled and key obtained
- [ ] Docker installed (for local testing)
- [ ] `gcloud` CLI installed and authenticated
- [ ] Google Cloud project set up
- [ ] Cloud Build API enabled

Then run:
```powershell
.\build-now.ps1
gcloud run deploy mintai-app --image gcr.io/YOUR_PROJECT/mintai-app:latest --platform managed --region asia-south1 --allow-unauthenticated --port 8080
```

---

**Status**: ✅ Production Ready | 🐳 Dockerized | ☁️ Cloud Run Deployed | 🔌 APIs Integrated
