import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForToken } from '../../../utils/googlePhotos';

/**
 * OAuth callback page for Google Photos integration
 * This page handles the redirect after Google OAuth authorization
 * 
 * State Management:
 * - State is stored in localStorage with user-specific keys
 * - State format: "randomState|userId" (if user is logged in)
 * - We extract userId from state to use the correct storage keys
 */
const GooglePhotosCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        setIsProcessing(true);
        setErrorMessage(null);

        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Handle OAuth errors from Google
        if (error) {
          console.error('[OAuth Callback] OAuth error from Google:', error);
          navigate('/main-dashboard?googlePhotosError=access_denied');
          return;
        }

        // Verify we have a code
        if (!code) {
          console.error('[OAuth Callback] No authorization code received');
          navigate('/main-dashboard?googlePhotosError=no_code');
          return;
        }

        // Parse state to extract userId if present
        // State format: "randomState" or "randomState|userId"
        let userId = null;
        let stateValue = state;
        
        if (state && state.includes('|')) {
          const parts = state.split('|');
          stateValue = parts[0]; // The random state value
          userId = parts[1]; // The user ID
        }

        // Verify state - check all possible storage locations
        let storedState = null;
        let stateKey = null;
        
        if (userId) {
          // User-specific state storage
          const userKey = userId.replace(/[^a-zA-Z0-9]/g, '_');
          stateKey = `mintai.googlePhotos.${userKey}.oauthState`;
          storedState = localStorage.getItem(stateKey);
          
          // Also check if stored state includes userId
          if (storedState && storedState.includes('|')) {
            const storedParts = storedState.split('|');
            storedState = storedParts[0]; // Use just the state part for comparison
          }
        } else {
          // Fallback to general state storage
          stateKey = 'mintai.googlePhotos.oauthState';
          storedState = localStorage.getItem(stateKey);
        }

        // Verify state matches
        if (!storedState || stateValue !== storedState) {
          console.error('[OAuth Callback] State mismatch');
          console.log('[OAuth Callback] Received state:', stateValue);
          console.log('[OAuth Callback] Stored state:', storedState);
          console.log('[OAuth Callback] State key used:', stateKey);
          
          // Clear the mismatched state
          if (stateKey) {
            localStorage.removeItem(stateKey);
          }
          
          navigate('/main-dashboard?googlePhotosError=state_mismatch&message=Session expired. Please try connecting again.');
          return;
        }

        console.log('[OAuth Callback] State verified successfully');
        console.log('[OAuth Callback] User ID from state:', userId);

        // Exchange code for token
        // Note: In production, this should be done server-side to protect client secret
        try {
          const result = await exchangeCodeForToken(code, state);
          console.log('[OAuth Callback] Token exchange result:', {
            hasToken: !!result.token,
            hasRefreshToken: !!result.refreshToken,
            userId: result.userId,
          });
          
          // Verify token has the correct scope
          console.log('[OAuth Callback] Verifying token scope...');
          const { verifyTokenAndScope } = await import('../../../utils/tokenVerification');
          const requiredScope = 'https://www.googleapis.com/auth/photoslibrary.readonly';
          const verification = await verifyTokenAndScope(result.token, [requiredScope]);
          
          if (!verification.hasScope) {
            console.error('[OAuth Callback] Token missing required scope!');
            console.error('[OAuth Callback] Granted scopes:', verification.scopes);
            console.error('[OAuth Callback] Missing scopes:', verification.missingScopes);
            
            // Clear invalid token
            if (userId) {
              const keys = {
                token: `mintai.googlePhotos.${userId.replace(/[^a-zA-Z0-9]/g, '_')}.accessToken`,
                refreshToken: `mintai.googlePhotos.${userId.replace(/[^a-zA-Z0-9]/g, '_')}.refreshToken`,
              };
              localStorage.removeItem(keys.token);
              localStorage.removeItem(keys.refreshToken);
            }
            
            navigate(`/main-dashboard?googlePhotosError=missing_scope&message=${encodeURIComponent('Token missing required scope. Please reconnect and grant "See and download your photos" permission.')}`);
            return;
          }
          
          console.log('[OAuth Callback] Token verified - has correct scope:', requiredScope);
          console.log('[OAuth Callback] All granted scopes:', verification.scopes);
          
          // Clear OAuth state after successful exchange
          if (stateKey) {
            localStorage.removeItem(stateKey);
          }
          
          console.log('[OAuth Callback] Token exchange successful');
          
          // Redirect back to dashboard with success
          navigate('/main-dashboard?googlePhotosConnected=true');
        } catch (tokenError) {
          console.error('[OAuth Callback] Token exchange error:', tokenError);
          
          // Clear state on error
          if (stateKey) {
            localStorage.removeItem(stateKey);
          }
          
          navigate(`/main-dashboard?googlePhotosError=exchange_failed&message=${encodeURIComponent(tokenError.message)}`);
        }
      } catch (err) {
        console.error('[OAuth Callback] Unexpected error:', err);
        setErrorMessage(err.message || 'An unexpected error occurred');
        navigate(`/main-dashboard?googlePhotosError=unexpected&message=${encodeURIComponent(err.message)}`);
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <p className="text-sm font-body text-muted-foreground">
          Connecting Google Photos...
        </p>
      </div>
    </div>
  );
};

export default GooglePhotosCallback;

