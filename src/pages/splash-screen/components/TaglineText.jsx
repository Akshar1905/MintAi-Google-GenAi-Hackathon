import React, { useEffect, useState } from 'react';

const TaglineText = ({ className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  const fullText = 'Your Mental Wellness Journey Starts Here';

  useEffect(() => {
    let currentIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (currentIndex <= fullText?.length) {
        setDisplayText(fullText?.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(typewriterInterval);
      }
    }, 80);

    return () => clearInterval(typewriterInterval);
  }, []);

  return (
    <div className={`text-center ${className}`}>
      {/* Main Tagline */}
      <h2 className="text-lg md:text-xl font-body font-medium text-foreground leading-relaxed">
        {displayText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse" />
        )}
      </h2>
      
      {/* Subtitle */}
      <p className="mt-2 text-sm font-caption text-muted-foreground max-w-xs mx-auto">
        Discover mindfulness, connect with your inner peace, and embrace wellness every day
      </p>
      
      {/* Decorative Elements */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-primary rounded-full" />
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-primary rounded-full" />
      </div>
    </div>
  );
};

export default TaglineText;