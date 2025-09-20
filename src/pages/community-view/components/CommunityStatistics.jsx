import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const CommunityStatistics = () => {
  const stats = [
    {
      id: 'members',
      label: 'Active Members',
      value: '2.4k',
      change: '+124',
      changeLabel: 'this week',
      icon: 'Users',
      color: 'text-blue-500',
      bgGradient: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      borderColor: 'border-blue-200',
      isPositive: true
    },
    {
      id: 'posts',
      label: 'Daily Posts',
      value: '89',
      change: '+15',
      changeLabel: 'today',
      icon: 'MessageSquare',
      color: 'text-green-500',
      bgGradient: 'bg-gradient-to-br from-green-100 to-emerald-200',
      borderColor: 'border-green-200',
      isPositive: true
    },
    {
      id: 'support',
      label: 'Support Given',
      value: '1.2k',
      change: '+43',
      changeLabel: 'this week',
      icon: 'Heart',
      color: 'text-pink-500',
      bgGradient: 'bg-gradient-to-br from-pink-100 to-rose-200',
      borderColor: 'border-pink-200',
      isPositive: true
    },
    {
      id: 'milestones',
      label: 'Milestones Achieved',
      value: '67',
      change: '+8',
      changeLabel: 'this week',
      icon: 'Trophy',
      color: 'text-yellow-500',
      bgGradient: 'bg-gradient-to-br from-yellow-100 to-amber-200',
      borderColor: 'border-yellow-200',
      isPositive: true
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Community Overview
        </h2>
        <p className="text-sm font-body text-muted-foreground">
          See how our wellness community is thriving together
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <motion.div
            key={stat?.id}
            className={`${stat?.bgGradient} rounded-2xl p-6 shadow-neumorphic border ${stat?.borderColor} backdrop-blur-sm`}
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
              <div className="text-3xl font-heading font-bold text-foreground">
                {stat?.value}
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

export default CommunityStatistics;