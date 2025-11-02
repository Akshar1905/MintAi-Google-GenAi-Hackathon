# How to Reconnect Google Photos with Correct Scope

## Current Status ✅
Your app has **automatically detected** the scope issue and **cleared the invalid tokens**. This is working as designed!

## Step-by-Step Reconnection Process

### Step 1: Click "Connect Google Photos" Button
Click the **"Connect Google Photos"** button in the widget.

### Step 2: Check Console Logs
**BEFORE** you get redirected to Google, check the browser console (F12). You should see:

```
[Google Photos OAuth] OAuth URL Parameters: {
  scope: "https://www.googleapis.com/auth/photoslibrary.readonly",
  access_type: "offline",
  prompt: "consent",
  client_id: "...",
  response_type: "code"
}
[Google Photos OAuth] Full OAuth URL: https://accounts.google.com/o/oauth2/auth?...
```

**✅ Verify these parameters are present:**
- `scope` includes `photoslibrary.readonly`
- `access_type` is `offline`
- `prompt` is `consent`

### Step 3: On Google's Permission Screen
When Google redirects you, you'll see a permission screen. **IMPORTANT:**

1. **Look for this permission:**
   - ✅ **"See and download your photos"** 
   - This is the permission that grants `photoslibrary.readonly` scope

2. **Make sure to:**
   - Check/toggle ON the permission for photos
   - Click **"Allow"** or **"Continue"**
   - Don't skip any permissions!

3. **If you see a list of permissions:**
   - Scroll through all permissions
   - Ensure "See and download your photos" is checked
   - This may be listed as "Google Photos Library API" or "photoslibrary.readonly"

### Step 4: After Redirecting Back
After Google redirects you back, check the console for:

```
[OAuth Token Exchange] ========== FULL TOKEN RESPONSE ==========
[OAuth Token Exchange] Complete response JSON: {...}
[OAuth Token Exchange] Scope: https://www.googleapis.com/auth/photoslibrary.readonly
[OAuth Token Exchange] ✓ Token includes photoslibrary.readonly scope
```

**✅ Verify:**
- The token response shows `scope` includes `photoslibrary.readonly`
- You see the ✅ checkmark confirming scope is correct

### Step 5: Verify Token Works
After successful connection, the app should automatically fetch a photo. Check console for:

```
[Google Photos Frontend API] Token verified - has correct scope
[Google Photos Frontend API] Response status: 200
```

## Troubleshooting

### If you still get 403 error:

1. **Revoke Previous Access (Recommended):**
   - Go to: https://myaccount.google.com/permissions
   - Find "MintAi" or your app
   - Click "Remove" or "Revoke access"
   - This ensures a fresh OAuth flow

2. **Clear Browser Storage:**
   ```javascript
   // In browser console (F12)
   localStorage.clear()
   ```
   Then reconnect

3. **Verify OAuth Consent Screen:**
   - Go to Google Cloud Console
   - APIs & Services → OAuth consent screen
   - Under "Scopes", ensure `photoslibrary.readonly` is listed
   - If not, click "ADD SCOPE" and add it

4. **Verify API is Enabled:**
   - Go to Google Cloud Console
   - APIs & Services → Enabled APIs
   - Search for "Photos Library API"
   - Ensure it's **ENABLED** ✅

### Check OAuth URL in Console

When you click "Connect Google Photos", immediately check the console. The OAuth URL should look like:

```
https://accounts.google.com/o/oauth2/auth?
  client_id=280630776377-...
  &redirect_uri=http://localhost:53000/oauth/google-photos/callback
  &response_type=code
  &scope=https://www.googleapis.com/auth/photoslibrary.readonly
  &access_type=offline
  &prompt=consent
  &state=...
```

**If `scope` parameter is missing or different**, there's a configuration issue.

### Verify Scope in Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click on your OAuth 2.0 Client ID
3. Scroll to "Authorized redirect URIs"
4. Ensure `http://localhost:53000/oauth/google-photos/callback` is listed
5. Go back to "OAuth consent screen"
6. Under "Scopes", ensure `photoslibrary.readonly` is listed

## Quick Test

After reconnecting, you can verify the token scope manually:

```javascript
// In browser console
const userId = 'YOUR_EMAIL';
const userKey = userId.replace(/[^a-zA-Z0-9]/g, '_');
const tokenKey = `mintai.googlePhotos.${userKey}.accessToken`;
const token = localStorage.getItem(tokenKey);

// Verify token exists
console.log('Token:', token ? token.substring(0, 30) + '...' : 'NOT FOUND');

// Check scope using Google's tokeninfo endpoint
fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`)
  .then(r => r.json())
  .then(data => {
    console.log('Token scopes:', data.scope);
    console.log('Has photoslibrary.readonly:', data.scope?.includes('photoslibrary.readonly'));
  });
```

This will show you if the token has the correct scope.

## Expected Console Flow

When everything works correctly, you should see this sequence:

1. **OAuth Initiation:**
   ```
   [Google Photos OAuth] OAuth URL Parameters: {scope: "...photoslibrary.readonly..."}
   ```

2. **After Google Redirect:**
   ```
   [OAuth Token Exchange] ========== FULL TOKEN RESPONSE ==========
   [OAuth Token Exchange] Scope: https://www.googleapis.com/auth/photoslibrary.readonly
   [OAuth Token Exchange] ✓ Token includes photoslibrary.readonly scope
   ```

3. **When Fetching Photos:**
   ```
   [Google Photos Frontend API] Token verified - has correct scope
   [Google Photos Frontend API] Response status: 200
   ```

If any step fails, check the error message in the console for details.

