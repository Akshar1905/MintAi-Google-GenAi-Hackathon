import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PersonalInfoSection = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    displayName: user?.displayName || user?.name || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.displayName?.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    // Mock save delay
    setTimeout(() => {
      onUpdate(formData);
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      email: user?.email || '',
      displayName: user?.displayName || user?.name || '',
      bio: user?.bio || '',
      location: user?.location || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-neumorphic-md border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground">
              Personal Information
            </h2>
            <p className="text-sm font-body text-muted-foreground">
              Manage your account details and profile information
            </p>
          </div>
        </div>
        
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            iconName="Edit2"
            iconPosition="left"
            iconSize={16}
          >
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {isEditing ? (
          <>
            <Input
              label="Email Address"
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
              placeholder="Enter your email address"
            />
            
            <Input
              label="Display Name"
              type="text"
              value={formData?.displayName}
              onChange={(e) => handleInputChange('displayName', e?.target?.value)}
              error={errors?.displayName}
              required
              placeholder="Enter your display name"
            />
            
            <Input
              label="Bio"
              type="text"
              value={formData?.bio}
              onChange={(e) => handleInputChange('bio', e?.target?.value)}
              placeholder="Tell us a bit about yourself (optional)"
              description="Share what motivates you on your wellness journey"
            />
            
            <Input
              label="Location"
              type="text"
              value={formData?.location}
              onChange={(e) => handleInputChange('location', e?.target?.value)}
              placeholder="City, Country (optional)"
              description="Help us provide location-relevant wellness resources"
            />
            
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
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
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={16} className="text-muted-foreground" />
                <div>
                  <div className="text-sm font-body font-medium text-foreground">
                    Email Address
                  </div>
                  <div className="text-sm font-body text-muted-foreground">
                    {user?.email || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center space-x-3">
                <Icon name="User" size={16} className="text-muted-foreground" />
                <div>
                  <div className="text-sm font-body font-medium text-foreground">
                    Display Name
                  </div>
                  <div className="text-sm font-body text-muted-foreground">
                    {user?.displayName || user?.name || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center space-x-3">
                <Icon name="FileText" size={16} className="text-muted-foreground" />
                <div>
                  <div className="text-sm font-body font-medium text-foreground">
                    Bio
                  </div>
                  <div className="text-sm font-body text-muted-foreground">
                    {user?.bio || 'No bio added yet'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <div>
                  <div className="text-sm font-body font-medium text-foreground">
                    Location
                  </div>
                  <div className="text-sm font-body text-muted-foreground">
                    {user?.location || 'Location not specified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;