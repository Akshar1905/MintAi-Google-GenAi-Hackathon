# Firebase API Key Build Fix Summary

## Problems Identified & Fixed

### 1. **Environment Variables Set Too Late**
   - **Issue**: ENV variables were set after `COPY . .`, but Vite needs them before `npm run build`
   - **Fix**: Moved ARG/ENV declarations to the top of the Dockerfile, before any COPY commands

### 2. **.env File Blocked by .dockerignore**
   - **Issue**: `.env` was in `.dockerignore`, so `COPY .env .env` would silently fail
   - **Fix**: Commented out `.env` in `.dockerignore` (but using build args is preferred)

### 3. **No Validation During Build**
   - **Issue**: Build would succeed even if env vars were empty, causing runtime errors
   - **Fix**: Added validation that fails the build if required variables are missing

### 4. **Port Mapping Mismatch**
   - **Issue**: docker-compose mapped `8080:80` but nginx listens on `8080`
   - **Fix**: Changed to `8080:8080`

## How It Works Now

### Vite Environment Variables
Vite replaces `import.meta.env.VITE_*` at **build time**. The values are embedded in the JavaScript bundle during `npm run build`.

### Docker Build Process
1. **Declare ARG** → Accept build arguments
2. **Set ENV** → Convert ARG to ENV (Vite reads ENV at build time)
3. **Validate** → Check that required variables are set
4. **Build** → Vite reads ENV vars and embeds them in bundle

## How to Build Correctly

### Method 1: Using Build Scripts (Easiest)

**Windows:**
```powershell
.\build-with-env.ps1
```

**Linux/Mac:**
```bash
chmod +x build-with-env.sh
./build-with-env.sh
```

### Method 2: Using Docker Compose

```bash
# Ensure .env file exists
cp .docker.env.example .env
# Edit .env with your values

# Build
docker-compose --env-file .env build

# Run
docker-compose up
```

### Method 3: Manual Build with Build Args

```bash
docker build \
  --build-arg VITE_FIREBASE_API_KEY="AIzaSy..." \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com" \
  --build-arg VITE_FIREBASE_PROJECT_ID="your-project-id" \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com" \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="123456789" \
  --build-arg VITE_FIREBASE_APP_ID="1:123456789:web:abc123" \
  --build-arg VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX" \
  --build-arg VITE_GEMINI_API_KEY="AIzaSy..." \
  -t mintai:latest .
```

## Verification

### During Build
Look for these messages in build output:
```
✅ VITE_FIREBASE_API_KEY is set (length: 39)
✅ VITE_FIREBASE_PROJECT_ID is set: your-project-id
✅ VITE_GEMINI_API_KEY is set
```

If you see:
```
❌ ERROR: VITE_FIREBASE_API_KEY is empty, undefined, or not set!
```
→ Build will fail (this is good! Prevents deploying broken builds)

### After Deployment
1. Open browser console
2. Look for: `[Firebase] Configuration loaded successfully`
3. If you see "invalid API key" → Check build logs for missing variables

## Key Changes Made

### Dockerfile
- ✅ ARG/ENV declarations moved to top
- ✅ Added validation that fails build if keys are missing
- ✅ Better debug output showing variable status
- ✅ Fixed formatting and indentation

### .dockerignore
- ✅ `.env` exclusion commented (allows copying .env if needed)
- ✅ Build args preferred over .env file

### docker-compose.yml
- ✅ Fixed port mapping: `8080:8080`
- ✅ Fixed health check port

### firebase.js
- ✅ Added validation in development mode
- ✅ Better error messages for missing config

### New Files
- ✅ `build-with-env.sh` - Linux/Mac build script
- ✅ `build-with-env.ps1` - Windows PowerShell build script
- ✅ `DEBUG_BUILD.md` - Comprehensive debugging guide
- ✅ `FIREBASE_BUILD_FIX.md` - This file

## Testing Checklist

- [ ] Build succeeds with all required env vars
- [ ] Build fails if VITE_FIREBASE_API_KEY is missing
- [ ] Build logs show "✅ VITE_FIREBASE_API_KEY is set"
- [ ] Deployed site initializes Firebase correctly
- [ ] Browser console shows "[Firebase] Configuration loaded successfully"
- [ ] No "invalid API key" errors

## Next Steps

1. **Rebuild your image** using one of the methods above
2. **Check build logs** for validation messages
3. **Deploy and test** - Firebase should initialize correctly
4. **Remove build scripts** if you prefer using docker-compose only

## Need Help?

See `DEBUG_BUILD.md` for detailed troubleshooting steps.

