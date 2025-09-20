import React from 'react';
import Icon from '../../../components/AppIcon';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-xs">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bot" size={12} className="text-primary-foreground" />
          </div>
          <span className="text-xs font-caption text-muted-foreground">MintChat</span>
        </div>
        
        <div className="bg-card text-card-foreground px-4 py-3 rounded-2xl rounded-bl-md shadow-neumorphic-sm">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs font-caption text-muted-foreground ml-2">typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;