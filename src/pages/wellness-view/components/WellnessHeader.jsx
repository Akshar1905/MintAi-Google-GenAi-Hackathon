import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WellnessHeader = ({ currentUser }) => {
  const getTimeGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-accent via-secondary to-primary rounded-full flex items-center justify-center shadow-neumorphic-md">
            <Icon name="Heart" size={32} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          {getTimeGreeting()}, {currentUser?.name?.split(' ')?.[0] || 'Friend'}! 
        </h1>
        
        <p className="text-muted-foreground font-body mb-6">
          Your wellness journey continues. How are you feeling today?
        </p>

        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-secondary/10 backdrop-blur-sm rounded-full px-6 py-3 border border-accent/20">
          <Icon name="Sparkles" size={20} className="text-accent" />
          <span className="text-sm font-medium text-foreground">
            Wellness Hub - Track, Grow, Thrive
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default WellnessHeader;