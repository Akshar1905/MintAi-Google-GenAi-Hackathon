import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatTransition from '../../components/ui/ChatTransition';
import CommunityHeader from './components/CommunityHeader';
import CommunityStatistics from './components/CommunityStatistics';
import FeaturedPosts from './components/FeaturedPosts';
import SupportGroups from './components/SupportGroups';
import UpcomingEvents from './components/UpcomingEvents';
import PageFadeIn from '../../components/ui/PageFadeIn';

const CommunityView = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  // Mock user authentication check
  useEffect(() => {
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      communityLevel: 'Supporter',
      supportGiven: 47,
      postsShared: 12
    };
    setCurrentUser(mockUser);
  }, []);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-20 md:pb-6">
        <PageFadeIn>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Community Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <CommunityHeader currentUser={currentUser} />
          </motion.div>

          {/* Community Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <CommunityStatistics />
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="flex bg-card rounded-full p-1 shadow-neumorphic border border-border">
              {['posts', 'groups', 'events']?.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-accent text-white shadow-neumorphic-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'posts' && <FeaturedPosts />}
            {activeTab === 'groups' && <SupportGroups />}
            {activeTab === 'events' && <UpcomingEvents />}
          </motion.div>
        </div>
        </PageFadeIn>
      </main>
      {/* Chat Widget */}
      <ChatTransition onNavigate={handleNavigation} onClose={() => {}} />
    </div>
  );
};

export default CommunityView;