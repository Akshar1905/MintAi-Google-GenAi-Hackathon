import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNavigation from '../../components/ui/TopNavigation';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import ChatTransition from '../../components/ui/ChatTransition';
import WellnessHeader from './components/WellnessHeader';
import WellnessStatistics from './components/WellnessStatistics';
import QuickWellnessBoosts from './components/QuickWellnessBoosts';
import WellnessWidgetGrid from './components/WellnessWidgetGrid';

const WellnessView = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock user authentication check
  useEffect(() => {
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      wellnessScore: 82,
      moodScore: 8.2,
      meditationStreak: 12
    };
    setCurrentUser(mockUser);
  }, []);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {/* Top Navigation */}
      <TopNavigation
        currentUser={currentUser}
        onNavigate={handleNavigation}
      />
      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Wellness Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <WellnessHeader currentUser={currentUser} />
          </motion.div>

          {/* Wellness Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <WellnessStatistics />
          </motion.div>

          {/* Quick Wellness Boosts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuickWellnessBoosts />
          </motion.div>

          {/* Widget Categories & Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <WellnessWidgetGrid 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </motion.div>
        </div>
      </main>
      {/* Bottom Navigation for Mobile */}
      <BottomTabNavigation onNavigate={handleNavigation} />
      {/* Chat Widget */}
      <ChatTransition onNavigate={handleNavigation} onClose={() => {}} />
    </div>
  );
};

export default WellnessView;