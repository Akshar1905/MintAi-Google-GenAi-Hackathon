import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from '../ui/Button';
import { generateImageCaption } from '../../utils/gemini';
import { 
  hasGooglePhotosAccess, 
  requestGooglePhotosAccess, 
  fetchRandomPhoto,
  imageUrlToBase64 
} from '../../utils/googlePhotos';
// Backend API integration (preferred method to avoid 403 errors)
import {
  initiateGooglePhotosOAuth,
  checkGooglePhotosConnection,
  fetchRandomPhotosFromBackend,
  refreshGooglePhotosToken
} from '../../utils/googlePhotosApi';
import { useAuth } from '../../context/AuthContext';

const PhotoCaptionWidget = ({ onCaptionGenerated }) => {
  const { currentUser } = useAuth();
  const [googlePhoto, setGooglePhoto] = useState(null);
  const [caption, setCaption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use backend API only if explicitly enabled (defaults to false for now)
  // Set VITE_USE_BACKEND_API=true in .env to enable backend API
  const USE_BACKEND_API = import.meta.env.VITE_USE_BACKEND_API === 'true';
  
  // Log which API mode we're using
  useEffect(() => {
    console.log('[PhotoCaptionWidget] API Mode:', USE_BACKEND_API ? 'Backend API' : 'Frontend API');
    if (USE_BACKEND_API) {
      console.log('[PhotoCaptionWidget] Backend URL:', import.meta.env.VITE_API_BASE_URL || 'https://mintai8430back.builtwithrocket.new');
    }
  }, [USE_BACKEND_API]);
  
  // Check connection status on mount and when user changes
  useEffect(() => {
    checkConnectionStatus();
  }, [currentUser]);

  // Auto-load a photo when connected
  useEffect(() => {
    if (isConnected && !googlePhoto && !loadingPhoto && currentUser) {
      loadRandomPhoto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, currentUser]);

  const checkConnectionStatus = async () => {
    if (!currentUser) {
      setIsConnected(false);
      return;
    }
    
    const userEmail = currentUser.email || currentUser.uid;
    
    // Try backend API first if enabled, fallback to frontend
    if (USE_BACKEND_API) {
      try {
        const connected = await checkGooglePhotosConnection(userEmail);
        setIsConnected(connected);
        
        if (connected) {
          loadRandomPhoto();
        }
      } catch (err) {
        // Backend unavailable, fallback to frontend API
        console.warn('[PhotoCaptionWidget] Backend unavailable, using frontend API:', err.message);
        const hasAccess = await hasGooglePhotosAccess(userEmail);
        setIsConnected(hasAccess);
        
        if (hasAccess) {
          loadRandomPhoto();
        }
      }
    } else {
      // Use frontend localStorage check
      console.log('[PhotoCaptionWidget] Using frontend API to check connection');
      const hasAccess = await hasGooglePhotosAccess(userEmail);
      setIsConnected(hasAccess);
      
      if (hasAccess) {
        console.log('[PhotoCaptionWidget] User has Google Photos connected, loading photo...');
        loadRandomPhoto();
      } else {
        console.log('[PhotoCaptionWidget] User not connected to Google Photos');
      }
    }
  };

  const handleConnectGooglePhotos = async () => {
    if (!currentUser) {
      setError('Please sign in to connect Google Photos.');
      return;
    }

    try {
      const userEmail = currentUser.email || currentUser.uid;
      console.log('[PhotoCaptionWidget] Connecting Google Photos for user:', userEmail);
      console.log('[PhotoCaptionWidget] Using backend API:', USE_BACKEND_API);
      
      if (USE_BACKEND_API) {
        try {
          // Use backend OAuth flow (recommended - avoids 403 errors)
          const authUrl = await initiateGooglePhotosOAuth(userEmail);
          console.log('[PhotoCaptionWidget] Redirecting to OAuth URL from backend');
          window.location.href = authUrl;
        } catch (backendError) {
          // Backend unavailable, fallback to frontend OAuth
          console.warn('[PhotoCaptionWidget] Backend unavailable, using frontend OAuth:', backendError.message);
          setError('Backend unavailable. Using frontend OAuth...');
          
          const { getRedirectUri } = await import('../../config/googleConfig');
          const redirectUri = getRedirectUri();
          console.log('[PhotoCaptionWidget] Frontend OAuth - Redirect URI:', redirectUri);
          console.log('[PhotoCaptionWidget] Make sure this exact URI is in Google Cloud Console!');
          
          await requestGooglePhotosAccess(userEmail);
        }
      } else {
        // Use frontend OAuth (default for now)
        const { getRedirectUri } = await import('../../config/googleConfig');
        const redirectUri = getRedirectUri();
        console.log('[PhotoCaptionWidget] Frontend OAuth - Redirect URI:', redirectUri);
        console.log('[PhotoCaptionWidget] Make sure this exact URI is in Google Cloud Console!');
        
        await requestGooglePhotosAccess(userEmail);
      }
    } catch (err) {
      console.error('[PhotoCaptionWidget] Error requesting Google Photos access:', err);
      setError(`Failed to connect Google Photos: ${err.message}. Please try again.`);
    }
  };

  const loadRandomPhoto = async () => {
    if (!currentUser) return;
    
    setLoadingPhoto(true);
    setError(null);
    
    try {
      const userEmail = currentUser.email || currentUser.uid;
      let photo = null;
      
      if (USE_BACKEND_API) {
        try {
          // Use backend API to fetch photos (recommended - handles 403 properly)
          console.log('[PhotoCaptionWidget] Fetching photos through backend API');
          const photos = await fetchRandomPhotosFromBackend(userEmail, 50);
          
          if (photos.length === 0) {
            setError('No photos found in your Google Photos library.');
            setLoadingPhoto(false);
            return;
          }
          
          // Select random photo from results
          const randomIndex = Math.floor(Math.random() * photos.length);
          photo = photos[randomIndex];
          console.log('[PhotoCaptionWidget] Photo fetched via backend:', photo.id);
        } catch (backendError) {
          // Backend unavailable, fallback to frontend
          console.warn('[PhotoCaptionWidget] Backend unavailable, using frontend API:', backendError.message);
          console.log('[PhotoCaptionWidget] Fetching photos via frontend API (fallback)');
          photo = await fetchRandomPhoto(userEmail);
          
          if (!photo) {
            setError('No photos found in your Google Photos library.');
            setLoadingPhoto(false);
            return;
          }
        }
      } else {
        // Use frontend API call (default for now)
        console.log('[PhotoCaptionWidget] Fetching photos via frontend API');
        photo = await fetchRandomPhoto(userEmail);
        
        if (!photo) {
          setError('No photos found in your Google Photos library.');
          setLoadingPhoto(false);
          return;
        }
      }
      
      if (photo) {
        setGooglePhoto(photo);
        setCaption(null); // Reset caption for new photo
        // Auto-generate caption for the new photo
        generateCaptionForPhoto(photo);
      }
    } catch (err) {
      console.error('[PhotoCaptionWidget] Error loading photo:', err);
      
      // Handle specific error types
      if (err.message.includes('403') || err.message.includes('Forbidden') || err.message.includes('insufficient')) {
        console.error('[PhotoCaptionWidget] 403 Error - Clearing tokens and forcing reauthorization');
        setError('Google Photos API access denied due to insufficient authentication scopes.\n\nThe token is missing the required photoslibrary.readonly scope.\n\nSolution: Please click "Connect Google Photos" again and make sure to grant "See and download your photos" permission.');
        setIsConnected(false);
        
        // Clear invalid token so user can reconnect with correct scope
        if (currentUser) {
          const userEmail = currentUser.email || currentUser.uid;
          const keys = {
            token: `mintai.googlePhotos.${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}.accessToken`,
            refreshToken: `mintai.googlePhotos.${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}.refreshToken`,
            expiresAt: `mintai.googlePhotos.${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}.tokenExpiresAt`,
          };
          localStorage.removeItem(keys.token);
          localStorage.removeItem(keys.refreshToken);
          localStorage.removeItem(keys.expiresAt);
          console.log('[PhotoCaptionWidget] Cleared all tokens for user:', userEmail);
        }
      } else if (err.message.includes('missing required scope') || err.message.includes('Token missing') || err.message.includes('scope')) {
        console.error('[PhotoCaptionWidget] Scope missing error - Forcing reauthorization');
        setError('Token is missing the required Google Photos permission (photoslibrary.readonly).\n\nPlease reconnect Google Photos and ensure you grant "See and download your photos" access.');
        setIsConnected(false);
        
        // Clear tokens to force reauthorization
        if (currentUser) {
          const userEmail = currentUser.email || currentUser.uid;
          const keys = {
            token: `mintai.googlePhotos.${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}.accessToken`,
            refreshToken: `mintai.googlePhotos.${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}.refreshToken`,
            expiresAt: `mintai.googlePhotos.${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}.tokenExpiresAt`,
          };
          localStorage.removeItem(keys.token);
          localStorage.removeItem(keys.refreshToken);
          localStorage.removeItem(keys.expiresAt);
        }
      } else if (err.message.includes('expired') || err.message.includes('401') || err.message.includes('Unauthorized')) {
        // Try to refresh token if using backend
        if (USE_BACKEND_API) {
          console.log('[PhotoCaptionWidget] Attempting to refresh token...');
          const userEmail = currentUser.email || currentUser.uid;
          const refreshed = await refreshGooglePhotosToken(userEmail);
          if (refreshed) {
            // Retry loading photo after refresh
            setTimeout(() => loadRandomPhoto(), 1000);
            return;
          }
        }
        setError('Token expired. Please reconnect your Google Photos account.');
        setIsConnected(false);
      } else {
        setError(err.message || 'Failed to load photo from Google Photos.');
      }
    } finally {
      setLoadingPhoto(false);
    }
  };

  const generateCaptionForPhoto = async (photo) => {
    if (!photo) return;

    setLoading(true);
    setError(null);

    try {
      // Convert image URL to base64 for Gemini Vision API
      const base64 = await imageUrlToBase64(photo.imageUrl);
      
      // Generate caption using Gemini Vision
      const generatedCaption = await generateImageCaption(base64, photo.mimeType || 'image/jpeg');
      
      setCaption(generatedCaption);

      // Notify parent component
      if (onCaptionGenerated) {
        onCaptionGenerated({
          imageUrl: photo.imageUrl,
          thumbnailUrl: photo.thumbnailUrl,
          caption: generatedCaption,
          timestamp: new Date(),
        });
      }
    } catch (err) {
      console.error('Error generating caption:', err);
      setError('Failed to generate caption. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setGooglePhoto(null);
    setCaption(null);
    loadRandomPhoto();
  };

  if (!isConnected) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6">
        <div className="text-center">
          <Icon name="Image" size={64} className="text-primary mx-auto mb-4" />
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
            Google Photos + Auto Caption
          </h3>
          <p className="text-sm font-body text-muted-foreground mb-6 max-w-md">
            Connect your Google Photos to automatically display your photos with AI-generated emotionally intelligent captions
          </p>
        </div>

        <Button
          variant="default"
          onClick={handleConnectGooglePhotos}
          className="px-6 py-3"
        >
          <span className="flex items-center space-x-2">
            <Icon name="LogIn" size={20} />
            <span>Connect Google Photos</span>
          </span>
        </Button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-error bg-error/10 px-4 py-2 rounded-lg max-w-md text-center"
          >
            {error}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6">
      <div className="text-center mb-2">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
          Your Google Photo
        </h3>
        <p className="text-xs font-caption text-muted-foreground">
          AI-generated caption
        </p>
      </div>

      {loadingPhoto ? (
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin">
            <Icon name="Loader2" size={32} className="text-primary" />
          </div>
          <p className="text-sm font-body text-muted-foreground">
            Loading photo from Google Photos...
          </p>
          <p className="text-xs font-caption text-muted-foreground">
            {USE_BACKEND_API ? 'Using backend API' : 'Using frontend API'}
          </p>
        </div>
      ) : googlePhoto ? (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-lg overflow-hidden shadow-neumorphic-md"
          >
            <Image
              src={googlePhoto.thumbnailUrl || googlePhoto.imageUrl}
              alt={googlePhoto.filename || 'Google Photo'}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              {loading ? (
                <div className="flex items-center space-x-2 text-white">
                  <div className="inline-block animate-spin">
                    <Icon name="Loader2" size={16} className="text-white" />
                  </div>
                  <span className="text-xs font-caption">Generating caption...</span>
                </div>
              ) : caption ? (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-body text-white leading-relaxed whitespace-pre-line"
                >
                  {caption}
                </motion.p>
              ) : null}
            </div>
          </motion.div>

          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              iconName="Share2"
              iconPosition="left"
              onClick={() => {
                if (navigator.share && caption) {
                  navigator.share({
                    title: 'MintAi Caption',
                    text: caption,
                  });
                }
              }}
              disabled={!caption}
            >
              Share
            </Button>
            <Button
              variant="ghost"
              iconName="RefreshCw"
              onClick={handleRefresh}
              disabled={loadingPhoto}
            >
              New Photo
            </Button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-error bg-error/10 px-4 py-3 rounded-lg text-center max-w-md space-y-3"
            >
              <p className="font-medium whitespace-pre-line">{error}</p>
              {(error.includes('403') || error.includes('scope') || error.includes('missing')) && (
                <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted rounded space-y-2">
                  <p className="font-semibold text-foreground mb-2">How to Fix:</p>
                  <ol className="list-decimal list-inside text-left space-y-1">
                    <li>Click "Connect Google Photos" button again</li>
                    <li>When Google asks for permission, make sure to check <strong>"See and download your photos"</strong></li>
                    <li>Grant access when prompted</li>
                    <li>Verify Google Photos Library API is enabled in Google Cloud Console</li>
                    <li>Check that the scope is added to your OAuth consent screen</li>
                  </ol>
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    Note: If you previously connected without granting photo access, you need to reconnect.
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Check browser console (F12) for detailed logs
              </p>
            </motion.div>
          )}
        </>
      ) : (
        <div className="text-center space-y-4">
          <Icon name="Image" size={48} className="text-muted-foreground mx-auto" />
          <p className="text-sm font-body text-muted-foreground">
            No photos available
          </p>
          <Button
            variant="default"
            onClick={loadRandomPhoto}
            disabled={loadingPhoto}
          >
            Load Photo
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhotoCaptionWidget;

