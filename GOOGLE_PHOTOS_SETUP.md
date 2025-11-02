# Google Photos Integration Setup Guide

This guide explains how to set up Google Photos integration for the Photo Caption Widget feature.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. A Google Cloud Project with the Photos Library API enabled
3. OAuth 2.0 credentials configured

## Step 1: Enable Google Photos Library API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **APIs & Services** > **Library**
4. Search for "Photos Library API"
5. Click **Enable**

## Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - User Type: External (or Internal for Google Workspace)
   - App name: MintAi
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `https://www.googleapis.com/auth/photoslibrary.readonly`
   - Save and continue
4. Back in Credentials, select **OAuth client ID**
5. Application type: **Web application**
6. Name: MintAi Web Client
7. Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://your-production-domain.com` (for production)
8. Authorized redirect URIs:
   - `http://localhost:5173/oauth/google-photos/callback` (for development)
   - `https://your-production-domain.com/oauth/google-photos/callback` (for production)
9. Click **Create**
10. Copy the **Client ID** (you'll need this)

## Step 3: Configure Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

**Note:** The client secret should NOT be stored in the frontend. For production, you should implement a server-side OAuth token exchange endpoint.

## Step 4: Update OAuth Callback Handler (For Production)

For production deployment, you should implement a server-side token exchange because:
1. Client secrets should never be exposed in frontend code
2. The OAuth token exchange should happen server-side

The current implementation in `src/utils/googlePhotos.js` includes a placeholder for server-side token exchange. You should:

1. Create a backend endpoint (e.g., `/api/oauth/google-photos/exchange`)
2. Update `exchangeCodeForToken` in `googlePhotos.js` to call your backend endpoint
3. Your backend should handle the token exchange using the client secret

Example backend endpoint (Node.js/Express):

```javascript
app.post('/api/oauth/google-photos/exchange', async (req, res) => {
  const { code } = req.body;
  
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Token exchange failed' });
  }
});
```

## Step 5: Usage

Once configured:

1. Users will see a "Connect Google Photos" button in the Photo Caption Widget
2. Clicking it will redirect to Google OAuth consent screen
3. Users grant permission to access their photos
4. They're redirected back to the app
5. The widget automatically loads a random photo from their Google Photos
6. Gemini Vision API generates an emotionally intelligent caption
7. Users can refresh to get a new random photo

## Troubleshooting

### "Token expired" error
- The access token may have expired
- Users need to reconnect their Google Photos account
- Implement token refresh logic for better UX

### "No photos found"
- The user's Google Photos library is empty
- Or the API didn't return any photos in the search

### OAuth errors
- Verify redirect URIs match exactly (including protocol and port)
- Check that the Client ID is correct
- Ensure Photos Library API is enabled

## Security Notes

1. **Never expose client secrets** in frontend code
2. **Use HTTPS** in production for OAuth redirects
3. **Validate state parameter** to prevent CSRF attacks (already implemented)
4. **Store tokens securely** (consider encrypted storage for production)
5. **Implement token refresh** logic for better user experience

## API Limits

- Google Photos Library API has quota limits
- Free tier: 10,000 requests per day per project
- Monitor usage in Google Cloud Console

## Support

For issues with Google Photos API, refer to:
- [Google Photos Library API Documentation](https://developers.google.com/photos/library/guides/overview)
- [OAuth 2.0 for Web Applications](https://developers.google.com/identity/protocols/oauth2/web-server)

