import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../../components/ui/TopNavigation';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import ChatTransition from '../../components/ui/ChatTransition';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoSection from './components/PersonalInfoSection';
import WellnessPreferences from './components/WellnessPreferences';
import PrivacyControls from './components/PrivacyControls';
import LogoutSection from './components/LogoutSection';

const UserProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const mockUser = {
    id: "user_001",
    name: "Sarah Chen",
    displayName: "Sarah Chen",
    email: "sarah.chen@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Wellness enthusiast on a journey to better mental health. Love music, nature, and mindful moments.",
    location: "San Francisco, CA",
    joinedDate: "2024-01-15T00:00:00Z",
    stats: {
      streakDays: 7,
      totalSessions: 23,
      savedQuotes: 12
    },
    preferences: {
      dailyReminders: true,
      moodTracking: true,
      motivationalQuotes: true,
      musicRecommendations: true,
      chatNotifications: false,
      weeklyReports: true,
      reminderTime: "09:00",
      shareProgress: false,
      anonymousData: true
    },
    privacySettings: {
      profileVisibility: "private",
      dataSharing: false,
      analyticsTracking: true,
      marketingEmails: false,
      researchParticipation: false,
      locationTracking: false
    }
  };

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setCurrentUser(mockUser);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAvatarUpdate = (newAvatarUrl) => {
    setCurrentUser(prev => ({
      ...prev,
      avatar: newAvatarUrl
    }));
  };

  const handleNameUpdate = (newName) => {
    setCurrentUser(prev => ({
      ...prev,
      displayName: newName
    }));
  };

  const handlePersonalInfoUpdate = (updatedInfo) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedInfo
    }));
  };

  const handlePreferencesUpdate = (updatedPreferences) => {
    setCurrentUser(prev => ({
      ...prev,
      preferences: updatedPreferences
    }));
  };

  const handlePrivacyUpdate = (updatedPrivacy) => {
    setCurrentUser(prev => ({
      ...prev,
      privacySettings: updatedPrivacy
    }));
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    navigate('/authentication');
  };

  const handleLogout = () => {
    // Handle logout
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    navigate('/authentication');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-body text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Top Navigation */}
      <TopNavigation 
        currentUser={currentUser}
        onNavigate={handleNavigation}
      />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              Your Profile
            </h1>
            <p className="text-base font-body text-muted-foreground">
              Manage your account and customize your wellness experience
            </p>
          </div>

          {/* Profile Header */}
          <ProfileHeader
            user={currentUser}
            onAvatarUpdate={handleAvatarUpdate}
            onNameUpdate={handleNameUpdate}
          />

          {/* Personal Information */}
          <PersonalInfoSection
            user={currentUser}
            onUpdate={handlePersonalInfoUpdate}
          />

          {/* Wellness Preferences */}
          <WellnessPreferences
            preferences={currentUser?.preferences}
            onUpdate={handlePreferencesUpdate}
          />

          {/* Privacy Controls */}
          <PrivacyControls
            privacySettings={currentUser?.privacySettings}
            onUpdate={handlePrivacyUpdate}
            onDeleteAccount={handleDeleteAccount}
          />

          {/* Logout Section */}
          <LogoutSection
            onLogout={handleLogout}
          />
        </div>
      </main>
      {/* Bottom Navigation */}
      <BottomTabNavigation onNavigate={handleNavigation} />
      {/* Chat Widget */}
      <ChatTransition onNavigate={handleNavigation} onClose={() => {}} />
    </div>
  );
};

export default UserProfile;