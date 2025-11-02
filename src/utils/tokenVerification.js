/**
 * Token Verification Utilities
 * Verifies OAuth tokens and their scopes
 */

/**
 * Verify Google access token and check if it has required scopes
 * @param {string} accessToken - Google access token
 * @param {string[]} requiredScopes - Array of required scope strings
 * @returns {Promise<{valid: boolean, hasScope: boolean, scopes: string[], error: string | null}>}
 */
export async function verifyTokenAndScope(accessToken, requiredScopes = []) {
  if (!accessToken) {
    return {
      valid: false,
      hasScope: false,
      scopes: [],
      error: 'No access token provided'
    };
  }

  try {
    // Call Google's tokeninfo endpoint to verify token
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        valid: false,
        hasScope: false,
        scopes: [],
        error: `Token verification failed: ${response.status} - ${errorText}`
      };
    }

    const tokenInfo = await response.json();
    
    // Check if token is valid
    if (tokenInfo.error) {
      return {
        valid: false,
        hasScope: false,
        scopes: tokenInfo.scope?.split(' ') || [],
        error: tokenInfo.error_description || tokenInfo.error
      };
    }

    // Extract scopes from token info
    const grantedScopes = tokenInfo.scope ? tokenInfo.scope.split(' ').filter(Boolean) : [];
    
    // Check if required scopes are present
    const hasRequiredScope = requiredScopes.length === 0 || 
      requiredScopes.every(required => grantedScopes.includes(required));
    
    const missingScopes = requiredScopes.filter(required => !grantedScopes.includes(required));
    
    return {
      valid: true,
      hasScope: hasRequiredScope,
      scopes: grantedScopes,
      missingScopes: missingScopes,
      error: hasRequiredScope ? null : `Missing scopes: ${missingScopes.join(', ')}`
    };
  } catch (error) {
    console.error('[Token Verification] Error verifying token:', error);
    return {
      valid: false,
      hasScope: false,
      scopes: [],
      error: error.message || 'Failed to verify token'
    };
  }
}

/**
 * Check if token has Google Photos scope
 * @param {string} accessToken - Google access token
 * @returns {Promise<boolean>} True if token has photoslibrary.readonly scope
 */
export async function hasPhotosScope(accessToken) {
  const requiredScope = 'https://www.googleapis.com/auth/photoslibrary.readonly';
  const verification = await verifyTokenAndScope(accessToken, [requiredScope]);
  
  console.log('[Token Verification] Photos scope check:', {
    hasScope: verification.hasScope,
    grantedScopes: verification.scopes,
    missingScopes: verification.missingScopes
  });
  
  return verification.hasScope;
}

