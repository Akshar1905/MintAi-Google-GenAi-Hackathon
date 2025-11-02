import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { useNavigate } from 'react-router-dom';
import ChatTransition from '../../components/ui/ChatTransition';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoSection from './components/PersonalInfoSection';
import WellnessPreferences from './components/WellnessPreferences';
import PrivacyControls from './components/PrivacyControls';
import LogoutSection from './components/LogoutSection';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.js';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData({ uid: currentUser.uid, email: currentUser.email, photoURL: currentUser.photoURL, displayName: currentUser.displayName, ...userDoc.data() });
        } else {
          setUserData({ uid: currentUser.uid, email: currentUser.email, photoURL: currentUser.photoURL, displayName: currentUser.displayName });
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  const handleAvatarUpdate = (newAvatarUrl) => {
    setUserData(prev => ({
      ...prev,
      photoURL: newAvatarUrl
    }));
  };

  const handleNameUpdate = (newName) => {
    setUserData(prev => ({
      ...prev,
      displayName: newName
    }));
  };

  const handlePersonalInfoUpdate = (updatedInfo) => {
    setUserData(prev => ({
      ...prev,
      ...updatedInfo
    }));
  };

  const handlePreferencesUpdate = (updatedPreferences) => {
    setUserData(prev => ({
      ...prev,
      preferences: updatedPreferences
    }));
  };

  const handlePrivacyUpdate = (updatedPrivacy) => {
    setUserData(prev => ({
      ...prev,
      privacySettings: updatedPrivacy
    }));
  };

  const handleDeleteAccount = async () => {
    // For now sign the user out and route to login. Account deletion can be added later.
    try {
      await signOut(auth);
    } catch {}
    navigate('/login', { replace: true });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
    navigate('/login', { replace: true });
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

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
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
            user={userData}
            onAvatarUpdate={handleAvatarUpdate}
            onNameUpdate={handleNameUpdate}
          />

          {/* Personal Information */}
          <PersonalInfoSection
            user={userData}
            onUpdate={handlePersonalInfoUpdate}
          />

          {/* Wellness Preferences */}
          <WellnessPreferences
            preferences={userData?.preferences}
            onUpdate={handlePreferencesUpdate}
          />

          {/* Privacy Controls */}
          <PrivacyControls
            privacySettings={userData?.privacySettings}
            onUpdate={handlePrivacyUpdate}
            onDeleteAccount={handleDeleteAccount}
          />

          {/* Logout Section */}
          <LogoutSection
            onLogout={handleLogout}
          />
        </div>
      </main>
      {/* Chat Widget */}
      <ChatTransition onNavigate={handleNavigation} onClose={() => {}} />
    </div>
  );
};

export default UserProfile;