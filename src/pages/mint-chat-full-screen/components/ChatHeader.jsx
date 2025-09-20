import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatHeader = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/main-dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
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
            onClick={handleClose}
            className="hidden md:flex"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;