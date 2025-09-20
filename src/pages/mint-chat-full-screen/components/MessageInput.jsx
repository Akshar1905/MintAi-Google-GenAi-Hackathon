import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);
  const maxLength = 1000;

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef?.current?.scrollHeight;
      const maxHeight = 120; // Max 5 lines approximately
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
      setIsExpanded(scrollHeight > 44); // Single line height
    }
  }, [message]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled && onSendMessage) {
      onSendMessage(message?.trim());
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    const value = e?.target?.value;
    if (value?.length <= maxLength) {
      setMessage(value);
    }
  };

  const remainingChars = maxLength - message?.length;
  const isNearLimit = remainingChars <= 50;

  return (
    <div className="sticky bottom-0 bg-background border-t border-border p-4 pb-safe">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Shift + Enter for new line)"
              disabled={disabled}
              className={`w-full px-4 py-3 pr-16 bg-input border border-border rounded-2xl resize-none transition-spring focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                isExpanded ? 'rounded-2xl' : 'rounded-full'
              }`}
              style={{
                minHeight: '44px',
                maxHeight: '120px'
              }}
            />
            
            {/* Character count */}
            {(message?.length > 0 || isNearLimit) && (
              <div className={`absolute bottom-2 right-14 text-xs font-caption transition-spring ${
                isNearLimit ? 'text-warning' : 'text-muted-foreground'
              }`}>
                {remainingChars}
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            size="icon"
            disabled={!message?.trim() || disabled}
            className="h-11 w-11 rounded-full shadow-neumorphic-sm transition-spring hover:scale-105 active:scale-95"
          >
            <Icon name="Send" size={18} />
          </Button>
        </form>
        
        {/* Input hints */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs font-caption text-muted-foreground">
            Press Enter to send, Shift + Enter for new line
          </p>
          {disabled && (
            <div className="flex items-center space-x-1 text-xs font-caption text-muted-foreground">
              <Icon name="Clock" size={12} />
              <span>AI is typing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;