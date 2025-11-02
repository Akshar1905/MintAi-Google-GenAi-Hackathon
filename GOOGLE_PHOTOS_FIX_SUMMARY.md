# Google Photos OAuth & API Fix Summary

## Changes Made

### 1. ✅ OAuth URL Configuration (Already Correct)
The OAuth URL already includes all required parameters:
- `access_type=offline` - Ensures refresh token is provided
- `prompt=consent` - Forces consent screen to ensure scope is granted
- `scope=https://www.googleapis.com/auth/photoslibrary.readonly` - Required scope for Photos API

**Location:** `src/utils/googlePhotos.js` (lines 112-118)

### 2. ✅ Token Exchange Enhanced
- **Added comprehensive logging** for token exchange process
- **Verifies both tokens are received** (access_token and refresh_token)
- **Logs granted scopes** and verifies `photoslibrary.readonly` is included
- **Better error handling** with parsed JSON error responses
- **Returns refresh token** from exchange function

**Key Improvements:**
- Logs full token response details
- Warns if refresh token is missing (critical for token refresh)
- Verifies scope is included in token response
- Detailed error messages with JSON parsing

**Location:** `src/utils/googlePhotos.js` (lines 160-266)

### 3. ✅ Token Refresh Enhanced
- **Added comprehensive logging** for token refresh process
- **Better error handling** for invalid refresh tokens
- **Clears tokens on refresh failure** to allow reconnection
- **Logs new token expiration times**

**Key Improvements:**
- Detects invalid/expired refresh tokens
- Clears invalid tokens automatically
- Provides clear error messages
- Logs all refresh token operations

**Location:** `src/utils/googlePhotos.js` (lines 268-305)

### 4. ✅ Access Token Management Enhanced
- **Automatic token refresh** before expiration (5 minutes buffer)
- **Better expiration checking** with detailed logging
- **Handles refresh failures gracefully**
- **Returns null if token expired and refresh failed**

**Key Improvements:**
- Checks token expiration before every API call
- Automatically refreshes tokens that expire in < 5 minutes
- Falls back to existing token if refresh fails (but token not expired)
- Returns null only if token expired AND refresh failed

**Location:** `src/utils/googlePhotos.js` (lines 307-370)

### 5. ✅ API Call Error Handling Enhanced
- **Full JSON error response logging** for all errors
- **Detailed 403 error analysis** with error message, code, and status
- **Automatic token refresh on 401** errors with retry
- **Comprehensive request/response logging**

**Key Improvements:**
- Logs full error JSON from Google APIs (not just status code)
- Shows error.message, error.code, error.status for 403 errors
- Automatically refreshes token on 401 and retries request
- Logs request body, headers, and response details

**Location:** `src/utils/googlePhotos.js` (lines 385-501)

### 6. ✅ Authorization Header Usage
The access token is correctly used in the Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
}
```

**Location:** `src/utils/googlePhotos.js` (lines 433-440)

## How to Test

### 1. Check OAuth URL
When you click "Connect Google Photos", check the console logs for:
```
[Google Photos OAuth] Full OAuth URL: https://accounts.google.com/o/oauth2/auth?...
```
Verify it includes:
- `access_type=offline`
- `prompt=consent`
- `scope=https://www.googleapis.com/auth/photoslibrary.readonly`

### 2. Check Token Exchange
After OAuth redirect, check console logs for:
```
[OAuth Token Exchange] Token response received: {
  hasAccessToken: true,
  hasRefreshToken: true,
  expiresIn: 3600,
  scope: "..."
}
```

**If refresh_token is missing:**
- User needs to revoke access in Google Account settings
- Then reconnect to get a new refresh token

### 3. Check Token Scope
After token exchange, verify:
```
[OAuth Token Exchange] ✓ Token includes photoslibrary.readonly scope
```

### 4. Check API Calls
When fetching photos, check console logs for:
```
[Google Photos Frontend API] Making request to: https://photoslibrary.googleapis.com/v1/mediaItems:search
[Google Photos Frontend API] Authorization header: Bearer ...
```

### 5. Check Error Responses
If you get a 403 error, check console logs for:
```
[Google Photos Frontend API] 403 Forbidden - Full error details:
[Google Photos Frontend API] Error JSON: {...}
[Google Photos Frontend API] Error message: ...
[Google Photos Frontend API] Error code: ...
```

## Troubleshooting

### Issue: 403 Forbidden Error

**Check these:**
1. **Console logs show full error JSON** - Look for `error.message`, `error.code`, `error.status`
2. **Token scope** - Check if `photoslibrary.readonly` is in granted scopes
3. **Google Photos Library API** - Ensure it's enabled in Google Cloud Console
4. **OAuth consent screen** - Ensure `photoslibrary.readonly` scope is added

### Issue: No Refresh Token

**Symptoms:**
- Console shows: `WARNING: No refresh token received!`
- Tokens expire after 1 hour and can't be refreshed

**Solution:**
1. Revoke access in Google Account settings
2. Reconnect Google Photos
3. Ensure `access_type=offline` is in OAuth URL (check console logs)

### Issue: Token Expires Immediately

**Check:**
1. Token expiration time in console logs
2. System time is correct
3. Token refresh logic is working

### Test with curl

To test if the token works, you can use curl:
```bash
curl -X POST "https://photoslibrary.googleapis.com/v1/mediaItems:search" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pageSize": 10,
    "filters": {
      "mediaTypeFilter": {
        "mediaTypes": ["PHOTO"]
      }
    }
  }'
```

**Get your access token from browser console:**
```javascript
// Run in browser console after connecting
const userId = 'your-email@example.com';
const userKey = userId.replace(/[^a-zA-Z0-9]/g, '_');
const tokenKey = `mintai.googlePhotos.${userKey}.accessToken`;
console.log(localStorage.getItem(tokenKey));
```

## Next Steps

1. **Clear existing tokens** (if you have old tokens without refresh token):
   - Open browser console
   - Run: `localStorage.clear()` or clear specific keys
   
2. **Reconnect Google Photos**:
   - Click "Connect Google Photos" button
   - Grant "See and download your photos" permission
   - Check console logs for token exchange details

3. **Monitor console logs**:
   - All operations are now logged in detail
   - Look for warnings about missing refresh tokens
   - Check error JSON for 403 errors

4. **Verify scope**:
   - After connecting, check console logs for scope verification
   - Ensure `photoslibrary.readonly` is in granted scopes

## Files Modified

1. `src/utils/googlePhotos.js` - Enhanced token management and error handling
2. `src/pages/oauth/google-photos/callback.jsx` - Added logging for token exchange result

## Key Console Log Prefixes

- `[Google Photos OAuth]` - OAuth URL building and redirect
- `[OAuth Token Exchange]` - Token exchange process
- `[OAuth Callback]` - OAuth callback handling
- `[Token Refresh]` - Token refresh operations
- `[Get Access Token]` - Token retrieval and validation
- `[Google Photos Frontend API]` - API calls to Google Photos

