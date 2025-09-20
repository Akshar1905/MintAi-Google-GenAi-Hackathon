import React from 'react';
import Icon from '../../../components/AppIcon';

const BrandLogo = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Logo Container */}
      <div className="flex items-center space-x-3 group">
        {/* Logo Icon */}
        <div className="relative">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-neumorphic-md transition-spring group-hover:scale-105">
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-primary-foreground"
            >
              <path 
                d="M12 2L2 7L12 12L22 7L12 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M2 17L12 22L22 17" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M2 12L12 17L22 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {/* Sparkle Effect */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping opacity-75" />
        </div>
        
        {/* Brand Name */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">
            MintAi
          </h1>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
      
      {/* Version Badge */}
      <div className="px-3 py-1 bg-muted rounded-full shadow-neumorphic-sm">
        <span className="text-xs font-caption text-muted-foreground">
          v1.0.0
        </span>
      </div>
    </div>
  );
};

export default BrandLogo;