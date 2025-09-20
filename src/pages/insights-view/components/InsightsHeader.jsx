import React from 'react';
import { motion } from 'framer-motion';

const InsightsHeader = () => {
  return (
    <div className="text-center space-y-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-center"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-neumorphic-md">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-foreground">
            <path d="M3 3v18h18"/>
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
          </svg>
        </div>
      </motion.div>
      <div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2"
        >
          Wellness Insights
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-muted-foreground font-body max-w-2xl mx-auto"
        >
          Discover personalized patterns in your wellness journey through comprehensive data analysis and AI-powered recommendations
        </motion.p>
      </div>
      {/* Floating Background Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-breathe" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default InsightsHeader;