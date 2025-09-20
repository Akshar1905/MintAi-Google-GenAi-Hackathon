import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = ({ className = '' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // Mock user data
  const user = {
    name: 'Alex',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    streak: 7,
    mood: 'positive'
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Set greeting based on time
  useEffect(() => {
    const hour = currentTime?.getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, [currentTime]);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😔';
      default: return '😊';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-card rounded-2xl p-6 shadow-neumorphic border border-border">
        <div className="flex items-center justify-between">
          {/* Welcome Section */}
          <div className="flex items-center space-x-4">
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-neumorphic-sm">
                <img
                  src={user?.avatar}
                  alt={`${user?.name}'s avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              {user?.streak > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-neumorphic-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <Icon name="Flame" size={12} className="text-accent-foreground" />
                </motion.div>
              )}
            </motion.div>

            <div>
              <motion.h1
                className="text-2xl font-heading font-bold text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {greeting}, {user?.name}!
              </motion.h1>
              <motion.p
                className="text-sm font-body text-muted-foreground mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Ready for another day of wellness? {getMoodEmoji(user?.mood)}
              </motion.p>
            </div>
          </div>

          {/* Time and Date Section */}
          <div className="text-right hidden md:block">
            <motion.div
              className="text-2xl font-heading font-bold text-foreground"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {formatTime(currentTime)}
            </motion.div>
            <motion.div
              className="text-sm font-body text-muted-foreground mt-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {formatDate(currentTime)}
            </motion.div>
          </div>
        </div>

        {/* Streak Information */}
        {user?.streak > 0 && (
          <motion.div
            className="mt-4 pt-4 border-t border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Flame" size={16} className="text-accent" />
              <span className="text-sm font-body text-foreground">
                <span className="font-semibold">{user?.streak} day streak</span> — Keep it going!
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WelcomeHeader;