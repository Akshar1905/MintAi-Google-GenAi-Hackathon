#!/bin/bash

# Build script for Google Cloud Run deployment
# Usage: ./build-cloud-run.sh

set -e  # Exit on error

echo "🔨 Building MintAi for Google Cloud Run..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo "   Please create a .env file with all required variables"
    exit 1
fi

echo "📄 Loading variables from .env file..."
export $(grep -v '^#' .env | xargs)

# Build and push to Google Container Registry using cloudbuild.yaml
echo "🏗️  Building and pushing Docker image..."
gcloud builds submit \
    --config cloudbuild.yaml \
    --substitutions \
        _FIREBASE_API_KEY="${VITE_FIREBASE_API_KEY}",\
        _AUTH_DOMAIN="${VITE_FIREBASE_AUTH_DOMAIN}",\
        _PROJECT_ID="${VITE_FIREBASE_PROJECT_ID}",\
        _STORAGE_BUCKET="${VITE_FIREBASE_STORAGE_BUCKET}",\
        _MESSAGING_SENDER_ID="${VITE_FIREBASE_MESSAGING_SENDER_ID}",\
        _APP_ID="${VITE_FIREBASE_APP_ID}",\
        _MEASUREMENT_ID="${VITE_FIREBASE_MEASUREMENT_ID}",\
        _GEMINI_API_KEY="${VITE_GEMINI_API_KEY}",\
        _YOUTUBE_API_KEY="${VITE_YOUTUBE_API_KEY}",\
        _API_BASE_URL="${VITE_API_BASE_URL}",\
        _USE_BACKEND_API="${VITE_USE_BACKEND_API}"

echo ""
echo "✅ Build complete!"
echo ""
echo "To deploy to Cloud Run:"
echo "  gcloud run deploy mintai-app \\"
echo "    --image gcr.io/mintai-476913/mintai-app \\"
echo "    --platform managed \\"
echo "    --region asia-south1 \\"
echo "    --allow-unauthenticated"
