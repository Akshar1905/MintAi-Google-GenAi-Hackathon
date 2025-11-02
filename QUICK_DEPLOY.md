# Quick Deploy to Google Cloud Run

**Fastest way to deploy MintAi to Cloud Run**

## ✅ Current Status

Your app is already deployed at: `https://mintai-app-280630776377.asia-south1.run.app`

## 🚀 Deploy with Environment Variables

### Option 1: Using Build Script (Recommended)

**Windows PowerShell:**
```powershell
.\build-cloud-run.ps1
```

**Linux/Mac:**
```bash
chmod +x build-cloud-run.sh
./build-cloud-run.sh
```

**Then deploy:**
```bash
gcloud run deploy mintai-app \
  --image gcr.io/mintai-476913/mintai-app \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```

### Option 2: Manual Build with cloudbuild.yaml

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions \
    _FIREBASE_API_KEY="your-key",\
    _AUTH_DOMAIN="your-project.firebaseapp.com",\
    _PROJECT_ID="your-project-id",\
    _STORAGE_BUCKET="your-project.appspot.com",\
    _MESSAGING_SENDER_ID="123456789",\
    _APP_ID="1:123456789:web:abc123",\
    _MEASUREMENT_ID="G-XXXXXXXXXX",\
    _GEMINI_API_KEY="your-gemini-key"
```

## ⚠️ Important Notes - READ THIS FIRST!

### ❌ DON'T DO THIS:
```bash
gcloud builds submit --tag gcr.io/mintai-476913/mintai-app
```
This will **FAIL** because no build args are passed!

### ✅ DO THIS INSTEAD:
```powershell
.\build-cloud-run.ps1
```
This uses `cloudbuild.yaml` and passes all substitutions correctly.

### Why?
- `gcloud builds submit --tag` builds directly from Dockerfile
- It doesn't use `cloudbuild.yaml`
- No build args = empty environment variables
- Your Dockerfile validates and fails if vars are empty

**Always use the build script or `--config cloudbuild.yaml` with `--substitutions`**

## 🔍 What Was Wrong?

### Issue 1: Missing Build Arguments
When you ran:
```bash
gcloud builds submit --tag gcr.io/mintai-476913/mintai-app
```
❌ **Problem**: No build arguments were passed, so env vars were empty  
✅ **Solution**: Use `cloudbuild.yaml` with `--substitutions`

### Issue 2: PORT Configuration
✅ **Fixed**: Your Dockerfile uses `nginx.conf.template` which automatically handles Cloud Run's PORT env var

## 📝 Quick Commands

```bash
# 1. Build (Windows)
.\build-cloud-run.ps1

# 2. Deploy
gcloud run deploy mintai-app \
  --image gcr.io/mintai-476913/mintai-app \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated

# 3. View logs
gcloud run services logs read mintai-app --region asia-south1

# 4. Update service URL
gcloud run services describe mintai-app --region asia-south1
```

## 🎯 One-Command Deploy (After Build)

After building once, you can update with:
```bash
gcloud run deploy mintai-app \
  --image gcr.io/mintai-476913/mintai-app:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```

---

**Your Dockerfile is correct!** Just make sure to use `cloudbuild.yaml` or the build scripts to pass environment variables. 🚀

