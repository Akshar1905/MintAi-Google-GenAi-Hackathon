#!/bin/bash

# Build script for MintAi Docker image with environment variables
# Usage: ./build-with-env.sh

set -e  # Exit on error

echo "🔨 Building MintAi Docker image with environment variables..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Using environment variables from current shell or build args"
    echo ""
fi

# Read environment variables from .env if it exists, or use environment
if [ -f .env ]; then
    echo "📄 Loading variables from .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# Build Docker image with build arguments
echo "🏗️  Building Docker image..."
docker build \
    --build-arg VITE_FIREBASE_API_KEY="${VITE_FIREBASE_API_KEY}" \
    --build-arg VITE_FIREBASE_AUTH_DOMAIN="${VITE_FIREBASE_AUTH_DOMAIN}" \
    --build-arg VITE_FIREBASE_PROJECT_ID="${VITE_FIREBASE_PROJECT_ID}" \
    --build-arg VITE_FIREBASE_STORAGE_BUCKET="${VITE_FIREBASE_STORAGE_BUCKET}" \
    --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="${VITE_FIREBASE_MESSAGING_SENDER_ID}" \
    --build-arg VITE_FIREBASE_APP_ID="${VITE_FIREBASE_APP_ID}" \
    --build-arg VITE_FIREBASE_MEASUREMENT_ID="${VITE_FIREBASE_MEASUREMENT_ID}" \
    --build-arg VITE_GEMINI_API_KEY="${VITE_GEMINI_API_KEY}" \
    --build-arg VITE_YOUTUBE_API_KEY="${VITE_YOUTUBE_API_KEY}" \
    --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
    --build-arg VITE_USE_BACKEND_API="${VITE_USE_BACKEND_API}" \
    -t mintai:latest .

echo ""
echo "✅ Build complete!"
echo ""
echo "To run the container:"
echo "  docker run -d -p 8080:8080 --name mintai mintai:latest"
echo ""
echo "Or use docker-compose:"
echo "  docker-compose up"

