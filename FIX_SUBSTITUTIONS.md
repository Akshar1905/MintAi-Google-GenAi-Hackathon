# Fix: Build Args Not Being Passed

## ❌ What You're Doing Wrong

You're running:
```bash
gcloud builds submit --tag gcr.io/mintai-476913/mintai-app
```

This **doesn't pass any build arguments**, so all environment variables are empty!

## ✅ Correct Ways to Build

### Option 1: Use the Build Script (EASIEST)

```powershell
.\build-cloud-run.ps1
```

This script:
- Loads your `.env` file
- Passes all substitutions via `cloudbuild.yaml`
- Builds and pushes automatically

### Option 2: Use cloudbuild.yaml with Substitutions

```powershell
gcloud builds submit --config cloudbuild.yaml --substitutions _FIREBASE_API_KEY="your-key",_AUTH_DOMAIN="your-domain",...
```

### Option 3: Manual Build Args (NOT RECOMMENDED)

```powershell
gcloud builds submit --tag gcr.io/mintai-476913/mintai-app `
  --substitutions _FIREBASE_API_KEY="your-key",_AUTH_DOMAIN="your-domain",...
```

But this won't work because `--tag` doesn't use `cloudbuild.yaml` where substitutions are defined!

## 🔍 Why It's Failing

When you run `gcloud builds submit --tag`, it:
1. Builds directly from Dockerfile
2. **Doesn't use cloudbuild.yaml**
3. **No build args are passed**
4. Dockerfile sees empty ARG values
5. Build fails validation

## ✅ Solution

**Always use the build script or cloudbuild.yaml:**

```powershell
# Use the script (recommended)
.\build-cloud-run.ps1

# OR use cloudbuild.yaml directly
gcloud builds submit --config cloudbuild.yaml --substitutions "_FIREBASE_API_KEY=$env:VITE_FIREBASE_API_KEY,..."
```

## 📋 Quick Checklist

- [ ] Use `.\build-cloud-run.ps1` script
- [ ] OR use `--config cloudbuild.yaml` with `--substitutions`
- [ ] **NEVER** use `--tag` without substitutions
- [ ] Ensure `.env` file exists with all variables

