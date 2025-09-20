import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const WellnessPreferences = ({ preferences, onUpdate }) => {
  const [localPreferences, setLocalPreferences] = useState({
    dailyReminders: preferences?.dailyReminders ?? true,
    moodTracking: preferences?.moodTracking ?? true,
    motivationalQuotes: preferences?.motivationalQuotes ?? true,
    musicRecommendations: preferences?.musicRecommendations ?? true,
    chatNotifications: preferences?.chatNotifications ?? false,
    weeklyReports: preferences?.weeklyReports ?? true,
    reminderTime: preferences?.reminderTime ?? '09:00',
    shareProgress: preferences?.shareProgress ?? false,
    anonymousData: preferences?.anonymousData ?? true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (key, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Mock save delay
    setTimeout(() => {
      onUpdate(localPreferences);
      setHasChanges(false);
      setIsSaving(false);
    }, 1000);
  };

  const handleReset = () => {
    setLocalPreferences({
      dailyReminders: preferences?.dailyReminders ?? true,
      moodTracking: preferences?.moodTracking ?? true,
      motivationalQuotes: preferences?.motivationalQuotes ?? true,
      musicRecommendations: preferences?.musicRecommendations ?? true,
      chatNotifications: preferences?.chatNotifications ?? false,
      weeklyReports: preferences?.weeklyReports ?? true,
      reminderTime: preferences?.reminderTime ?? '09:00',
      shareProgress: preferences?.shareProgress ?? false,
      anonymousData: preferences?.anonymousData ?? true
    });
    setHasChanges(false);
  };

  const preferenceGroups = [
    {
      title: "Daily Wellness",
      icon: "Heart",
      preferences: [
        {
          key: "dailyReminders",
          label: "Daily Wellness Reminders",
          description: "Get gentle reminders to check in with your mental health"
        },
        {
          key: "moodTracking",
          label: "Mood Tracking",
          description: "Enable daily mood check-ins and progress tracking"
        },
        {
          key: "motivationalQuotes",
          label: "Motivational Quotes",
          description: "Receive inspiring quotes throughout your day"
        }
      ]
    },
    {
      title: "Content & Features",
      icon: "Sparkles",
      preferences: [
        {
          key: "musicRecommendations",
          label: "Music Recommendations",
          description: "Get personalized music suggestions for relaxation and focus"
        },
        {
          key: "chatNotifications",
          label: "MintChat Notifications",
          description: "Receive notifications for chat responses and suggestions"
        },
        {
          key: "weeklyReports",
          label: "Weekly Progress Reports",
          description: "Get weekly summaries of your wellness journey"
        }
      ]
    },
    {
      title: "Privacy & Sharing",
      icon: "Shield",
      preferences: [
        {
          key: "shareProgress",
          label: "Share Progress",
          description: "Allow sharing your wellness milestones with the community"
        },
        {
          key: "anonymousData",
          label: "Anonymous Data Collection",
          description: "Help improve MintAi by sharing anonymous usage data"
        }
      ]
    }
  ];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-neumorphic-md border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground">
              Wellness Preferences
            </h2>
            <p className="text-sm font-body text-muted-foreground">
              Customize your mental wellness experience
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        {/* Reminder Time Setting */}
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Icon name="Clock" size={16} className="text-primary" />
            <div>
              <div className="text-sm font-body font-medium text-foreground">
                Daily Reminder Time
              </div>
              <div className="text-xs font-caption text-muted-foreground">
                Choose when you'd like to receive your daily wellness check-in
              </div>
            </div>
          </div>
          <input
            type="time"
            value={localPreferences?.reminderTime}
            onChange={(e) => handlePreferenceChange('reminderTime', e?.target?.value)}
            className="w-full max-w-xs px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm font-body"
          />
        </div>

        {/* Preference Groups */}
        {preferenceGroups?.map((group) => (
          <div key={group?.title} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon name={group?.icon} size={16} className="text-primary" />
              <h3 className="text-base font-heading font-medium text-foreground">
                {group?.title}
              </h3>
            </div>
            
            <div className="space-y-3 pl-6">
              {group?.preferences?.map((pref) => (
                <Checkbox
                  key={pref?.key}
                  label={pref?.label}
                  description={pref?.description}
                  checked={localPreferences?.[pref?.key]}
                  onChange={(e) => handlePreferenceChange(pref?.key, e?.target?.checked)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Save Actions */}
        {hasChanges && (
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center space-x-2 text-sm font-body text-muted-foreground">
              <Icon name="Info" size={16} />
              <span>You have unsaved changes</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={isSaving}
              >
                Reset
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                loading={isSaving}
                iconName="Save"
                iconPosition="left"
                iconSize={16}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessPreferences;