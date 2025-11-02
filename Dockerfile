# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Declare build arguments FIRST (before using them)
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_GEMINI_API_KEY
ARG VITE_YOUTUBE_API_KEY
ARG VITE_QUOTE_API
ARG VITE_MEME_API
ARG VITE_API_BASE_URL
ARG VITE_USE_BACKEND_API

# Set environment variables from build arguments
# Vite reads these at BUILD TIME, so they must be set before npm run build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_YOUTUBE_API_KEY=$VITE_YOUTUBE_API_KEY
ENV VITE_QUOTE_API=$VITE_QUOTE_API
ENV VITE_MEME_API=$VITE_MEME_API
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_BACKEND_API=$VITE_USE_BACKEND_API

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code (excluding what's in .dockerignore)
COPY . .

# Try to load .env file if it exists and build args are not set
# This allows using .env file as fallback (if not using build args)
RUN if [ -f .env ]; then \
      echo "📄 .env file found - Vite will read from it"; \
      echo "Note: Build args take precedence over .env file"; \
    else \
      echo "⚠️  No .env file found - ensure build args are passed"; \
    fi

# Debug: Print environment variables (without exposing secrets - just check if they exist)
RUN echo "🔍 Checking environment variables..." && \
    if [ -z "$VITE_FIREBASE_API_KEY" ] || [ "$VITE_FIREBASE_API_KEY" = "undefined" ]; then \
      echo "❌ ERROR: VITE_FIREBASE_API_KEY is empty, undefined, or not set!"; \
      echo "   Make sure to pass --build-arg VITE_FIREBASE_API_KEY=your-key"; \
      exit 1; \
    else \
      echo "✅ VITE_FIREBASE_API_KEY is set (length: ${#VITE_FIREBASE_API_KEY})"; \
    fi && \
    if [ -z "$VITE_FIREBASE_PROJECT_ID" ] || [ "$VITE_FIREBASE_PROJECT_ID" = "undefined" ]; then \
      echo "❌ ERROR: VITE_FIREBASE_PROJECT_ID is empty or not set!"; \
      exit 1; \
    else \
      echo "✅ VITE_FIREBASE_PROJECT_ID is set: $VITE_FIREBASE_PROJECT_ID"; \
    fi && \
    if [ -z "$VITE_GEMINI_API_KEY" ] || [ "$VITE_GEMINI_API_KEY" = "undefined" ]; then \
      echo "⚠️  WARNING: VITE_GEMINI_API_KEY is not set (optional but recommended)"; \
    else \
      echo "✅ VITE_GEMINI_API_KEY is set"; \
    fi

# Build app - Vite will read VITE_* env vars at build time and embed them in the bundle
RUN npm run build

# ---------- Stage 2: Production ----------
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from builder stage
COPY --from=builder /app/build ./

# Copy custom nginx config template
# nginx:alpine automatically processes .template files from /etc/nginx/templates/
# It uses envsubst to substitute environment variables like ${PORT}
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Set default PORT (Cloud Run sets PORT env var automatically)
# If not set, nginx:alpine's entrypoint will use 8080 as default
ENV PORT=8080

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# nginx:alpine's default entrypoint automatically processes templates
# PORT env var will be substituted in nginx.conf.template at startup
CMD ["nginx", "-g", "daemon off;"]
  