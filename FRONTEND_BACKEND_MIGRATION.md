# Frontend to Backend Migration Guide

## Current Implementation

The frontend now supports **both** frontend and backend API calls:

### Frontend API (Current - May have 403 errors)
- Direct calls to Google Photos API
- Tokens stored in localStorage
- May encounter CORS and 403 errors

### Backend API (Recommended - Solves 403 errors)
- All API calls go through Rocket backend
- Tokens stored securely on backend
- No CORS issues
- Better error handling

## How to Enable Backend API

### Option 1: Environment Variable (Recommended)
Create or update `.env` file:
```env
VITE_USE_BACKEND_API=true
VITE_API_BASE_URL=https://mintai8430back.builtwithrocket.new
```

### Option 2: Default Behavior
The code defaults to `USE_BACKEND_API = true` if `VITE_USE_BACKEND_API` is not explicitly set to `'false'`.

## Code Flow

### When Backend API is Enabled:

1. **Connect Google Photos**:
   ```
   Frontend → Backend /api/photos/connect → Returns OAuth URL
   ```

2. **OAuth Callback**:
   ```
   Google → Backend /api/photos/callback → Exchanges code for tokens
   ```

3. **Fetch Photos**:
   ```
   Frontend → Backend /api/photos/list → Backend calls Google API → Returns photos
   ```

4. **Token Refresh**:
   ```
   Frontend → Backend /api/photos/refresh-token → Backend refreshes token
   ```

### When Frontend API is Used (Fallback):

1. **Connect**: Direct OAuth flow from frontend
2. **Fetch Photos**: Direct API call (may get 403)
3. **Token Refresh**: Frontend refreshes token

## Debugging

### Check Which API is Being Used:
Open browser console and look for:
```
[PhotoCaptionWidget] Using backend API: true/false
```

### Check Backend API Status:
```javascript
// In browser console
console.log('Backend URL:', import.meta.env.VITE_API_BASE_URL || 'https://mintai8430back.builtwithrocket.new');
console.log('Use Backend:', import.meta.env.VITE_USE_BACKEND_API !== 'false');
```

### Test Backend Endpoint:
```bash
curl https://mintai8430back.builtwithrocket.new/api/photos/status?userId=test@example.com
```

## Migration Steps

1. ✅ Frontend code updated to support both APIs
2. ⏳ Implement backend endpoints (see BACKEND_INTEGRATION.md)
3. ⏳ Test backend endpoints
4. ⏳ Set `VITE_USE_BACKEND_API=true` in production
5. ⏳ Remove frontend API code (optional, for security)

