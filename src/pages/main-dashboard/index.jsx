import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatTransition from '../../components/ui/ChatTransition';
import WelcomeHeader from './components/WelcomeHeader';
import RotatingWidget from './components/RotatingWidget';
import QuickActionCards from './components/QuickActionCards';
import WellnessStats from './components/WellnessStats';
import MintChatWidget from '../../components/widgets/MintChatWidget';
import Icon from '../../components/AppIcon';

import MoodTrackingSection from '../mood-tracking';
import DailyTasksSection from '../daily-tasks';
import MeditationTimerSection from '../meditation-timer';
import BreathingExercisesSection from '../breathing-exercises';
import ProgressSection from '../progress-view';
import DailyJournalSection from '../daily-journal';
import CommunitySection from '../community-view/CommunitySection';
import InsightsSection from '../insights-view/InsightsSection';
import QuickActionsSection from '../quick-actions/QuickActionsSection';

const MainDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Unified chat state for Gemini and widget
  const [chatMessages, setChatMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mintai.chat.widget.messages')||'[]'); } catch { return []; }
  });
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // Handle Google Photos OAuth callback
  useEffect(() => {
    const googlePhotosConnected = searchParams.get('googlePhotosConnected');
    const googlePhotosError = searchParams.get('googlePhotosError');
    const errorMessage = searchParams.get('message');
    
    if (googlePhotosConnected === 'true') {
      // Show success message
      console.log('[Main Dashboard] Google Photos connected successfully!');
      // Clear the query param
      setSearchParams({}, { replace: true });
      // Small delay before reload to show success
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }
    
    if (googlePhotosError) {
      // Show error message with details
      console.error('[Main Dashboard] Google Photos connection error:', googlePhotosError);
      if (errorMessage) {
        console.error('[Main Dashboard] Error details:', decodeURIComponent(errorMessage));
      }
      
      // Common error messages
      const errorMessages = {
        'state_mismatch': 'OAuth session expired or invalid. Please try connecting again.',
        'access_denied': 'Access was denied. Please grant permission to continue.',
        'no_code': 'Authorization failed. Please try again.',
        'exchange_failed': 'Failed to complete authentication. Please try again.',
        'missing_scope': 'Token missing required scope. Please reconnect Google Photos and grant "See and download your photos" permission.',
      };
      
      const userMessage = errorMessages[googlePhotosError] || decodeURIComponent(errorMessage) || 'An error occurred. Please try again.';
      console.warn('[Main Dashboard] User-friendly error:', userMessage);
      
      // Clear the query param after a delay
      setTimeout(() => {
        setSearchParams({}, { replace: true });
      }, 3000);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([{ role: 'assistant', content: 'Hi! I\'m MintChat. How can I help you today?' }]);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('mintai.chat.widget.messages', JSON.stringify(chatMessages)); } catch {}
  }, [chatMessages]);

  const sendChatMessage = async (content) => {
    if (!content.trim()) return;
    setChatMessages((m) => [...m, { role: 'user', content }]);
    setChatInput('');
    setChatLoading(true);
    try {
      let reply = null;
      try {
        const { generateGeminiResponse } = await import('../../utils/gemini');
        reply = await generateGeminiResponse(content);
      } catch (_) {
        // ignore, will fallback
      }
      if (!reply) reply = mockReply(content);
      setChatMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setChatMessages((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  function mockReply(text) {
    if (/breath|stress/i.test(text)) return 'Try a 2-minute box breathing: 4 in, 4 hold, 4 out, 4 hold.';
    if (/task|todo/i.test(text)) return 'You can create a daily task in the Tasks page.';
    return "Here's a helpful tip: small consistent actions lead to big changes.";
  }
  
  const [isWidgetPaused, setIsWidgetPaused] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Mock user authentication check
  useEffect(() => {
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      streak: 7,
      mood: 'positive'
    };
    setCurrentUser(mockUser);
  }, []);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle widget pause/resume
  const handleWidgetPause = () => {
    setIsWidgetPaused(true);
  };

  const handleWidgetResume = () => {
    setIsWidgetPaused(false);
  };

  // Handle swipe gestures for mobile
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e?.touches?.[0]?.clientX;
      startY = e?.touches?.[0]?.clientY;
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY) return;

      const endX = e?.changedTouches?.[0]?.clientX;
      const endY = e?.changedTouches?.[0]?.clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only handle horizontal swipes that are more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        // Swipe gestures are handled by the RotatingWidget component
        // This is just for additional mobile optimization
      }

      startX = 0;
      startY = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <main className="flex-1 px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Widget at the top */}
          <div className="w-full flex justify-center">
            <RotatingWidget chatHistory={chatMessages} />
          </div>
          {/* MintChat Feature (Gemini) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-foreground">MintChat (Gemini)</h2>
              <button
                onClick={() => navigate('/mint-chat-full-screen')}
                className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
              >
                Open Full Chat
                <Icon name="ExternalLink" size={14} />
              </button>
            </div>
            <div className="bg-card rounded-xl shadow-neumorphic-md border border-border overflow-hidden">
              <MintChatWidget 
                onOpenFull={() => navigate('/mint-chat-full-screen')}
              />
            </div>
          </motion.div>
          {/* Mood Tracking */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Mood Tracking</h2>
            <div className="bg-card rounded-xl p-4 mb-4"><MoodTrackingSection /></div>
          </motion.div>
          {/* Daily Tasks */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Daily Tasks</h2>
            <div className="bg-card rounded-xl p-4 mb-4"><DailyTasksSection /></div>
          </motion.div>
          {/* Meditation Timer */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Mindful Meditation Timer</h2>
            <div className="bg-card rounded-xl p-4 mb-4"><MeditationTimerSection /></div>
          </motion.div>
          {/* Breathing Exercises */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Breathing Exercises</h2>
            <div className="bg-card rounded-xl p-4 mb-4"><BreathingExercisesSection /></div>
          </motion.div>
          {/* Progress & Badges */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Progress & Badges</h2>
            <div className="bg-card rounded-xl p-4 mb-4"><ProgressSection /></div>
          </motion.div>
          {/* Daily Journal */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Daily Journal</h2>
            <div className="bg-card rounded-xl p-4 mb-4"><DailyJournalSection /></div>
          </motion.div>
          {/* Wellness Community */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Wellness Community</h2>
            <div className="bg-card rounded-xl p-4 mb-4"><CommunitySection /></div>
          </motion.div>
          {/* AI Insights */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">AI Insights</h2>
            <div className="bg-card rounded-xl p-4 mb-4"><InsightsSection /></div>
          </motion.div>
          {/* Quick Wellness Actions */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Quick Wellness Actions</h2>
            <div className="bg-card rounded-xl p-4 mb-4"><QuickActionsSection /></div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;