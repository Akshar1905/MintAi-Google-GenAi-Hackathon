import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PhotoCaptionWidget from '../../../components/widgets/PhotoCaptionWidget';
import MusicRecommendationWidget from '../../../components/widgets/MusicRecommendationWidget';
import MotivationalQuoteWidget from '../../../components/widgets/MotivationalQuoteWidget';
import MemeUpliftWidget from '../../../components/widgets/MemeUpliftWidget';
import ImageGenerationWidget from '../../../components/widgets/ImageGenerationWidget';
import TapToUpliftWidget from '../../../components/widgets/TapToUpliftWidget';
import MintChatWidget from '../../../components/widgets/MintChatWidget';
import DailyWellnessSummaryWidget from '../../../components/widgets/DailyWellnessSummaryWidget';

const RotatingWidget = ({ isPaused, onPause, onResume, className = '', chatHistory = null, currentMood = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  // Widget definitions with actual components
  const widgets = [
    {
      id: 'photo-caption',
      type: 'photo-caption',
      title: 'Photo + Auto Caption',
      component: PhotoCaptionWidget,
      props: {},
    },
    {
      id: 'music',
      type: 'music',
      title: 'YouTube Music',
      component: MusicRecommendationWidget,
      props: { chatHistory },
    },
    {
      id: 'quote',
      type: 'quote',
      title: 'Daily Wisdom',
      component: MotivationalQuoteWidget,
      props: { mood: currentMood },
    },
    {
      id: 'meme',
      type: 'meme',
      title: 'Remember to Laugh',
      component: MemeUpliftWidget,
      props: {},
    },
    {
      id: 'image-gen',
      type: 'image-gen',
      title: 'AI Visual Therapy',
      component: ImageGenerationWidget,
      props: { mood: currentMood, chatHistory },
    },
    {
      id: 'tap-uplift',
      type: 'tap-uplift',
      title: 'Tap to Uplift',
      component: TapToUpliftWidget,
      props: {},
    },
    {
      id: 'mint-chat',
      type: 'mint-chat',
      title: 'MintChat AI',
      component: MintChatWidget,
      props: {},
    },
    {
      id: 'wellness-summary',
      type: 'wellness-summary',
      title: 'Daily Wellness Summary',
      component: DailyWellnessSummaryWidget,
      props: {},
    },
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
    if (!widget || !widget.component) return null;
    
    const WidgetComponent = widget.component;
    return <WidgetComponent {...widget.props} />;
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