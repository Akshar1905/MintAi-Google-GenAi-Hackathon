import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ChatTransition = ({ 
  isOpen = false, 
  onClose, 
  onNavigate, 
  preserveDashboardState = true,
  className = '' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenChat = () => {
    if (preserveDashboardState) {
      // Store current dashboard state in sessionStorage
      sessionStorage.setItem('dashboardState', JSON.stringify({
        timestamp: Date.now(),
        returnPath: location?.pathname
      }));
    }
    
    navigate('/mint-chat-full-screen');
    if (onNavigate) {
      onNavigate('/mint-chat-full-screen');
    }
  };

  const handleCloseChat = () => {
    if (preserveDashboardState) {
      const savedState = sessionStorage.getItem('dashboardState');
      if (savedState) {
        const { returnPath } = JSON.parse(savedState);
        navigate(returnPath || '/main-dashboard');
      } else {
        navigate('/main-dashboard');
      }
    } else {
      navigate('/main-dashboard');
    }
    
    if (onClose) {
      onClose();
    }
    if (onNavigate) {
      onNavigate('/main-dashboard');
    }
  };

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event?.key === 'Escape' && location?.pathname === '/mint-chat-full-screen') {
        handleCloseChat();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [location?.pathname]);

  // Chat Widget Trigger (for dashboard integration)
  const ChatWidget = ({ onClick }) => (
    <div 
      className="fixed bottom-20 md:bottom-6 right-6 z-200 cursor-pointer group"
      onClick={onClick || handleOpenChat}
    >
      <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-neumorphic-lg transition-spring hover:scale-110 active:scale-95 animate-breathe group-hover:animate-none">
        <Icon 
          name="MessageCircle" 
          size={24} 
          className="text-accent-foreground"
        />
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-popover text-popover-foreground text-sm font-caption rounded-lg shadow-neumorphic-sm opacity-0 group-hover:opacity-100 transition-spring whitespace-nowrap">
        Start MintChat
      </div>
    </div>
  );

  // Chat Header (for full-screen chat)
  const ChatHeader = ({ onBack }) => (
    <header className="sticky top-0 z-100 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack || handleCloseChat}
            className="md:hidden"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-neumorphic-sm">
              <Icon 
                name="Bot" 
                size={16} 
                className="text-primary-foreground"
              />
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold text-foreground">
                MintChat
              </h1>
              <p className="text-xs font-caption text-muted-foreground">
                Your wellness companion
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack || handleCloseChat}
            className="hidden md:flex"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );

  // Desktop Modal Overlay (for desktop chat experience)
  const DesktopChatModal = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-300 hidden md:flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-4xl h-full max-h-[80vh] bg-background rounded-lg shadow-neumorphic-lg overflow-hidden">
          {children}
        </div>
      </div>
    );
  };

  // Return appropriate component based on usage context
  if (location?.pathname === '/mint-chat-full-screen') {
    return <ChatHeader onBack={handleCloseChat} className={className} />;
  }

  // For desktop modal usage
  if (isOpen) {
    return (
      <DesktopChatModal isVisible={isOpen} onClose={onClose}>
        <ChatHeader onBack={onClose} />
        <div className="flex-1 p-6">
          {/* Chat content would go here */}
          <div className="text-center text-muted-foreground">
            Chat interface content
          </div>
        </div>
      </DesktopChatModal>
    );
  }

  // Default: Return chat widget trigger
  return <ChatWidget onClick={handleOpenChat} className={className} />;
};

export default ChatTransition;