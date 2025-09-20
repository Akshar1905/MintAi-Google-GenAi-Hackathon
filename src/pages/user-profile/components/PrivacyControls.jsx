import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const PrivacyControls = ({ privacySettings, onUpdate, onDeleteAccount }) => {
  const [localSettings, setLocalSettings] = useState({
    profileVisibility: privacySettings?.profileVisibility ?? 'private',
    dataSharing: privacySettings?.dataSharing ?? false,
    analyticsTracking: privacySettings?.analyticsTracking ?? true,
    marketingEmails: privacySettings?.marketingEmails ?? false,
    researchParticipation: privacySettings?.researchParticipation ?? false,
    locationTracking: privacySettings?.locationTracking ?? false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Mock save delay
    setTimeout(() => {
      onUpdate(localSettings);
      setHasChanges(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    onDeleteAccount();
  };

  const privacyOptions = [
    {
      key: "dataSharing",
      label: "Share Data with Partners",
      description: "Allow sharing anonymized data with trusted wellness research partners",
      icon: "Share2",
      type: "checkbox"
    },
    {
      key: "analyticsTracking",
      label: "Analytics & Performance",
      description: "Help us improve MintAi by sharing usage analytics and performance data",
      icon: "BarChart3",
      type: "checkbox"
    },
    {
      key: "marketingEmails",
      label: "Marketing Communications",
      description: "Receive emails about new features, wellness tips, and platform updates",
      icon: "Mail",
      type: "checkbox"
    },
    {
      key: "researchParticipation",
      label: "Research Participation",
      description: "Participate in optional wellness research studies to advance mental health",
      icon: "Search",
      type: "checkbox"
    },
    {
      key: "locationTracking",
      label: "Location Services",
      description: "Enable location-based features like nearby wellness resources",
      icon: "MapPin",
      type: "checkbox"
    }
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Your profile is visible to all users' },
    { value: 'friends', label: 'Friends Only', description: 'Only your connections can see your profile' },
    { value: 'private', label: 'Private', description: 'Your profile is completely private' }
  ];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-neumorphic-md border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-warning" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Privacy & Security
          </h2>
          <p className="text-sm font-body text-muted-foreground">
            Control your data and privacy preferences
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-primary" />
            <h3 className="text-base font-heading font-medium text-foreground">
              Profile Visibility
            </h3>
          </div>
          
          <div className="space-y-2 pl-6">
            {visibilityOptions?.map((option) => (
              <label key={option?.value} className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="profileVisibility"
                  value={option?.value}
                  checked={localSettings?.profileVisibility === option?.value}
                  onChange={(e) => handleSettingChange('profileVisibility', e?.target?.value)}
                  className="mt-1 w-4 h-4 text-primary border-border focus:ring-ring"
                />
                <div className="flex-1">
                  <div className="text-sm font-body font-medium text-foreground group-hover:text-primary transition-spring">
                    {option?.label}
                  </div>
                  <div className="text-xs font-caption text-muted-foreground">
                    {option?.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Data & Privacy Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={16} className="text-primary" />
            <h3 className="text-base font-heading font-medium text-foreground">
              Data & Privacy
            </h3>
          </div>
          
          <div className="space-y-4 pl-6">
            {privacyOptions?.map((option) => (
              <div key={option?.key} className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5 bg-muted/30 rounded-md flex items-center justify-center">
                  <Icon name={option?.icon} size={12} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <Checkbox
                    label={option?.label}
                    description={option?.description}
                    checked={localSettings?.[option?.key]}
                    onChange={(e) => handleSettingChange(option?.key, e?.target?.checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Export & Deletion */}
        <div className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={16} className="text-primary" />
            <h3 className="text-base font-heading font-medium text-foreground">
              Data Management
            </h3>
          </div>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-body font-medium text-foreground">
                  Export Your Data
                </div>
                <div className="text-xs font-caption text-muted-foreground">
                  Download a copy of all your wellness data and preferences
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-body font-medium text-destructive">
                  Delete Account
                </div>
                <div className="text-xs font-caption text-muted-foreground">
                  Permanently delete your account and all associated data
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Save Actions */}
        {hasChanges && (
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => {
                setLocalSettings({
                  profileVisibility: privacySettings?.profileVisibility ?? 'private',
                  dataSharing: privacySettings?.dataSharing ?? false,
                  analyticsTracking: privacySettings?.analyticsTracking ?? true,
                  marketingEmails: privacySettings?.marketingEmails ?? false,
                  researchParticipation: privacySettings?.researchParticipation ?? false,
                  locationTracking: privacySettings?.locationTracking ?? false
                });
                setHasChanges(false);
              }}
              disabled={isSaving}
            >
              Reset
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-card rounded-2xl p-6 shadow-neumorphic-lg max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Delete Account
                </h3>
                <p className="text-sm font-body text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <p className="text-sm font-body text-foreground mb-6">
              Are you sure you want to permanently delete your account? All your wellness data, 
              preferences, and progress will be permanently removed from our servers.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyControls;