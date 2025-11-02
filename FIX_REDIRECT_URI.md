# Fix Redirect URI Mismatch Error

## Current Error
```
Error 400: redirect_uri_mismatch
Request details: redirect_uri=http://localhost:53000/oauth/google-photos/callback
```

## Quick Fix Steps

### Step 1: Check Your Current Redirect URI
When you click "Connect Google Photos", open your browser console (F12) and look for:
```
[Google Photos] Redirect URI: http://localhost:53000/oauth/google-photos/callback
```

**Copy that EXACT URI** (it will show your actual port number).

### Step 2: Add to Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select project: **mintai-476913**

2. **Navigate to OAuth Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Find OAuth 2.0 Client ID: `280630776377-dn9ad8etvtvfgja1bs6jd2qnp7e57a0o`
   - Click **Edit** (pencil icon)

3. **Add Authorized Redirect URIs**
   
   **Based on your error, add this EXACT URI:**
   ```
   http://localhost:53000/oauth/google-photos/callback
   ```
   
   **Also add common development ports:**
   ```
   http://localhost:5173/oauth/google-photos/callback
   http://localhost:3000/oauth/google-photos/callback
   http://localhost:5174/oauth/google-photos/callback
   http://127.0.0.1:53000/oauth/google-photos/callback
   ```

4. **Add Authorized JavaScript Origins**
   ```
   http://localhost:53000
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:53000
   ```

5. **Save Changes**
   - Click **Save**
   - Wait 1-2 minutes for changes to propagate

### Step 3: Verify

1. **Clear browser cache** (or use incognito mode)
2. **Try connecting Google Photos again**
3. **Check browser console** for the redirect URI being used

## Important Notes

✅ **Must Match Exactly:**
- Protocol: `http://` (not `https://` for localhost)
- Domain: `localhost` (not `127.0.0.1` - they're different!)
- Port: The exact port Vite is running on
- Path: `/oauth/google-photos/callback` (case-sensitive, no trailing slash)

❌ **Common Mistakes:**
- Wrong port number
- Using `https://` instead of `http://` for localhost
- Adding trailing slash: `/oauth/google-photos/callback/` (wrong!)
- Using `127.0.0.1` instead of `localhost` (they're treated as different)

## Auto-Detection

The app automatically detects your current port using `window.location.origin`. The console will show you the exact URI being used.

## If Still Not Working

1. **Check Vite config** (`vite.config.mjs`) - might have custom port settings
2. **Check terminal** where Vite is running - shows the actual port
3. **Try multiple ports** - Vite might use different ports on different runs
4. **Wait 2-3 minutes** after saving in Google Cloud Console

## Production Setup

When deploying to production, add:
```
https://your-domain.com/oauth/google-photos/callback
```

And update Authorized JavaScript Origins:
```
https://your-domain.com
```

