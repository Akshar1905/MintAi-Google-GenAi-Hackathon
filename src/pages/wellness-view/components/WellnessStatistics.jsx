import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WellnessStatistics = () => {
  const stats = [
    {
      id: 'mood',
      label: 'Mood Score',
      value: '8.2',
      unit: '/10',
      change: '+0.3',
      changeLabel: 'this week',
      icon: 'Heart',
      color: 'text-pink-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-100',
      borderColor: 'border-pink-200',
      isPositive: true
    },
    {
      id: 'meditation',
      label: 'Meditation Streak',
      value: '12',
      unit: 'days',
      change: '+2',
      changeLabel: 'this week',
      icon: 'Brain',
      color: 'text-purple-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-indigo-100',
      borderColor: 'border-purple-200',
      isPositive: true
    },
    {
      id: 'wellness',
      label: 'Overall Wellness',
      value: '82',
      unit: '%',
      change: '+5%',
      changeLabel: 'monthly',
      icon: 'TrendingUp',
      color: 'text-green-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      borderColor: 'border-green-200',
      isPositive: true
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Your Wellness Overview
        </h2>
        <p className="text-sm font-body text-muted-foreground">
          Keep track of your mental wellness journey
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats?.map((stat, index) => (
          <motion.div
            key={stat?.id}
            className={`${stat?.bgColor} rounded-2xl p-6 shadow-neumorphic border ${stat?.borderColor} backdrop-blur-sm`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ 
              scale: 1.02,
              y: -5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm`}>
                <Icon 
                  name={stat?.icon} 
                  size={24} 
                  className={stat?.color}
                />
              </div>
              
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                stat?.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <Icon 
                  name={stat?.isPositive ? 'ArrowUp' : 'ArrowDown'} 
                  size={12}
                />
                <span className="text-xs font-medium">{stat?.change}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-heading font-bold text-foreground">
                  {stat?.value}
                </span>
                <span className="text-lg font-medium text-muted-foreground">
                  {stat?.unit}
                </span>
              </div>
              
              <h3 className="text-sm font-body font-semibold text-foreground">
                {stat?.label}
              </h3>
              
              <p className="text-xs font-caption text-muted-foreground">
                {stat?.change} {stat?.changeLabel}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WellnessStatistics;