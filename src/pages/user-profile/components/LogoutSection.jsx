import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LogoutSection = ({ onLogout }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Mock logout delay
    setTimeout(() => {
      // Clear any stored user data
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      
      if (onLogout) {
        onLogout();
      }
      
      navigate('/authentication');
      setIsLoggingOut(false);
      setShowConfirm(false);
    }, 1000);
  };

  return (
    <>
      <div className="bg-card rounded-2xl p-6 shadow-neumorphic-md border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
              <Icon name="LogOut" size={20} className="text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground">
                Sign Out
              </h2>
              <p className="text-sm font-body text-muted-foreground">
                End your current session and return to login
              </p>
            </div>
          </div>
          
          <Button
            variant="destructive"
            onClick={() => setShowConfirm(true)}
            iconName="LogOut"
            iconPosition="left"
            iconSize={16}
          >
            Sign Out
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm font-body text-muted-foreground">
              <p className="mb-2">
                When you sign out, your wellness data will remain safely stored and available 
                when you return.
              </p>
              <p>
                Your preferences, saved quotes, and progress tracking will be preserved 
                for your next session.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-card rounded-2xl p-6 shadow-neumorphic-lg max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="LogOut" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Sign Out Confirmation
                </h3>
                <p className="text-sm font-body text-muted-foreground">
                  Are you sure you want to sign out?
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm font-body text-muted-foreground">
                <Icon name="Check" size={16} className="text-success" />
                <span>Your wellness data will be saved</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-body text-muted-foreground">
                <Icon name="Check" size={16} className="text-success" />
                <span>Your preferences will be preserved</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-body text-muted-foreground">
                <Icon name="Check" size={16} className="text-success" />
                <span>You can sign back in anytime</span>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                loading={isLoggingOut}
                iconName="LogOut"
                iconPosition="left"
                iconSize={16}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutSection;