import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = ({ onNavigate, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      label: 'Home', 
      path: '/main-dashboard', 
      icon: 'Home', 
      tooltip: 'Wellness Dashboard' 
    },
    { 
      label: 'Profile', 
      path: '/user-profile', 
      icon: 'User', 
      tooltip: 'Account Settings' 
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const isActive = (path) => location?.pathname === path;

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-100 bg-background border-t border-border pb-safe ${className}`}>
      <div className="flex items-center justify-around h-16 px-4">
        {navigationItems?.map((item) => (
          <button
            key={item?.path}
            onClick={() => handleNavigation(item?.path)}
            className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-spring hover:scale-105 active:scale-95 min-w-0 flex-1 max-w-20 ${
              isActive(item?.path) 
                ? 'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
            title={item?.tooltip}
          >
            <div className={`p-2 rounded-lg transition-spring ${
              isActive(item?.path) 
                ? 'bg-primary/10 shadow-neumorphic-sm' 
                : 'hover:bg-muted'
            }`}>
              <Icon 
                name={item?.icon} 
                size={20} 
                className={`transition-spring ${
                  isActive(item?.path) 
                    ? 'text-primary' :'text-muted-foreground'
                }`}
              />
            </div>
            <span className={`text-xs font-caption font-normal transition-spring ${
              isActive(item?.path) 
                ? 'text-primary font-medium' :'text-muted-foreground'
            }`}>
              {item?.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomTabNavigation;