/**
 * Google Photos API Service - Backend Integration
 * 
 * This service handles all Google Photos API calls through the backend
 * to avoid CORS issues, protect tokens, and ensure proper scope handling.
 * 
 * Backend Endpoints Required:
 * - POST /api/photos/connect - Initiate OAuth flow
 * - GET /api/photos/callback - Handle OAuth callback
 * - GET /api/photos/list - Fetch photos from user's library
 * - POST /api/photos/refresh-token - Refresh access token
 * - GET /api/photos/status - Check connection status
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mintai8430back.builtwithrocket.new';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // For local backend

/**
 * Initiate Google Photos OAuth flow through backend
 * @param {string} userId - User ID or email
 * @returns {Promise<string>} OAuth authorization URL
 */
export async function initiateGooglePhotosOAuth(userId) {
  console.log('[Google Photos API] Initiating OAuth through backend for user:', userId);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to initiate OAuth' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('[Google Photos API] OAuth URL received from backend:', data.authUrl);
    
    return data.authUrl;
  } catch (error) {
    console.error('[Google Photos API] Error initiating OAuth:', error);
    throw error;
  }
}

/**
 * Check if user has Google Photos connected
 * @param {string} userId - User ID or email
 * @returns {Promise<boolean>} True if connected
 */
export async function checkGooglePhotosConnection(userId) {
  console.log('[Google Photos API] Checking connection status for user:', userId);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/status?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      console.warn('[Google Photos API] Connection check failed:', response.status);
      throw new Error(`Backend unavailable (${response.status}). Falling back to frontend API.`);
    }

    const data = await response.json();
    console.log('[Google Photos API] Connection status:', data.connected);
    
    return data.connected === true;
  } catch (error) {
    // If backend is unavailable, throw error to trigger fallback
    console.warn('[Google Photos API] Backend not available, will use frontend API:', error.message);
    throw error;
  }
}

/**
 * Fetch random photos from user's Google Photos library via backend
 * @param {string} userId - User ID to fetch photos for
 * @param {number} pageSize - Number of photos to fetch (default: 50)
 * @returns {Promise<Array>} Array of photo objects
 */
export async function fetchRandomPhotosFromBackend(userId, pageSize = 50) {
  console.log('[Google Photos API] Fetching photos through backend:', { userId, pageSize });
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/list?userId=${encodeURIComponent(userId)}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    console.log('[Google Photos API] Response status:', response.status);

    if (!response.ok) {
      // Handle 403 specifically - usually means scope or API not enabled
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Google Photos API] 403 Forbidden:', errorData);
        throw new Error('Google Photos API access denied. Please ensure Google Photos Library API is enabled and correct scopes are granted.');
      }
      
      // Handle 401 - token expired, try refresh
      if (response.status === 401) {
        console.log('[Google Photos API] Token expired, attempting refresh...');
        const refreshed = await refreshGooglePhotosToken(userId);
        if (refreshed) {
          // Retry the request after refresh
          return fetchRandomPhotosFromBackend(userId, pageSize);
        }
        throw new Error('Token expired and refresh failed. Please reconnect Google Photos.');
      }

      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch photos' }));
      throw new Error(errorData.message || `Failed to fetch photos: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Google Photos API] Photos received:', data.photos?.length || 0);
    
    return data.photos || [];
  } catch (error) {
    console.error('[Google Photos API] Error fetching photos:', error);
    throw error;
  }
}

/**
 * Refresh Google Photos access token via backend
 * @param {string} userId - User ID to refresh token for
 * @returns {Promise<boolean>} True if refresh successful
 */
export async function refreshGooglePhotosToken(userId) {
  console.log('[Google Photos API] Refreshing token for user:', userId);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to refresh token' }));
      console.error('[Google Photos API] Token refresh failed:', error);
      return false;
    }

    const data = await response.json();
    console.log('[Google Photos API] Token refreshed successfully');
    
    return data.success === true;
  } catch (error) {
    console.error('[Google Photos API] Error refreshing token:', error);
    return false;
  }
}

/**
 * Disconnect Google Photos for a user
 * @param {string} userId - User ID to disconnect
 * @returns {Promise<boolean>} True if disconnection successful
 */
export async function disconnectGooglePhotos(userId) {
  console.log('[Google Photos API] Disconnecting Google Photos for user:', userId);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/photos/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      console.error('[Google Photos API] Disconnect failed:', response.status);
      return false;
    }

    console.log('[Google Photos API] Disconnected successfully');
    return true;
  } catch (error) {
    console.error('[Google Photos API] Error disconnecting:', error);
    return false;
  }
}

