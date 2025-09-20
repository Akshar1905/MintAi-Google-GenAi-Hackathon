import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WellnessWidgetGrid = ({ selectedCategory, onCategoryChange }) => {
  const [expandedWidget, setExpandedWidget] = useState(null);

  const categories = [
    { id: 'all', label: 'All', icon: 'Grid3X3' },
    { id: 'mind', label: 'Mind', icon: 'Brain' },
    { id: 'body', label: 'Body', icon: 'Activity' },
    { id: 'soul', label: 'Soul', icon: 'Heart' },
    { id: 'progress', label: 'Progress', icon: 'TrendingUp' }
  ];

  const widgets = [
    // Mind Category
    {
      id: 'mood-tracking',
      title: 'Mood Tracking',
      subtitle: 'Track your daily emotions',
      category: 'mind',
      icon: 'Smile',
      bgGradient: 'bg-gradient-to-br from-pink-100 to-rose-200',
      iconColor: 'text-pink-600',
      borderColor: 'border-pink-200',
      features: ['Emoji selection', 'Weekly trends', 'Mood insights']
    },
    {
      id: 'meditation-timer',
      title: 'Meditation Timer',
      subtitle: 'Built-in meditation sessions',
      category: 'mind',
      icon: 'Clock',
      bgGradient: 'bg-gradient-to-br from-purple-100 to-indigo-200',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      features: ['1-30 minute sessions', 'Streak tracking', 'Guided meditations']
    },
    {
      id: 'breathing-guide',
      title: 'Breathing Guide',
      subtitle: 'Animated breathing exercises',
      category: 'mind',
      icon: 'Wind',
      bgGradient: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      features: ['4-7-8 breathing', 'Box breathing', 'Custom patterns']
    },
    
    // Body Category
    {
      id: 'sleep-tracker',
      title: 'Sleep Tracker',
      subtitle: 'Monitor your sleep quality',
      category: 'body',
      icon: 'Moon',
      bgGradient: 'bg-gradient-to-br from-indigo-100 to-slate-200',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      features: ['Duration tracking', 'Quality ratings', 'Sleep patterns']
    },
    {
      id: 'habit-tracker',
      title: 'Habit Tracker',
      subtitle: 'Build positive daily habits',
      category: 'body',
      icon: 'CheckCircle',
      bgGradient: 'bg-gradient-to-br from-green-100 to-emerald-200',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      features: ['Daily checklist', 'Streak counters', 'Custom habits']
    },
    
    // Soul Category
    {
      id: 'journal',
      title: 'Daily Journal',
      subtitle: 'Reflect and write thoughts',
      category: 'soul',
      icon: 'BookOpen',
      bgGradient: 'bg-gradient-to-br from-amber-100 to-orange-200',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      features: ['Rich text editor', 'Auto-save', 'Mood tagging']
    },
    {
      id: 'daily-challenge',
      title: 'Daily Challenges',
      subtitle: 'Complete wellness tasks',
      category: 'soul',
      icon: 'Target',
      bgGradient: 'bg-gradient-to-br from-teal-100 to-cyan-200',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      features: ['Rotating challenges', 'Difficulty levels', 'Rewards system']
    },
    
    // Progress Category
    {
      id: 'goal-setting',
      title: 'Goal Setting',
      subtitle: 'Set and track wellness goals',
      category: 'progress',
      icon: 'Flag',
      bgGradient: 'bg-gradient-to-br from-violet-100 to-purple-200',
      iconColor: 'text-violet-600',
      borderColor: 'border-violet-200',
      features: ['SMART goals', 'Progress bars', 'Milestones']
    },
    {
      id: 'stats-overview',
      title: 'Stats Overview',
      subtitle: 'View your wellness metrics',
      category: 'progress',
      icon: 'BarChart3',
      bgGradient: 'bg-gradient-to-br from-emerald-100 to-green-200',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      features: ['Real-time metrics', 'Charts & graphs', 'Export data']
    }
  ];

  const filteredWidgets = selectedCategory === 'all' 
    ? widgets 
    : widgets?.filter(widget => widget?.category === selectedCategory);

  const handleWidgetExpand = (widgetId) => {
    setExpandedWidget(expandedWidget === widgetId ? null : widgetId);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Wellness Widgets
        </h2>
        <p className="text-sm font-body text-muted-foreground mb-6">
          Organized tools for your complete wellness journey
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories?.map((category) => (
            <motion.button
              key={category?.id}
              onClick={() => onCategoryChange?.(category?.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category?.id
                  ? 'bg-accent text-white shadow-neumorphic-md'
                  : 'bg-card text-foreground hover:bg-accent/10 border border-border'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon 
                name={category?.icon} 
                size={16} 
                className={selectedCategory === category?.id ? 'text-white' : 'text-muted-foreground'}
              />
              {category?.label}
            </motion.button>
          ))}
        </div>
      </div>
      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWidgets?.map((widget, index) => (
          <motion.div
            key={widget?.id}
            layout
            className={`${widget?.bgGradient} rounded-2xl p-6 shadow-neumorphic border ${widget?.borderColor} backdrop-blur-sm cursor-pointer relative overflow-hidden`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{
              duration: 0.6,
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleWidgetExpand(widget?.id)}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon 
                    name={widget?.icon} 
                    size={24} 
                    className={widget?.iconColor}
                  />
                </div>
                
                <div className="text-xs font-medium text-foreground/60 bg-white/40 rounded-full px-2 py-1 capitalize">
                  {widget?.category}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  {widget?.title}
                </h3>
                
                <p className="text-sm font-body text-muted-foreground">
                  {widget?.subtitle}
                </p>
              </div>

              {/* Expandable Features */}
              <motion.div
                initial={false}
                animate={{ 
                  height: expandedWidget === widget?.id ? 'auto' : 0,
                  opacity: expandedWidget === widget?.id ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-4 border-t border-white/30">
                  <p className="text-xs font-medium text-foreground mb-2">Features:</p>
                  {widget?.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Icon name="Check" size={12} className="text-green-600" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                className="flex items-center justify-center mt-4 pt-4 border-t border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon 
                  name={expandedWidget === widget?.id ? 'ChevronUp' : 'ChevronDown'} 
                  size={20} 
                  className="text-foreground/60"
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Empty State */}
      {filteredWidgets?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No widgets found in this category</p>
        </motion.div>
      )}
    </div>
  );
};

export default WellnessWidgetGrid;