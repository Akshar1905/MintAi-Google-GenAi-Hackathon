import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RotatingWidget = ({ isPaused, onPause, onResume, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  // Mock data for widgets
  const widgets = [
    {
      id: 'photo',
      type: 'photo',
      title: 'Daily Inspiration',
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        caption: `Take a moment to breathe and appreciate the beauty around you. \nEvery sunrise brings new possibilities and hope for a brighter day.`,
        author: 'MintAi Wellness'
      }
    },
    {
      id: 'music',
      type: 'music',
      title: 'Mood Booster',
      data: {
        songTitle: 'Peaceful Morning',
        artist: 'Calm Sounds',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        duration: '3:45',
        genre: 'Ambient'
      }
    },
    {
      id: 'chat',
      type: 'chat',
      title: 'MintChat',
      data: {
        lastMessage: `Hi there! I'm here to support your wellness journey. \nHow are you feeling today?`,
        unreadCount: 2,
        isOnline: true
      }
    },
    {
      id: 'quote',type: 'quote',title: 'Daily Wisdom',
      data: {
        text: `The only way to do great work is to love what you do. \nStay passionate, stay curious, and never stop growing.`,
        author: 'Steve Jobs',category: 'Motivation'
      }
    },
    {
      id: 'animation',type: 'animation',title: 'Wellness Buddy',
      data: {
        message: 'You\'re doing amazing!',
        mood: 'happy',
        encouragement: 'Keep up the great work on your wellness journey!'
      }
    }
  ];

  // Auto-rotation logic
  useEffect(() => {
    if (!isPaused && !isHovered && !isDragging && !document.hidden) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % widgets?.length);
      }, 30000); // 30 seconds
    } else {
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
      }
    };
  }, [isPaused, isHovered, isDragging, widgets?.length]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onPause?.();
      } else {
        onResume?.();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [onPause, onResume]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event?.key === 'ArrowLeft') {
        event?.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + widgets?.length) % widgets?.length);
      } else if (event?.key === 'ArrowRight') {
        event?.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % widgets?.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [widgets?.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + widgets?.length) % widgets?.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % widgets?.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const renderWidget = (widget) => {
    switch (widget?.type) {
      case 'photo':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative overflow-hidden rounded-lg">
              <Image
                src={widget?.data?.imageUrl}
                alt="Daily inspiration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm font-body leading-relaxed whitespace-pre-line">
                  {widget?.data?.caption}
                </p>
                <p className="text-xs font-caption opacity-80 mt-2">
                  — {widget?.data?.author}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Button variant="ghost" size="icon">
                <Icon name="RefreshCw" size={16} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Share2" size={16} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Download" size={16} />
              </Button>
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-neumorphic-md">
              <Image
                src={widget?.data?.thumbnail}
                alt={widget?.data?.songTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                {widget?.data?.songTitle}
              </h3>
              <p className="text-sm font-body text-muted-foreground">
                {widget?.data?.artist}
              </p>
              <p className="text-xs font-caption text-muted-foreground mt-1">
                {widget?.data?.genre} • {widget?.data?.duration}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Icon name="SkipBack" size={20} />
              </Button>
              <Button variant="default" size="icon" className="w-12 h-12">
                <Icon name="Play" size={24} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="SkipForward" size={20} />
              </Button>
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-neumorphic-md">
                <Icon name="Bot" size={32} className="text-primary-foreground" />
              </div>
              {widget?.data?.isOnline && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />
                </div>
              )}
              {widget?.data?.unreadCount > 0 && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">
                    {widget?.data?.unreadCount}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center max-w-xs">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                MintChat
              </h3>
              <p className="text-sm font-body text-muted-foreground leading-relaxed whitespace-pre-line">
                {widget?.data?.lastMessage}
              </p>
            </div>
            <Button variant="default" className="px-6">
              Start Chatting
            </Button>
          </div>
        );

      case 'quote':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <Icon name="Quote" size={48} className="text-primary opacity-20" />
            </div>
            <div className="max-w-md">
              <p className="text-lg font-body text-foreground leading-relaxed whitespace-pre-line mb-4">
                {widget?.data?.text}
              </p>
              <p className="text-sm font-caption text-muted-foreground">
                — {widget?.data?.author}
              </p>
              <span className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-caption text-muted-foreground mt-2">
                {widget?.data?.category}
              </span>
            </div>
            <Button variant="outline" iconName="Share2" iconPosition="left">
              Share Quote
            </Button>
          </div>
        );

      case 'animation':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
            <motion.div
              className="w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-neumorphic-lg cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon name="Heart" size={32} className="text-accent-foreground" />
            </motion.div>
            <div className="text-center">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                {widget?.data?.message}
              </h3>
              <p className="text-sm font-body text-muted-foreground max-w-xs">
                {widget?.data?.encouragement}
              </p>
            </div>
            <motion.div
              className="flex space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(3)]?.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Widget Container */}
      <div className="relative h-96 bg-card rounded-2xl shadow-neumorphic-lg overflow-hidden backdrop-blur-sm border border-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 p-6"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {renderWidget(widgets?.[currentIndex])}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="ml-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="mr-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>

        {/* Widget Title */}
        <div className="absolute top-4 left-6 right-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-caption font-medium text-muted-foreground">
              {widgets?.[currentIndex]?.title}
            </h2>
            <div className="flex items-center space-x-2">
              {isPaused || isHovered ? (
                <Icon name="Pause" size={16} className="text-muted-foreground" />
              ) : (
                <Icon name="Play" size={16} className="text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Dot Indicators */}
      <div className="flex items-center justify-center space-x-3 mt-6">
        {widgets?.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-spring ${
              index === currentIndex
                ? 'bg-primary shadow-neumorphic-sm'
                : 'bg-muted hover:bg-muted-foreground/20'
            }`}
            aria-label={`Go to widget ${index + 1}`}
          />
        ))}
      </div>
      {/* Progress Indicator */}
      <div className="mt-4 w-full bg-muted rounded-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: isPaused || isHovered ? '0%' : '100%' }}
          transition={{
            duration: isPaused || isHovered ? 0 : 30,
            ease: 'linear',
            repeat: isPaused || isHovered ? 0 : Infinity
          }}
        />
      </div>
    </div>
  );
};

export default RotatingWidget;