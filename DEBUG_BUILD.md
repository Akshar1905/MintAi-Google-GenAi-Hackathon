# Debugging Docker Build Issues

## Issue: Firebase API Key Not Loading

If you're seeing "Firebase invalid API key" error after Docker build, follow these steps:

## Step 1: Verify Environment Variables Are Passed

### Check Build Logs

When building, look for these messages in the build output:
```
✅ VITE_FIREBASE_API_KEY is set (length: 39)
✅ VITE_FIREBASE_PROJECT_ID is set: your-project-id
```

If you see warnings like:
```
⚠️  WARNING: VITE_FIREBASE_API_KEY is empty or not set!
```
This means the build arguments weren't passed correctly.

### Using Docker Build

Make sure you're passing all build arguments:

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

### Using Docker Compose

Ensure your `.env` file exists and has all variables:

```bash
# Create .env from example
cp .docker.env.example .env

# Edit .env with your actual values
# Then build:
docker-compose --env-file .env build
```

## Step 2: Verify Build-Time Substitution

Vite replaces `import.meta.env.VITE_*` at **build time**, not runtime.

To verify the values are embedded in the build:

1. **Build the image**
   ```bash
   docker build -t mintai:test .
   ```

2. **Inspect the built JavaScript**
   ```bash
   # Create a temporary container
   docker create --name temp mintai:test
   
   # Extract the built JS file
   docker cp temp:/usr/share/nginx/html/assets/index-*.js ./temp-build.js
   
   # Search for your API key (should find it embedded)
   grep -i "firebase" temp-build.js
   
   # Cleanup
   docker rm temp
   rm temp-build.js
   ```

3. **Check for "undefined"**
   If you see `"undefined"` in the built file, the env vars weren't set during build.

## Step 3: Common Issues & Solutions

### Issue: Environment variables are empty

**Cause**: Build arguments not passed or .env file not read

**Solution**:
```bash
# Verify .env file exists and has correct format (no quotes around values)
cat .env

# Ensure docker-compose reads it
docker-compose --env-file .env config
```

### Issue: "VITE_FIREBASE_API_KEY is undefined" in browser

**Cause**: 
- Variables not set during build
- Build cached with old (empty) values

**Solution**:
```bash
# Rebuild without cache
docker build --no-cache \
  --build-arg VITE_FIREBASE_API_KEY="your-key" \
  ... \
  -t mintai:latest .
```

### Issue: Variables set but still showing undefined

**Cause**: 
- Typo in variable names (must start with `VITE_`)
- Variables set after `COPY . .` (too late in Dockerfile)

**Solution**: Ensure Dockerfile sets ENV **before** `npm run build`

## Step 4: Test Locally Before Deployment

### Test Build Locally

```bash
# Build and run locally
docker build -t mintai:local .
docker run -p 8080:8080 mintai:local

# Open browser console and check:
# - [Firebase] Configuration loaded successfully (in dev mode)
# - Or check Network tab for Firebase requests
```

### Verify in Browser Console

1. Open your deployed site
2. Open Developer Console (F12)
3. Check for Firebase initialization errors
4. Run: `console.log(import.meta.env.VITE_FIREBASE_API_KEY)`

If it shows `undefined`, the build didn't include the variable.

## Step 5: Production Build Verification

Create a simple test script to verify values:

```javascript
// Add this temporarily to src/firebase.js after line 15
console.log('[DEBUG] Firebase Config:', {
  hasApiKey: !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined',
  apiKeyLength: firebaseConfig.apiKey?.length || 0,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId
});
```

Then rebuild and check browser console.

## Quick Checklist

- [ ] `.env` file exists with all required variables
- [ ] Variables are named correctly (`VITE_` prefix)
- [ ] Dockerfile sets ENV variables before `npm run build`
- [ ] Build arguments passed correctly (`--build-arg` or `docker-compose`)
- [ ] Build logs show "✅ VITE_FIREBASE_API_KEY is set"
- [ ] No warnings about empty variables in build logs
- [ ] Rebuilt without cache if needed (`--no-cache`)
- [ ] Browser console doesn't show "undefined" for env vars

## Still Not Working?

1. **Check the built bundle directly**:
   ```bash
   # After docker build
   docker run --rm mintai:latest cat /usr/share/nginx/html/assets/index-*.js | grep -i "firebase"
   ```

2. **Verify Vite is reading env vars**:
   Add to `vite.config.mjs`:
   ```js
   console.log('Build-time env check:', {
     hasFirebaseKey: !!process.env.VITE_FIREBASE_API_KEY,
     hasProjectId: !!process.env.VITE_FIREBASE_PROJECT_ID
   });
   ```

3. **Use explicit .env file**:
   Remove `.env` from `.dockerignore` temporarily and ensure it's copied:
   ```dockerfile
   COPY .env .env
   ```

