# Google Cloud Run Deployment Guide

Complete guide for deploying MintAi to Google Cloud Run.

## ✅ Cloud Run Compatibility

Your Dockerfile is **fully compatible** with Google Cloud Run! Here's what makes it work:

- ✅ Container listens on port 8080 (Cloud Run default, or PORT env var)
- ✅ Health check endpoint at `/health`
- ✅ Dynamic PORT support via nginx template system (Cloud Run sets PORT env var)
- ✅ Static file serving with nginx:alpine
- ✅ React Router SPA routing support
- ✅ Optimized multi-stage build
- ✅ Uses nginx:alpine's built-in template processing (no custom entrypoint needed)

## 🚀 Quick Deploy

### Prerequisites

1. **Install Google Cloud SDK**
   ```bash
   # Windows (PowerShell as Admin)
   (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
   & $env:Temp\GoogleCloudSDKInstaller.exe

   # Mac
   brew install --cask google-cloud-sdk

   # Linux
   curl https://sdk.cloud.google.com | bash
   ```

2. **Authenticate**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable required APIs**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

## 📦 Method 1: Build and Deploy (Recommended)

### Step 1: Build the Image with Environment Variables

```bash
# Set your environment variables
export VITE_FIREBASE_API_KEY="your-key"
export VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
export VITE_FIREBASE_PROJECT_ID="your-project-id"
export VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
export VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
export VITE_FIREBASE_APP_ID="1:123456789:web:abc123"
export VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
export VITE_GEMINI_API_KEY="your-gemini-key"

# Build using Cloud Build (recommended)
gcloud builds submit \
  --tag gcr.io/YOUR_PROJECT_ID/mintai \
  --substitutions _FIREBASE_API_KEY="${VITE_FIREBASE_API_KEY}",_AUTH_DOMAIN="${VITE_FIREBASE_AUTH_DOMAIN}",_PROJECT_ID="${VITE_FIREBASE_PROJECT_ID}",_STORAGE_BUCKET="${VITE_FIREBASE_STORAGE_BUCKET}",_MESSAGING_SENDER_ID="${VITE_FIREBASE_MESSAGING_SENDER_ID}",_APP_ID="${VITE_FIREBASE_APP_ID}",_MEASUREMENT_ID="${VITE_FIREBASE_MEASUREMENT_ID}",_GEMINI_API_KEY="${VITE_GEMINI_API_KEY}"
```

### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy mintai \
  --image gcr.io/YOUR_PROJECT_ID/mintai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --timeout 300
```

## 📦 Method 2: Using cloudbuild.yaml (Best Practice)

Create `cloudbuild.yaml`:

```yaml
steps:
  # Build the Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '--build-arg'
      - 'VITE_FIREBASE_API_KEY=${_FIREBASE_API_KEY}'
      - '--build-arg'
      - 'VITE_FIREBASE_AUTH_DOMAIN=${_AUTH_DOMAIN}'
      - '--build-arg'
      - 'VITE_FIREBASE_PROJECT_ID=${_PROJECT_ID}'
      - '--build-arg'
      - 'VITE_FIREBASE_STORAGE_BUCKET=${_STORAGE_BUCKET}'
      - '--build-arg'
      - 'VITE_FIREBASE_MESSAGING_SENDER_ID=${_MESSAGING_SENDER_ID}'
      - '--build-arg'
      - 'VITE_FIREBASE_APP_ID=${_APP_ID}'
      - '--build-arg'
      - 'VITE_FIREBASE_MEASUREMENT_ID=${_MEASUREMENT_ID}'
      - '--build-arg'
      - 'VITE_GEMINI_API_KEY=${_GEMINI_API_KEY}'
      - '--build-arg'
      - 'VITE_YOUTUBE_API_KEY=${_YOUTUBE_API_KEY}'
      - '-t'
      - 'gcr.io/$PROJECT_ID/mintai:$COMMIT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/mintai:latest'
      - '.'
    id: 'build-image'

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/mintai:$COMMIT_SHA']
    id: 'push-image-sha'

  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/mintai:latest']
    id: 'push-image-latest'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'mintai'
      - '--image'
      - 'gcr.io/$PROJECT_ID/mintai:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--port'
      - '8080'
      - '--memory'
      - '512Mi'
    id: 'deploy-cloud-run'

substitutions:
  _FIREBASE_API_KEY: 'your-firebase-api-key'
  _AUTH_DOMAIN: 'your-project.firebaseapp.com'
  _PROJECT_ID: 'your-project-id'
  _STORAGE_BUCKET: 'your-project.appspot.com'
  _MESSAGING_SENDER_ID: '123456789'
  _APP_ID: '1:123456789:web:abc123'
  _MEASUREMENT_ID: 'G-XXXXXXXXXX'
  _GEMINI_API_KEY: 'your-gemini-key'
  _YOUTUBE_API_KEY: ''

options:
  logging: CLOUD_LOGGING_ONLY

images:
  - 'gcr.io/$PROJECT_ID/mintai:$COMMIT_SHA'
  - 'gcr.io/$PROJECT_ID/mintai:latest'
```

### Deploy with Cloud Build:

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions _FIREBASE_API_KEY="your-key",_AUTH_DOMAIN="your-domain",_PROJECT_ID="your-project-id",_STORAGE_BUCKET="your-bucket",_MESSAGING_SENDER_ID="123",_APP_ID="1:123:web:abc",_MEASUREMENT_ID="G-XXX",_GEMINI_API_KEY="your-gemini-key"
```

## 🔒 Method 3: Using Secret Manager (Most Secure)

### Step 1: Store Secrets

```bash
echo -n "your-firebase-api-key" | gcloud secrets create firebase-api-key --data-file=-
echo -n "your-gemini-key" | gcloud secrets create gemini-api-key --data-file=-
```

### Step 2: Build with Secrets

Update `cloudbuild.yaml` to use secrets (see Google Cloud Build documentation).

## 🌐 Configure Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service mintai \
  --domain yourdomain.com \
  --region us-central1
```

## 🔍 Verify Deployment

### Check Service Status
```bash
gcloud run services describe mintai --region us-central1
```

### View Logs
```bash
gcloud run services logs read mintai --region us-central1
```

### Test Health Endpoint
```bash
curl https://YOUR_SERVICE_URL.run.app/health
```

## ⚙️ Cloud Run Configuration

### Recommended Settings

```bash
gcloud run services update mintai \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --concurrency 80 \
  --cpu-throttling
```

### Performance Options

- **Memory**: 512Mi (minimum for React app)
- **CPU**: 1 (sufficient for static files)
- **Min instances**: 0 (cost optimization)
- **Max instances**: 10+ (scale based on traffic)
- **Timeout**: 300s (Cloud Run max)

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      
      - name: Build and Deploy
        run: |
          gcloud builds submit \
            --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/mintai \
            --substitutions _FIREBASE_API_KEY="${{ secrets.FIREBASE_API_KEY }}",...
          
          gcloud run deploy mintai \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/mintai \
            --region us-central1 \
            --platform managed \
            --allow-unauthenticated
```

## 💰 Cost Optimization

- **Min instances = 0**: No cost when idle
- **CPU throttling**: Reduces cost during low traffic
- **Memory**: Use minimum required (512Mi)
- **Request timeout**: Set appropriate timeout

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
gcloud run services logs read mintai --region us-central1 --limit 50
```

### Health check failing
- Verify `/health` endpoint returns 200
- Check nginx logs in Cloud Run logs

### Environment variables not loading
- Verify build args were passed during `gcloud builds submit`
- Check build logs for validation messages
- Ensure secrets are properly formatted

### Port errors
- Cloud Run automatically sets PORT env var
- nginx.conf.template uses `${PORT:-8080}` (defaults to 8080)
- Verify entrypoint script is executable

## 📊 Monitoring

### View Metrics
```bash
gcloud run services describe mintai --region us-central1 --format="value(status.url)"
```

### Set Up Alerts
- Use Cloud Monitoring for error rates
- Set up alerts for high latency
- Monitor request counts

## 🔐 Security

- ✅ HTTPS enabled by default
- ✅ Secrets stored in Secret Manager
- ✅ Environment variables in build (baked into bundle)
- ✅ CORS configured via Firebase
- ✅ Security headers in nginx.conf

## 📝 Next Steps

1. **Set up CI/CD** using GitHub Actions
2. **Configure custom domain** for production
3. **Set up monitoring** and alerts
4. **Optimize caching** headers for better performance
5. **Enable Cloud CDN** for faster global delivery

---

**Your Dockerfile is Cloud Run ready!** 🎉

Just build with the correct environment variables and deploy. The container will automatically use the PORT that Cloud Run provides.

