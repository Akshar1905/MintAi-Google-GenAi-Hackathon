// src/components/MainLayout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavigation from './ui/TopNavigation'; // Adjust path if needed
import BottomTabNavigation from './ui/BottomTabNavigation'; // Adjust path if needed
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // This function can now be used by both nav components
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* 1. The Top Navigation is always visible */}
      <TopNavigation currentUser={currentUser} onNavigate={handleNavigation} />

      {/* 2. The specific page content (e.g., MainDashboard, UserProfile)
             will be rendered here where <Outlet /> is placed. */}
      <main className="flex-1 px-4 py-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* 3. The Bottom Navigation is always visible */}
      <BottomTabNavigation onNavigate={handleNavigation} />
    </div>
  );
};

export default MainLayout;