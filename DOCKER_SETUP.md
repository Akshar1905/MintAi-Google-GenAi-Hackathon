# Docker Setup Guide for MintAi

This guide explains how to build and run MintAi using Docker.

## 📋 Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- Your environment variables configured

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Create environment file**
   ```bash
   cp .docker.env.example .docker.env
   ```

2. **Edit `.docker.env`** with your actual values:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-key
   VITE_GEMINI_API_KEY=your-actual-key
   # ... etc
   ```

3. **Build and run**
   ```bash
   docker-compose --env-file .docker.env up --build
   ```

4. **Access the app**
   - Open `http://localhost:8080` in your browser

### Option 2: Using Docker directly

1. **Build the image**
   ```bash
   docker build \
     --build-arg VITE_FIREBASE_API_KEY=your-key \
     --build-arg VITE_GEMINI_API_KEY=your-key \
     --build-arg VITE_FIREBASE_AUTH_DOMAIN=your-domain \
     --build-arg VITE_FIREBASE_PROJECT_ID=your-project-id \
     --build-arg VITE_FIREBASE_STORAGE_BUCKET=your-bucket \
     --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id \
     --build-arg VITE_FIREBASE_APP_ID=your-app-id \
     --build-arg VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id \
     -t mintai:latest .
   ```

2. **Run the container**
   ```bash
   docker run -d -p 8080:80 --name mintai mintai:latest
   ```

3. **Access the app**
   - Open `http://localhost:8080` in your browser

## 🔧 Docker Commands

### Build the image

**Option 1: Using build script (Recommended)**
```bash
# Linux/Mac
chmod +x build-with-env.sh
./build-with-env.sh

# Windows PowerShell
.\build-with-env.ps1
```

**Option 2: Using docker-compose**
```bash
docker-compose --env-file .env build
```

**Option 3: Manual build with build args**
```bash
docker build \
  --build-arg VITE_FIREBASE_API_KEY="your-key" \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN="your-domain" \
  --build-arg VITE_FIREBASE_PROJECT_ID="your-project-id" \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET="your-bucket" \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id" \
  --build-arg VITE_FIREBASE_APP_ID="your-app-id" \
  --build-arg VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id" \
  --build-arg VITE_GEMINI_API_KEY="your-gemini-key" \
  -t mintai:latest .
```

### Start the container
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop the container
```bash
docker-compose down
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### View running containers
```bash
docker ps
```

### Remove container and image
```bash
docker-compose down --rmi all
```

## 🌐 Production Deployment

### Using Environment Variables File

For production, use an `.env` file:

```bash
docker-compose --env-file .docker.env -f docker-compose.yml up -d
```

### Using Docker Secrets (Docker Swarm)

For sensitive data in production:
```bash
docker secret create firebase_key ./secrets/firebase-key.txt
docker secret create gemini_key ./secrets/gemini-key.txt
```

### Health Check

The container includes a health check endpoint:
```bash
curl http://localhost:8080/health
```

Should return: `healthy`

## 🔒 Security Best Practices

1. **Never commit `.docker.env`** to version control
2. **Use build secrets** in production
3. **Keep Docker images updated**: `docker pull nginx:alpine`
4. **Use specific tags** instead of `latest` in production
5. **Scan images for vulnerabilities**: `docker scan mintai:latest`

## 📦 Image Optimization

The Dockerfile uses:
- **Multi-stage build** to minimize final image size
- **Alpine Linux** for smaller base images
- **nginx:alpine** for efficient static file serving

Expected final image size: ~50-60 MB

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Check if port is already in use
netstat -an | grep 8080
```

### Build fails
```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache
```

### Environment variables not working
- Ensure all required variables are set
- Check that build args are passed correctly
- Verify `.env` file format (no quotes needed)

### App shows blank page
- Check browser console for errors
- Verify environment variables are correctly set
- Ensure nginx is serving files correctly
- Check nginx logs: `docker-compose logs mintai`

## 🚢 Deployment Options

### Google Cloud Run
```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mintai

# Deploy to Cloud Run
gcloud run deploy mintai \
  --image gcr.io/YOUR_PROJECT_ID/mintai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### AWS ECS/Fargate
- Build and push to ECR
- Create task definition with environment variables
- Deploy to Fargate service

### Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name mintai \
  --image mintai:latest \
  --dns-name-label mintai-app \
  --ports 80
```

## 📝 Notes

- The Dockerfile uses **multi-stage build** for optimization
- Static files are served via **nginx** for production
- Environment variables are **baked into the build** at build time
- For dynamic environment variables, consider using runtime injection or a config service

## 🔄 Updating the Application

1. Make code changes
2. Rebuild the image: `docker-compose build`
3. Restart: `docker-compose up -d`
4. Or use rolling update strategies for zero-downtime

---

**Built for MintAi — Mental Wellness Platform**

