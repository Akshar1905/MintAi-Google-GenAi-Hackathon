import React from 'react';
import Icon from '../../../components/AppIcon';

const MessageBubble = ({ message, isUser, timestamp, status }) => {
  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Bot" size={12} className="text-primary-foreground" />
            </div>
            <span className="text-xs font-caption text-muted-foreground">MintChat</span>
          </div>
        )}
        
        <div
          className={`px-4 py-3 rounded-2xl shadow-neumorphic-sm transition-spring hover:shadow-neumorphic ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-card text-card-foreground rounded-bl-md'
          }`}
        >
          <p className="text-sm font-body leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>
        
        <div className={`flex items-center space-x-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs font-caption text-muted-foreground">
            {formatTime(timestamp)}
          </span>
          {isUser && status && (
            <div className="flex items-center">
              {status === 'sent' && (
                <Icon name="Check" size={12} className="text-muted-foreground" />
              )}
              {status === 'delivered' && (
                <div className="flex">
                  <Icon name="Check" size={12} className="text-muted-foreground -mr-1" />
                  <Icon name="Check" size={12} className="text-muted-foreground" />
                </div>
              )}
              {status === 'read' && (
                <div className="flex">
                  <Icon name="Check" size={12} className="text-primary -mr-1" />
                  <Icon name="Check" size={12} className="text-primary" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;