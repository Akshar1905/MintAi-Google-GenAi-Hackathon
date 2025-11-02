import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, onAvatarUpdate, onNameUpdate }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || user?.name);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e?.target?.files?.[0];
      if (file) {
        setIsUploading(true);
        // Mock upload delay
        setTimeout(() => {
          const mockUrl = `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face`;
          onAvatarUpdate(mockUrl);
          setIsUploading(false);
        }, 1500);
      }
    };
    input?.click();
  };

  const handleNameSave = () => {
    onNameUpdate(displayName);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setDisplayName(user?.displayName || user?.name);
    setIsEditingName(false);
  };

  const createdAt = user?.createdAt ? new Date(user.createdAt?.seconds ? user.createdAt.seconds * 1000 : user.createdAt) : (user?.joinedDate ? new Date(user.joinedDate) : null);
  const memberSinceStr = createdAt ? createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';
  const userInitial = (user?.email || user?.displayName || user?.name || 'U')?.charAt(0)?.toUpperCase();
  const hasPhoto = Boolean(user?.photoURL || user?.avatar);

  return (
    <div className="bg-card rounded-2xl p-8 shadow-neumorphic-md border border-border">
      <div className="flex flex-col items-center text-center">
        {/* Avatar Section */}
        <div className="relative mb-6">
          <div 
            className="w-24 h-24 rounded-full overflow-hidden shadow-neumorphic-lg cursor-pointer group transition-spring hover:scale-105 flex items-center justify-center bg-gradient-to-br from-secondary to-accent"
            onClick={handleAvatarClick}
          >
            {hasPhoto ? (
              <Image
                src={user?.photoURL || user?.avatar}
                alt={`${user?.name || user?.displayName}'s profile picture`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-3xl font-heading">{userInitial}</span>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Icon name="Loader2" size={20} className="text-white animate-spin" />
              </div>
            )}
          </div>
          
          <button
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-neumorphic-sm transition-spring hover:scale-110 active:scale-95 disabled:opacity-50"
          >
            <Icon 
              name={isUploading ? "Loader2" : "Camera"} 
              size={14} 
              className={`text-primary-foreground ${isUploading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
        
        {/* Display Name Section */}
        <div className="w-full max-w-xs">
          {isEditingName ? (
            <div className="space-y-3">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e?.target?.value)}
                className="w-full px-4 py-2 text-lg font-heading font-semibold text-center bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
                onKeyDown={(e) => {
                  if (e?.key === 'Enter') handleNameSave();
                  if (e?.key === 'Escape') handleNameCancel();
                }}
              />
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNameCancel}
                  iconName="X"
                  iconSize={14}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNameSave}
                  iconName="Check"
                  iconSize={14}
                  disabled={!displayName?.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 group">
              <h1 className="text-xl font-heading font-semibold text-foreground">
                {user?.displayName || user?.name}
              </h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-muted transition-spring"
              >
                <Icon name="Edit2" size={16} className="text-muted-foreground" />
              </button>
            </div>
          )}
          
          <p className="text-sm font-body text-muted-foreground mt-2">
            Member since {memberSinceStr}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-border w-full">
          <div className="text-center">
            <div className="text-lg font-heading font-semibold text-foreground">
              {user?.stats?.streakDays || 7}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Day Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-heading font-semibold text-foreground">
              {user?.stats?.totalSessions || 23}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Sessions
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-heading font-semibold text-foreground">
              {user?.stats?.savedQuotes || 12}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Saved Quotes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;