import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const QuickWellnessBoosts = () => {
  const [activeBoost, setActiveBoost] = useState(null);

  const boosts = [
    {
      id: 'morning',
      title: 'Morning Mindfulness',
      subtitle: '5-minute breathing exercise',
      duration: '5 min',
      difficulty: 'Easy',
      icon: 'Sun',
      bgGradient: 'bg-gradient-to-br from-yellow-100 via-orange-50 to-amber-100',
      iconColor: 'text-orange-500',
      borderColor: 'border-orange-200',
      time: 'Perfect for starting your day'
    },
    {
      id: 'evening',
      title: 'Evening Reflection',
      subtitle: '10-minute journaling session',
      duration: '10 min',
      difficulty: 'Medium',
      icon: 'Moon',
      bgGradient: 'bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100',
      iconColor: 'text-indigo-500',
      borderColor: 'border-indigo-200',
      time: 'Wind down and reflect'
    },
    {
      id: 'midday',
      title: 'Midday Reset',
      subtitle: '15-minute walking break',
      duration: '15 min',
      difficulty: 'Light',
      icon: 'Zap',
      bgGradient: 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-200',
      time: 'Boost your energy'
    }
  ];

  const handleBoostActivation = (boostId) => {
    setActiveBoost(boostId);
    // Simulate activation
    setTimeout(() => {
      setActiveBoost(null);
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Quick Wellness Boosts
        </h2>
        <p className="text-sm font-body text-muted-foreground">
          One-tap activities to elevate your mood instantly
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {boosts?.map((boost, index) => (
          <motion.div
            key={boost?.id}
            className={`${boost?.bgGradient} rounded-2xl p-6 shadow-neumorphic border ${boost?.borderColor} backdrop-blur-sm relative overflow-hidden`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon 
                    name={boost?.icon} 
                    size={24} 
                    className={boost?.iconColor}
                  />
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium text-foreground bg-white/60 rounded-full px-2 py-1">
                    {boost?.duration}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {boost?.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  {boost?.title}
                </h3>
                
                <p className="text-sm font-body text-muted-foreground">
                  {boost?.subtitle}
                </p>
                
                <p className="text-xs font-caption text-foreground/70">
                  {boost?.time}
                </p>
              </div>

              <motion.button
                onClick={() => handleBoostActivation(boost?.id)}
                disabled={activeBoost === boost?.id}
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeBoost === boost?.id 
                    ? 'bg-white/60 text-muted-foreground cursor-not-allowed'
                    : 'bg-white/80 hover:bg-white text-foreground hover:shadow-md active:scale-98'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {activeBoost === boost?.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Starting...
                  </div>
                ) : (
                  'Start Now'
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickWellnessBoosts;