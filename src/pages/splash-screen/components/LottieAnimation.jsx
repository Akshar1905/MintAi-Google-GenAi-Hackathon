import React, { useEffect, useRef, useState } from 'react';

const LottieAnimation = ({ className = '' }) => {
  const animationRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate Lottie animation loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Mock Lottie animation with CSS animations
  return (
    <div className={`relative w-48 h-48 mx-auto ${className}`} ref={animationRef}>
      {!isLoaded ? (
        // Loading skeleton
        <div className="w-full h-full bg-muted rounded-full animate-pulse shadow-neumorphic-sm" />
      ) : (
        // Mock animated wellness icon
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Outer ring with breathing animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-breathe shadow-neumorphic-md" />
          
          {/* Middle ring */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 animate-pulse" />
          
          {/* Inner wellness symbol */}
          <div className="relative z-10 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-neumorphic-lg">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-primary-foreground animate-pulse"
            >
              {/* Heart with leaf - wellness symbol */}
              <path 
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                fill="currentColor"
                className="animate-pulse"
              />
              {/* Leaf accent */}
              <path 
                d="M12 2C8 2 5 5 5 9c0 2 1 4 3 5l4-4 4 4c2-1 3-3 3-5 0-4-3-7-7-7z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                className="opacity-60"
              />
            </svg>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-8 left-8 w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-10 left-12 w-1 h-1 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-8 right-10 w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>
      )}
    </div>
  );
};

export default LottieAnimation;