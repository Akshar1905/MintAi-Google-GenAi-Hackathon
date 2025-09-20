import React from 'react';
import { motion } from 'framer-motion';


const WelcomeHeader = ({ isLogin = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-8"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-neumorphic-md">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-primary-foreground"
            />
            <path 
              d="M2 17L12 22L22 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-primary-foreground"
            />
            <path 
              d="M2 12L12 17L22 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-primary-foreground"
            />
          </svg>
        </div>
      </motion.div>
      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          {isLogin ? 'Welcome Back' : 'Join MintAi'}
        </h1>
        <p className="text-lg font-body text-muted-foreground max-w-md mx-auto leading-relaxed">
          {isLogin 
            ? 'Continue your wellness journey with personalized mental health support' :'Start your wellness journey with AI-powered mental health support designed for Gen-Z'
          }
        </p>
      </motion.div>
      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex justify-center items-center space-x-4 mt-6"
      >
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeHeader;