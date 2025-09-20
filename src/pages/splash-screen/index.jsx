import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './components/BrandLogo';
import LottieAnimation from './components/LottieAnimation';
import ProgressIndicator from './components/ProgressIndicator';
import TaglineText from './components/TaglineText';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check user authentication status from localStorage
  const checkAuthStatus = () => {
    const userData = localStorage.getItem('mintai_user');
    const authToken = localStorage.getItem('mintai_auth_token');
    return userData && authToken;
  };

  // Handle splash screen completion
  const handleLoadingComplete = () => {
    setIsInitialized(true);
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      const isAuthenticated = checkAuthStatus();
      
      if (isAuthenticated) {
        navigate('/main-dashboard', { replace: true });
      } else {
        navigate('/authentication', { replace: true });
      }
    }, 500);
  };

  // Prevent back navigation during splash
  useEffect(() => {
    const handlePopState = (event) => {
      event?.preventDefault();
      window.history?.pushState(null, '', window.location?.pathname);
    };

    window.history?.pushState(null, '', window.location?.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Auto-redirect after maximum time (fallback)
  useEffect(() => {
    const maxLoadTime = setTimeout(() => {
      if (!isInitialized) {
        handleLoadingComplete();
      }
    }, 8000); // 8 seconds maximum

    return () => clearTimeout(maxLoadTime);
  }, [isInitialized]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(167,235,214,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(167,235,214,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center space-y-8">
        {/* Brand Logo */}
        <BrandLogo className="animate-breathe" />
        
        {/* Lottie Animation */}
        <LottieAnimation className="transform transition-spring hover:scale-105" />
        
        {/* Progress Indicator */}
        <ProgressIndicator 
          onComplete={handleLoadingComplete}
          className="w-full"
        />
        
        {/* Tagline */}
        <TaglineText className="px-4" />
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 opacity-60">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-1 h-1 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Loading State Overlay */}
      {isInitialized && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-caption text-muted-foreground">
              Preparing your wellness experience...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;