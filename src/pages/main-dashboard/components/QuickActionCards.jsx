import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCards = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'journal',
      title: 'Daily Journal',
      description: 'Reflect on your thoughts and feelings',
      icon: 'BookOpen',
      color: 'bg-primary',
      textColor: 'text-primary-foreground',
      action: () => {
        // Mock journal action - would navigate to journal page
        console.log('Opening journal...');
      }
    },
    {
      id: 'challenge',
      title: 'Daily Challenge',
      description: 'Complete today\'s wellness task',
      icon: 'Target',
      color: 'bg-accent',
      textColor: 'text-accent-foreground',
      action: () => {
        // Mock challenge action - would navigate to challenge page
        console.log('Opening daily challenge...');
      }
    },
    {
      id: 'nearby',
      title: 'Nearby Spots',
      description: 'Find peaceful places around you',
      icon: 'MapPin',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      action: () => {
        // Mock nearby spots action - would navigate to map page
        console.log('Opening nearby spots...');
      }
    }
  ];

  const handleCardClick = (action) => {
    action();
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions?.map((action, index) => (
          <motion.div
            key={action?.id}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCardClick(action?.action)}
          >
            <div className="bg-card rounded-xl p-6 shadow-neumorphic hover:shadow-neumorphic-md transition-spring border border-border">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${action?.color} rounded-lg flex items-center justify-center shadow-neumorphic-sm group-hover:scale-110 transition-spring`}>
                  <Icon 
                    name={action?.icon} 
                    size={24} 
                    className={action?.textColor}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-spring">
                    {action?.title}
                  </h3>
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    {action?.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="text-primary hover:text-primary-foreground hover:bg-primary"
                >
                  Get Started
                </Button>
                
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-60" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-40" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-20" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCards;