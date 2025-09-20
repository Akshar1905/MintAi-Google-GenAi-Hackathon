import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WellnessStats = ({ className = '' }) => {
  const stats = [
    {
      id: 'streak',
      label: 'Day Streak',
      value: '7',
      icon: 'Flame',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      change: '+2 from yesterday'
    },
    {
      id: 'mood',
      label: 'Mood Score',
      value: '8.2',
      icon: 'Heart',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      change: '+0.5 this week'
    },
    {
      id: 'activities',
      label: 'Activities',
      value: '12',
      icon: 'Activity',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      change: '3 completed today'
    },
    {
      id: 'mindfulness',
      label: 'Mindful Minutes',
      value: '45',
      icon: 'Brain',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      change: '15 min session'
    }
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <motion.div
            key={stat?.id}
            className="bg-card rounded-xl p-4 shadow-neumorphic border border-border"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon 
                  name={stat?.icon} 
                  size={20} 
                  className={stat?.color}
                />
              </div>
              <div className="text-right">
                <div className="text-2xl font-heading font-bold text-foreground">
                  {stat?.value}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-body font-medium text-foreground mb-1">
                {stat?.label}
              </h3>
              <p className="text-xs font-caption text-muted-foreground">
                {stat?.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WellnessStats;