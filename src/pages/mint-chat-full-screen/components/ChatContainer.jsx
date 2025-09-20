import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatContainer = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const shouldShowTimestamp = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentTime = new Date(currentMessage.timestamp);
    const previousTime = new Date(previousMessage.timestamp);
    const timeDiff = currentTime - previousTime;
    
    // Show timestamp if more than 5 minutes apart
    return timeDiff > 5 * 60 * 1000;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate?.getTime() === today?.getTime()) {
      return date?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else if (messageDate?.getTime() === today?.getTime() - 24 * 60 * 60 * 1000) {
      return `Yesterday ${date?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}`;
    } else {
      return date?.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-background to-muted/20"
      style={{ 
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-96 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-neumorphic-md mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 2L2 7L12 12L22 7L12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                />
                <path 
                  d="M2 17L12 22L22 17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                />
                <path 
                  d="M2 12L12 17L22 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                />
              </svg>
            </div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
              Welcome to MintChat
            </h2>
            <p className="text-muted-foreground font-body max-w-md">
              I'm here to support your mental wellness journey. Share what's on your mind or choose from the quick options below.
            </p>
          </div>
        ) : (
          <>
            {messages?.map((message, index) => (
              <React.Fragment key={message?.id}>
                {shouldShowTimestamp(message, messages?.[index - 1]) && (
                  <div className="flex justify-center my-6">
                    <div className="bg-muted px-3 py-1 rounded-full">
                      <span className="text-xs font-caption text-muted-foreground">
                        {formatTimestamp(message?.timestamp)}
                      </span>
                    </div>
                  </div>
                )}
                <MessageBubble
                  message={message?.content}
                  isUser={message?.isUser}
                  timestamp={message?.timestamp}
                  status={message?.status}
                />
              </React.Fragment>
            ))}
            
            {isTyping && <TypingIndicator />}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;