# Google Cloud Console Setup Guide

## Fix Redirect URI Mismatch Error

The `redirect_uri_mismatch` error occurs when the redirect URI in your code doesn't match what's configured in Google Cloud Console.

### Steps to Fix:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project: `mintai-476913`

2. **Navigate to OAuth Credentials**
   - Go to **APIs & Services** > **Credentials**
   - Find your OAuth 2.0 Client ID: `280630776377-dn9ad8etvtvfgja1bs6jd2qnp7e57a0o`
   - Click **Edit** (pencil icon)

3. **Add Authorized Redirect URIs**

   **For Development (Local):**
   ```
   http://localhost:5173/oauth/google-photos/callback
   http://localhost:3000/oauth/google-photos/callback
   http://127.0.0.1:5173/oauth/google-photos/callback
   ```

   **For Production:**
   ```
   https://your-domain.com/oauth/google-photos/callback
   ```

   **Important:** 
   - The URI must match **exactly** (including protocol http/https)
   - Include the port number if using a custom port
   - No trailing slashes

4. **Save Changes**
   - Click **Save**
   - Wait a few minutes for changes to propagate

5. **Verify the Redirect URI in Code**

   The app uses this function to get the redirect URI:
   ```javascript
   // In src/config/googleConfig.js
   export function getRedirectUri() {
     return `${window.location.origin}/oauth/google-photos/callback`;
   }
   ```

   Make sure `window.location.origin` matches one of your authorized URIs:
   - Development: `http://localhost:5173`
   - Production: `https://your-domain.com`

### Common Issues:

1. **Port Mismatch**
   - If Vite is running on port 5173, make sure that's in the authorized URIs
   - Check your terminal for the actual port

2. **HTTP vs HTTPS**
   - Development usually uses `http://`
   - Production should use `https://`
   - Make sure both match

3. **Trailing Slashes**
   - ✅ Correct: `http://localhost:5173/oauth/google-photos/callback`
   - ❌ Wrong: `http://localhost:5173/oauth/google-photos/callback/`

4. **Domain Mismatch**
   - The domain must match exactly
   - `localhost` ≠ `127.0.0.1` (add both if needed)

### Quick Debug Steps:

1. Check your current redirect URI:
   ```javascript
   console.log('Redirect URI:', window.location.origin + '/oauth/google-photos/callback');
   ```

2. Compare with Google Cloud Console settings

3. If they don't match, add the correct one to Google Cloud Console

4. Try the OAuth flow again

### Additional OAuth Settings:

**Authorized JavaScript Origins:**
- Development: `http://localhost:5173`
- Production: `https://your-domain.com`

**OAuth Consent Screen:**
- Make sure it's published (if external users)
- Add scopes: `https://www.googleapis.com/auth/photoslibrary.readonly`

### Testing:

After updating, wait 1-2 minutes, then:
1. Clear browser cache/cookies for the OAuth session
2. Try connecting Google Photos again
3. Check browser console for any errors

