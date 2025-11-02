/**
 * Google Photos API integration
 * Note: Requires Google Photos Library API to be enabled in Google Cloud Console
 * and proper OAuth 2.0 setup with photoslibrary.readonly scope
 */

import { GOOGLE_OAUTH_CONFIG, GOOGLE_APIS, getGoogleAuthUrl, getRedirectUri } from '../config/googleConfig';

/**
 * Get user-specific storage key for Google Photos tokens
 * @param {string} userId - User ID or email
 * @returns {Object} Storage key names
 */
function getStorageKeys(userId) {
  if (!userId) {
    return {
      token: 'mintai.googlePhotos.accessToken',
      refreshToken: 'mintai.googlePhotos.refreshToken',
      expiresAt: 'mintai.googlePhotos.tokenExpiresAt',
      oauthState: 'mintai.googlePhotos.oauthState',
    };
  }
  
  const userKey = userId.replace(/[^a-zA-Z0-9]/g, '_');
  return {
    token: `mintai.googlePhotos.${userKey}.accessToken`,
    refreshToken: `mintai.googlePhotos.${userKey}.refreshToken`,
    expiresAt: `mintai.googlePhotos.${userKey}.tokenExpiresAt`,
    oauthState: `mintai.googlePhotos.${userKey}.oauthState`,
    userId: `mintai.googlePhotos.${userKey}.userId`,
  };
}

/**
 * Check if user has granted Google Photos access
 * @param {string} userId - Optional user ID/email to check for specific user
 * @returns {Promise<boolean>} True if access is granted
 */
export async function hasGooglePhotosAccess(userId = null) {
  try {
    const keys = getStorageKeys(userId);
    const token = localStorage.getItem(keys.token);
    const storedUserId = localStorage.getItem(keys.userId);
    
    // If checking for specific user, verify the userId matches
    if (userId && storedUserId !== userId) {
      return false;
    }
    
    return !!token;
  } catch {
    return false;
  }
}

/**
 * Request Google Photos OAuth access
 * @param {string} userId - User ID or email to associate with this connection
 * @returns {Promise<void>}
 * 
 * State Management:
 * - Generates a cryptographically random state value
 * - Stores it in localStorage with user-specific key
 * - Includes userId in state parameter for callback verification
 * - Format: "randomState|userId" (if userId provided) or just "randomState"
 */
export async function requestGooglePhotosAccess(userId = null) {
  const scope = GOOGLE_OAUTH_CONFIG.scopes.photos;
  
  // Generate cryptographically secure random state
  // Using a combination of random strings for better entropy
  const randomPart1 = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  const state = `${randomPart1}_${randomPart2}_${timestamp}`;
  
  const keys = getStorageKeys(userId);
  
  // Store state with userId for later verification
  // Format: "randomState|userId" so we can extract both on callback
  if (userId) {
    const stateWithUserId = `${state}|${userId}`;
    localStorage.setItem(keys.oauthState, stateWithUserId);
    localStorage.setItem(keys.userId, userId);
    
    // Log for debugging
    console.log('[Google Photos OAuth] Storing state with userId:', {
      state: state,
      userId: userId,
      storageKey: keys.oauthState,
      stateValue: stateWithUserId
    });
  } else {
    localStorage.setItem(keys.oauthState, state);
    console.log('[Google Photos OAuth] Storing state (no userId):', {
      state: state,
      storageKey: keys.oauthState
    });
  }
  
  // Get redirect URI - must match Google Cloud Console exactly
  const redirectUri = getRedirectUri();
  
  // Build OAuth URL with state parameter
  // CRITICAL: Verify scope includes photoslibrary.readonly
  if (!scope.includes('photoslibrary.readonly')) {
    console.error('[Google Photos OAuth] ERROR: Scope does not include photoslibrary.readonly!');
    console.error('[Google Photos OAuth] Current scope:', scope);
    throw new Error('OAuth scope configuration error. photoslibrary.readonly scope is missing.');
  }
  
  const authUrl = new URL(GOOGLE_OAUTH_CONFIG.authUri);
  authUrl.searchParams.set('client_id', GOOGLE_OAUTH_CONFIG.clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  
  // CRITICAL: Ensure correct scope is included
  authUrl.searchParams.set('scope', scope); // https://www.googleapis.com/auth/photoslibrary.readonly
  authUrl.searchParams.set('access_type', 'offline'); // Required for refresh token
  authUrl.searchParams.set('prompt', 'consent'); // Force consent screen to ensure scope is granted
  
  // Include userId in state parameter for callback
  const stateParam = userId ? `${state}|${userId}` : state;
  authUrl.searchParams.set('state', stateParam);
  
  // Verify all required parameters are set
  const requiredParams = {
    scope: authUrl.searchParams.get('scope'),
    access_type: authUrl.searchParams.get('access_type'),
    prompt: authUrl.searchParams.get('prompt'),
    client_id: authUrl.searchParams.get('client_id'),
    response_type: authUrl.searchParams.get('response_type'),
  };
  
  console.log('[Google Photos OAuth] Initiating OAuth flow:', {
    redirectUri: redirectUri,
    scope: scope,
    stateParam: stateParam,
    userId: userId || 'none'
  });
  console.log('[Google Photos OAuth] OAuth URL Parameters:', requiredParams);
  console.log('[Google Photos OAuth] Full OAuth URL:', authUrl.toString());
  
  // Verify scope is correct before redirecting
  if (requiredParams.scope !== scope || !scope.includes('photoslibrary.readonly')) {
    console.error('[Google Photos OAuth] ERROR: Scope mismatch or missing photoslibrary.readonly!');
    console.error('[Google Photos OAuth] Expected scope:', scope);
    console.error('[Google Photos OAuth] Actual scope in URL:', requiredParams.scope);
    throw new Error('OAuth scope configuration error. photoslibrary.readonly scope is missing.');
  }
  
  // Redirect to Google OAuth
  window.location.href = authUrl.toString();
}

/**
 * Exchange OAuth code for access token
 * @param {string} code - OAuth authorization code
 * @param {string} state - State parameter containing user ID
 * @returns {Promise<{token: string, userId: string}>} Access token and user ID
 */
export async function exchangeCodeForToken(code, state = null) {
  // Note: In production, this should be done server-side to protect client secret
  // Extract userId from state if present (format: "state|userId")
  let userId = null;
  if (state && state.includes('|')) {
    const parts = state.split('|');
    userId = parts[1] || null;
  }
  
  // Get redirect URI - must match exactly what's in Google Cloud Console
  const redirectUri = getRedirectUri();
  
  // Log for debugging - shows exactly what URI needs to be in Google Cloud Console
  console.log('[OAuth Token Exchange] Redirect URI:', redirectUri);
  console.log('[OAuth Token Exchange] State:', state);
  console.log('[OAuth Token Exchange] User ID:', userId);
  console.log('[OAuth Token Exchange] IMPORTANT: Add this exact URI to Google Cloud Console:', redirectUri);
  
  try {
    console.log('[OAuth Token Exchange] Exchanging code for token...');
    console.log('[OAuth Token Exchange] Request details:', {
      clientId: GOOGLE_OAUTH_CONFIG.clientId.substring(0, 20) + '...',
      redirectUri,
      grantType: 'authorization_code',
    });

    const response = await fetch(GOOGLE_APIS.oauth + '/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_OAUTH_CONFIG.clientId,
        client_secret: GOOGLE_OAUTH_CONFIG.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    console.log('[OAuth Token Exchange] Response status:', response.status);
    console.log('[OAuth Token Exchange] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[OAuth Token Exchange] Error response:', errorText);
      
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
        console.error('[OAuth Token Exchange] Parsed error JSON:', errorData);
      } catch (e) {
        console.error('[OAuth Token Exchange] Failed to parse error as JSON');
      }
      
      if (errorData.error === 'redirect_uri_mismatch') {
        throw new Error(`Redirect URI mismatch. Expected: ${redirectUri}. Please check Google Cloud Console settings.`);
      }
      if (errorData.error === 'invalid_grant') {
        throw new Error(`Invalid authorization code. This usually means the code has expired. Please try connecting again. Error: ${errorData.error_description || ''}`);
      }
      throw new Error(`Failed to exchange code for token: ${errorData.error || 'Unknown error'} - ${errorData.error_description || errorText}`);
    }

    const data = await response.json();
    
    // CRITICAL: Print FULL token response for debugging
    console.log('[OAuth Token Exchange] ========== FULL TOKEN RESPONSE ==========');
    console.log('[OAuth Token Exchange] Complete response JSON:', JSON.stringify(data, null, 2));
    console.log('[OAuth Token Exchange] Access token (first 30 chars):', data.access_token ? data.access_token.substring(0, 30) + '...' : 'MISSING');
    console.log('[OAuth Token Exchange] Refresh token (first 30 chars):', data.refresh_token ? data.refresh_token.substring(0, 30) + '...' : 'MISSING');
    console.log('[OAuth Token Exchange] Token type:', data.token_type || 'NOT PROVIDED');
    console.log('[OAuth Token Exchange] Expires in:', data.expires_in || 'NOT PROVIDED', 'seconds');
    console.log('[OAuth Token Exchange] Scope:', data.scope || 'NOT PROVIDED');
    console.log('[OAuth Token Exchange] ==========================================');
    
    // Verify we're using access_token, not id_token
    if (data.id_token && !data.access_token) {
      console.error('[OAuth Token Exchange] ERROR: Received id_token instead of access_token!');
      console.error('[OAuth Token Exchange] id_token:', data.id_token.substring(0, 30) + '...');
      throw new Error('Received id_token instead of access_token. OAuth configuration may be incorrect.');
    }
    
    // CRITICAL: Verify we received access_token (not id_token)
    if (!data.access_token) {
      console.error('[OAuth Token Exchange] ERROR: No access_token in response!');
      console.error('[OAuth Token Exchange] Response keys:', Object.keys(data));
      if (data.id_token) {
        console.error('[OAuth Token Exchange] WARNING: Response contains id_token instead of access_token!');
      }
      throw new Error('No access_token received from Google. Received: ' + Object.keys(data).join(', '));
    }
    
    console.log('[OAuth Token Exchange] ✓ Access token received (NOT id_token)');
    console.log('[OAuth Token Exchange] Token summary:', {
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      scope: data.scope,
    });
    
    const keys = getStorageKeys(userId);
    
    // Store access token
    localStorage.setItem(keys.token, data.access_token);
    console.log('[OAuth Token Exchange] Access token stored:', data.access_token.substring(0, 20) + '...');
    
    // CRITICAL: Store refresh token (required for token refresh)
    if (data.refresh_token) {
      localStorage.setItem(keys.refreshToken, data.refresh_token);
      console.log('[OAuth Token Exchange] Refresh token stored:', data.refresh_token.substring(0, 20) + '...');
    } else {
      console.warn('[OAuth Token Exchange] WARNING: No refresh token received! Token may expire without ability to refresh.');
      console.warn('[OAuth Token Exchange] This usually means access_type=offline was not set or user already granted access.');
      console.warn('[OAuth Token Exchange] User may need to revoke access and reconnect to get refresh token.');
    }
    
    // Store expiration time (usually 3600 seconds = 1 hour)
    if (data.expires_in) {
      const expiresAt = Date.now() + (data.expires_in * 1000);
      localStorage.setItem(keys.expiresAt, expiresAt.toString());
      console.log('[OAuth Token Exchange] Token expires at:', new Date(expiresAt).toISOString());
    }
    
    // Store userId if available
    if (userId) {
      localStorage.setItem(keys.userId, userId);
    }
    
    // CRITICAL: Verify scope is correct and force reauthorization if missing
    if (data.scope) {
      const grantedScopes = data.scope.split(' ').filter(Boolean);
      console.log('[OAuth Token Exchange] Granted scopes:', grantedScopes);
      console.log('[OAuth Token Exchange] Required scope: https://www.googleapis.com/auth/photoslibrary.readonly');
      
      const hasPhotosScope = grantedScopes.some(s => s.includes('photoslibrary.readonly'));
      
      if (!hasPhotosScope) {
        console.error('[OAuth Token Exchange] ========== SCOPE MISSING ==========');
        console.error('[OAuth Token Exchange] ERROR: Token does NOT include photoslibrary.readonly scope!');
        console.error('[OAuth Token Exchange] Granted scopes:', grantedScopes);
        console.error('[OAuth Token Exchange] Missing scope: https://www.googleapis.com/auth/photoslibrary.readonly');
        console.error('[OAuth Token Exchange] ====================================');
        
        // Clear tokens to force reauthorization
        const keys = getStorageKeys(userId);
        localStorage.removeItem(keys.token);
        localStorage.removeItem(keys.refreshToken);
        localStorage.removeItem(keys.expiresAt);
        console.error('[OAuth Token Exchange] Cleared stored tokens to force reauthorization');
        
        throw new Error('Token missing required scope (photoslibrary.readonly). Please reconnect and grant "See and download your photos" permission.');
      } else {
        console.log('[OAuth Token Exchange] ✓ Token includes photoslibrary.readonly scope');
        console.log('[OAuth Token Exchange] All required scopes granted successfully');
      }
    } else {
      console.warn('[OAuth Token Exchange] WARNING: No scope information in token response');
      console.warn('[OAuth Token Exchange] Cannot verify scope. Proceeding with caution.');
    }
    
    return { token: data.access_token, refreshToken: data.refresh_token, userId };
  } catch (error) {
    console.error('[OAuth Token Exchange] Error exchanging code for token:', error);
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 * @param {string} userId - User ID to refresh token for
 * @param {string} refreshToken - Refresh token (optional, will fetch from storage if not provided)
 * @returns {Promise<string>} New access token
 */
export async function refreshAccessToken(userId = null, refreshToken = null) {
  const keys = getStorageKeys(userId);
  const tokenToUse = refreshToken || localStorage.getItem(keys.refreshToken);
  
  if (!tokenToUse) {
    console.error('[Token Refresh] No refresh token available for user:', userId);
    throw new Error('No refresh token available. Please reconnect Google Photos.');
  }

  console.log('[Token Refresh] Refreshing access token...');
  console.log('[Token Refresh] Using refresh token:', tokenToUse.substring(0, 20) + '...');

  try {
    const response = await fetch(GOOGLE_APIS.oauth + '/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: tokenToUse,
        client_id: GOOGLE_OAUTH_CONFIG.clientId,
        client_secret: GOOGLE_OAUTH_CONFIG.clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    console.log('[Token Refresh] Response status:', response.status);
    console.log('[Token Refresh] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[Token Refresh] Error response:', errorText);
      
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
        console.error('[Token Refresh] Parsed error JSON:', errorData);
      } catch (e) {
        console.error('[Token Refresh] Failed to parse error as JSON');
      }
      
      if (errorData.error === 'invalid_grant') {
        console.error('[Token Refresh] Refresh token is invalid or expired. User needs to reconnect.');
        // Clear invalid tokens
        localStorage.removeItem(keys.token);
        localStorage.removeItem(keys.refreshToken);
        localStorage.removeItem(keys.expiresAt);
        throw new Error('Refresh token expired. Please reconnect Google Photos.');
      }
      
      throw new Error(`Failed to refresh token: ${errorData.error || 'Unknown error'} - ${errorData.error_description || errorText}`);
    }

    const data = await response.json();
    console.log('[Token Refresh] New token received:', {
      hasAccessToken: !!data.access_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      scope: data.scope,
    });
    
    if (!data.access_token) {
      throw new Error('No access token received from refresh');
    }
    
    // Store new access token
    localStorage.setItem(keys.token, data.access_token);
    console.log('[Token Refresh] New access token stored:', data.access_token.substring(0, 20) + '...');
    
    // Update expiration time
    if (data.expires_in) {
      const expiresAt = Date.now() + (data.expires_in * 1000);
      localStorage.setItem(keys.expiresAt, expiresAt.toString());
      console.log('[Token Refresh] New token expires at:', new Date(expiresAt).toISOString());
    }
    
    // Note: Refresh token typically remains the same, but if a new one is provided, store it
    if (data.refresh_token && data.refresh_token !== tokenToUse) {
      localStorage.setItem(keys.refreshToken, data.refresh_token);
      console.log('[Token Refresh] New refresh token received and stored');
    }
    
    return data.access_token;
  } catch (error) {
    console.error('[Token Refresh] Error refreshing token:', error);
    throw error;
  }
}

/**
 * Get valid access token (checks expiration and refreshes if needed)
 * @param {string} userId - User ID to get token for
 * @returns {Promise<string|null>} Access token or null if not available
 */
export async function getAccessToken(userId = null) {
  const keys = getStorageKeys(userId);
  const token = localStorage.getItem(keys.token);
  
  if (!token) {
    console.log('[Get Access Token] No token found for user:', userId);
    return null;
  }

  // Verify userId matches if checking for specific user
  if (userId) {
    const storedUserId = localStorage.getItem(keys.userId);
    if (storedUserId !== userId) {
      console.warn('[Get Access Token] User ID mismatch:', { storedUserId, requestedUserId: userId });
      return null;
    }
  }

  // Check if token is expired
  const expiresAt = localStorage.getItem(keys.expiresAt);
  if (expiresAt) {
    const expirationTime = parseInt(expiresAt, 10);
    const now = Date.now();
    const timeUntilExpiry = expirationTime - now;
    const fiveMinutes = 5 * 60 * 1000;
    
    console.log('[Get Access Token] Token expiry check:', {
      expiresAt: new Date(expirationTime).toISOString(),
      now: new Date(now).toISOString(),
      timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + ' seconds',
      needsRefresh: timeUntilExpiry < fiveMinutes,
    });
    
    // Refresh if token expires in less than 5 minutes or already expired
    if (timeUntilExpiry < fiveMinutes) {
      console.log('[Get Access Token] Token expired or expiring soon, refreshing...');
      try {
        const newToken = await refreshAccessToken(userId);
        console.log('[Get Access Token] Token refreshed successfully');
        return newToken;
      } catch (error) {
        console.error('[Get Access Token] Failed to refresh token:', error);
        // If refresh failed but token hasn't expired yet (just close to expiry), still use it
        if (timeUntilExpiry > 0) {
          console.warn('[Get Access Token] Using existing token despite refresh failure (not yet expired)');
          return token;
        }
        // Token is expired and refresh failed, return null
        console.error('[Get Access Token] Token expired and refresh failed');
        return null;
      }
    }
  } else {
    console.warn('[Get Access Token] No expiration time stored for token. Token may be expired.');
  }

  console.log('[Get Access Token] Returning valid token:', token.substring(0, 20) + '...');
  return token;
}

/**
 * Fetch random photos from user's Google Photos library
 * @param {string} userId - User ID to fetch photos for
 * @param {number} pageSize - Number of photos to fetch (max 100)
 * @returns {Promise<Array>} Array of photo objects
 */
/**
 * Fetch random photos from user's Google Photos library
 * 
 * ⚠️ NOTE: This frontend method may result in 403 errors due to CORS and scope issues.
 * For production, use the backend API: fetchRandomPhotosFromBackend()
 * 
 * @param {string} userId - User ID to fetch photos for
 * @param {number} pageSize - Number of photos to fetch (max 100)
 * @returns {Promise<Array>} Array of photo objects
 */
export async function fetchRandomPhotos(userId = null, pageSize = 50) {
  const accessToken = await getAccessToken(userId);
  if (!accessToken) {
    throw new Error('Google Photos access not granted. Please connect your Google Photos account.');
  }

  console.log('[Google Photos Frontend API] Fetching photos with token:', accessToken.substring(0, 20) + '...');
  console.log('[Google Photos Frontend API] Full token length:', accessToken.length);
  
  // Verify token has the correct scope before making API call
  const { hasPhotosScope } = await import('./tokenVerification');
  const hasScope = await hasPhotosScope(accessToken);
  
  if (!hasScope) {
    console.error('[Google Photos Frontend API] Token missing required scope: photoslibrary.readonly');
    console.error('[Google Photos Frontend API] Please reconnect Google Photos to grant the correct scope');
    
    // Clear invalid token
    if (userId) {
      const keys = getStorageKeys(userId);
      localStorage.removeItem(keys.token);
      localStorage.removeItem(keys.refreshToken);
    }
    
    throw new Error('Token missing required scope. Please reconnect Google Photos and ensure you grant access to "See and download your photos" permission.');
  }
  
  console.log('[Google Photos Frontend API] Token verified - has correct scope');

  try {
    // Prepare request
    const requestBody = {
      pageSize: Math.min(pageSize, 100),
      filters: {
        mediaTypeFilter: {
          mediaTypes: ['PHOTO'], // Only photos, not videos
        },
      },
    };
    
    console.log('[Google Photos Frontend API] Making request to:', `${GOOGLE_APIS.photos}/mediaItems:search`);
    console.log('[Google Photos Frontend API] Request body:', JSON.stringify(requestBody, null, 2));
    
    // CRITICAL: Verify we're using access_token (not id_token)
    console.log('[Google Photos Frontend API] Token verification:');
    console.log('  - Token type: access_token (NOT id_token)');
    console.log('  - Token length:', accessToken.length, 'characters');
    console.log('  - Token preview:', accessToken.substring(0, 30) + '...');
    console.log('  - Authorization header:', `Bearer ${accessToken.substring(0, 30)}...`);
    
    // Verify token format (access tokens typically start with specific patterns)
    // Note: Google access tokens are JWT-like but not standard JWTs
    if (accessToken.includes('.') && accessToken.split('.').length === 3) {
      console.warn('[Google Photos Frontend API] WARNING: Token appears to be a JWT (might be id_token instead of access_token)');
      console.warn('[Google Photos Frontend API] Decode first part:', accessToken.split('.')[0]);
    }
    
    // First, search for media items
    const searchResponse = await fetch(`${GOOGLE_APIS.photos}/mediaItems:search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // CRITICAL: Using access_token, NOT id_token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[Google Photos Frontend API] Response status:', searchResponse.status);
    console.log('[Google Photos Frontend API] Response status text:', searchResponse.statusText);
    console.log('[Google Photos Frontend API] Response headers:', Object.fromEntries(searchResponse.headers.entries()));

    if (!searchResponse.ok) {
      // Get full error response
      let errorText = '';
      let errorData = {};
      
      try {
        errorText = await searchResponse.text();
        console.error('[Google Photos Frontend API] Error response text:', errorText);
        
        // Try to parse as JSON
        try {
          errorData = JSON.parse(errorText);
          console.error('[Google Photos Frontend API] Parsed error JSON:', JSON.stringify(errorData, null, 2));
        } catch (e) {
          console.error('[Google Photos Frontend API] Error response is not JSON');
        }
      } catch (e) {
        console.error('[Google Photos Frontend API] Failed to read error response');
      }
      
      // Handle 403 - Usually means API not enabled or wrong scope (insufficient authentication scopes)
      if (searchResponse.status === 403) {
        console.error('[Google Photos Frontend API] ========== 403 FORBIDDEN ERROR ==========');
        console.error('[Google Photos Frontend API] HTTP Status:', searchResponse.status);
        console.error('[Google Photos Frontend API] Status Text:', searchResponse.statusText);
        console.error('[Google Photos Frontend API] Full Error Response:', JSON.stringify(errorData, null, 2));
        console.error('[Google Photos Frontend API] Error Text:', errorText);
        
        // Log all error fields
        console.error('[Google Photos Frontend API] Error Details:');
        console.error('  - error.message:', errorData.error?.message || errorData.message || 'N/A');
        console.error('  - error.code:', errorData.error?.code || errorData.code || 'N/A');
        console.error('  - error.status:', errorData.error?.status || errorData.status || 'N/A');
        console.error('  - error.reason:', errorData.error?.reason || errorData.reason || 'N/A');
        console.error('  - error.domain:', errorData.error?.domain || errorData.domain || 'N/A');
        console.error('  - error.details:', errorData.error?.details || errorData.details || 'N/A');
        
        // Check for "insufficient authentication scopes" error
        const errorMessage = errorData.error?.message || errorData.message || errorText || 'Unknown 403 error';
        const isScopeError = errorMessage.toLowerCase().includes('insufficient') || 
                            errorMessage.toLowerCase().includes('scope') ||
                            errorMessage.toLowerCase().includes('authentication');
        
        if (isScopeError) {
          console.error('[Google Photos Frontend API] ERROR TYPE: Insufficient authentication scopes');
          console.error('[Google Photos Frontend API] The access_token is missing the required photoslibrary.readonly scope');
          console.error('[Google Photos Frontend API] Clearing tokens and forcing reauthorization...');
          
          // Clear tokens to force reauthorization with correct scope
          if (userId) {
            const keys = getStorageKeys(userId);
            localStorage.removeItem(keys.token);
            localStorage.removeItem(keys.refreshToken);
            localStorage.removeItem(keys.expiresAt);
            console.error('[Google Photos Frontend API] Tokens cleared for user:', userId);
          }
          
          throw new Error(`403 Forbidden: Insufficient authentication scopes. The token is missing the photoslibrary.readonly scope. Please reconnect Google Photos and ensure you grant "See and download your photos" permission. Full error: ${errorMessage}`);
        }
        
        console.error('[Google Photos Frontend API] ==========================================');
        
        throw new Error(`403 Forbidden: ${errorMessage}. Ensure Google Photos Library API is enabled and photoslibrary.readonly scope is granted. Full error: ${JSON.stringify(errorData)}`);
      }
      
      // Handle 401 - Token expired or invalid
      if (searchResponse.status === 401) {
        console.error('[Google Photos Frontend API] 401 Unauthorized - Full error details:');
        console.error('[Google Photos Frontend API] Error JSON:', errorData);
        console.error('[Google Photos Frontend API] Attempting to refresh token...');
        
        // Try to refresh token
        try {
          const newToken = await refreshAccessToken(userId);
          console.log('[Google Photos Frontend API] Token refreshed, retrying request...');
          // Retry after refresh (recursive call)
          return fetchRandomPhotos(userId, pageSize);
        } catch (refreshError) {
          console.error('[Google Photos Frontend API] Token refresh failed:', refreshError);
          throw new Error(`Token expired and refresh failed: ${refreshError.message}. Please reconnect your Google Photos account.`);
        }
      }
      
      // Handle other errors
      const errorMessage = errorData.error?.message || errorData.message || errorText || 'Unknown error';
      console.error('[Google Photos Frontend API] HTTP error:', searchResponse.status);
      console.error('[Google Photos Frontend API] Error JSON:', errorData);
      throw new Error(`Failed to fetch photos (${searchResponse.status}): ${errorMessage}`);
    }

    const searchData = await searchResponse.json();
    console.log('[Google Photos Frontend API] Response data:', {
      hasMediaItems: !!searchData.mediaItems,
      mediaItemCount: searchData.mediaItems?.length || 0,
      nextPageToken: searchData.nextPageToken || 'none',
    });
    
    const mediaItems = searchData.mediaItems || [];

    if (mediaItems.length === 0) {
      return [];
    }

    // Shuffle and select random photos
    const shuffled = [...mediaItems].sort(() => 0.5 - Math.random());
    const selectedPhotos = shuffled.slice(0, Math.min(5, shuffled.length)); // Select up to 5 random photos

    // Fetch full details for selected photos
    const photoDetails = await Promise.all(
      selectedPhotos.map(async (item) => {
        // Get base URL and append parameters for different sizes
        const baseUrl = item.baseUrl;
        
        return {
          id: item.id,
          filename: item.filename,
          mimeType: item.mimeType,
          // Use the baseUrl with size parameters
          thumbnailUrl: `${baseUrl}=w400-h300-c`,
          imageUrl: `${baseUrl}=w800-h600-c`, // Medium size
          fullUrl: `${baseUrl}=w2048-h1536-c`, // Full size
          createdAt: item.mediaMetadata?.creationTime,
          width: item.mediaMetadata?.width,
          height: item.mediaMetadata?.height,
        };
      })
    );

    return photoDetails;
  } catch (error) {
    console.error('Error fetching Google Photos:', error);
    throw error;
  }
}

/**
 * Fetch a single random photo from Google Photos
 * @param {string} userId - User ID to fetch photo for
 * @returns {Promise<Object|null>} Photo object or null
 */
export async function fetchRandomPhoto(userId = null) {
  const photos = await fetchRandomPhotos(userId, 50);
  if (photos.length === 0) return null;
  
  // Return a random photo
  const randomIndex = Math.floor(Math.random() * photos.length);
  return photos[randomIndex];
}

/**
 * Convert Google Photos image URL to base64 for Gemini Vision API
 * @param {string} imageUrl - Google Photos image URL
 * @returns {Promise<string>} Base64 encoded image
 */
export async function imageUrlToBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

