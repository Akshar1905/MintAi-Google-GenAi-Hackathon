import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const TopNavigation = ({ currentUser, onNavigate, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/main-dashboard', 
      icon: 'LayoutDashboard', 
      tooltip: 'Main Dashboard' 
    },
    { 
      label: 'Wellness', 
      path: '/wellness-view', 
      icon: 'Heart', 
      tooltip: 'Wellness Tracking' 
    },
    { 
      label: 'Community', 
      path: '/community-view', 
      icon: 'Users', 
      tooltip: 'Community Support' 
    },
    { 
      label: 'Insights', 
      path: '/insights-view', 
      icon: 'TrendingUp', 
      tooltip: 'Analytics & Insights' 
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/authentication');
    setShowUserMenu(false);
  };

  const isActive = (path) => location?.pathname === path;

  return (
    <header className={`sticky top-0 z-100 bg-background/80 backdrop-blur-xl border-b border-border ${className}`}>
      <div className="w-full h-18 px-6 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <div 
            className="flex items-center cursor-pointer transition-spring hover:scale-105"
            onClick={() => handleNavigation('/main-dashboard')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-neumorphic-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className="ml-3 text-xl font-heading font-semibold text-foreground">
              MintAi
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-2">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-spring hover:bg-muted/50 group relative ${
                isActive(item?.path) 
                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-neumorphic-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={item?.tooltip}
            >
              <Icon 
                name={item?.icon} 
                size={18} 
                className={`transition-spring group-hover:scale-110 ${
                  isActive(item?.path) ? 'text-primary-foreground' : ''
                }`}
              />
              <span className="font-body font-medium text-sm">{item?.label}</span>
              {isActive(item?.path) && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={handleUserMenuToggle}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-spring group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center shadow-neumorphic-sm">
                  <Icon 
                    name="User" 
                    size={16} 
                    className="text-accent-foreground"
                  />
                </div>
                <span className="hidden lg:block text-sm font-body font-medium text-foreground">
                  {currentUser?.name || 'User'}
                </span>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`text-muted-foreground transition-spring group-hover:text-foreground ${
                    showUserMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-neumorphic-md z-200 backdrop-blur-sm">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        handleNavigation('/user-profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-muted transition-spring"
                    >
                      <Icon name="Settings" size={16} className="text-muted-foreground" />
                      <span className="text-sm font-body text-popover-foreground">Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-muted transition-spring"
                    >
                      <Icon name="LogOut" size={16} className="text-muted-foreground" />
                      <span className="text-sm font-body text-popover-foreground">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleNavigation('/authentication')}
              iconName="LogIn"
              iconPosition="left"
              iconSize={16}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;