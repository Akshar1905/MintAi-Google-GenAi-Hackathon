import React, { useEffect, useState } from 'react';

const ProgressIndicator = ({ onComplete, className = '' }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const loadingStages = [
    { progress: 20, text: 'Loading wellness data...' },
    { progress: 40, text: 'Preparing your journey...' },
    { progress: 60, text: 'Setting up mindfulness tools...' },
    { progress: 80, text: 'Almost ready...' },
    { progress: 100, text: 'Welcome to MintAi!' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15 + 5, 100);
        
        // Update loading text based on progress
        const currentStage = loadingStages?.find(stage => newProgress >= stage?.progress - 10 && newProgress <= stage?.progress + 10);
        if (currentStage) {
          setLoadingText(currentStage?.text);
        }
        
        // Complete loading when reaching 100%
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 800);
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      {/* Progress Bar Container */}
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden shadow-neumorphic-sm">
        {/* Progress Fill */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 ease-out shadow-neumorphic-sm"
          style={{ width: `${progress}%` }}
        />
        
        {/* Shimmer Effect */}
        <div 
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
          style={{ 
            transform: `translateX(${progress * 3}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>
      
      {/* Progress Text and Percentage */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm font-body text-muted-foreground transition-all duration-300">
          {loadingText}
        </span>
        <span className="text-sm font-body font-medium text-foreground">
          {Math.round(progress)}%
        </span>
      </div>
      
      {/* Loading Dots Animation */}
      <div className="flex items-center justify-center mt-2 space-x-1">
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

export default ProgressIndicator;