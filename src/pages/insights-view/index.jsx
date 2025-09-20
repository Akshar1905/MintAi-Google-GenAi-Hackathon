import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNavigation from '../../components/ui/TopNavigation';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import ChatTransition from '../../components/ui/ChatTransition';
import InsightsHeader from './components/InsightsHeader';
import KeyInsightsStats from './components/KeyInsightsStats';
import AnalyticsCharts from './components/AnalyticsCharts';
import AIRecommendations from './components/AIRecommendations';
import DateRangeSelector from './components/DateRangeSelector';
import PageFadeIn from '../../components/ui/PageFadeIn';

const InsightsView = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetrics, setSelectedMetrics] = useState(['mood', 'energy', 'sleep']);

  // Mock user authentication check
  useEffect(() => {
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      streak: 7,
      mood: 'positive'
    };
    setCurrentUser(mockUser);
  }, []);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  // Handle metric toggle
  const handleMetricToggle = (metric) => {
    setSelectedMetrics(prev => 
      prev?.includes(metric) 
        ? prev?.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/10">
      {/* Top Navigation */}
      <TopNavigation
        currentUser={currentUser}
        onNavigate={handleNavigation}
      />
      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-20 md:pb-6">
        <PageFadeIn>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Insights Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <InsightsHeader />
          </motion.div>

          {/* Date Range Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <DateRangeSelector 
              currentRange={dateRange}
              onRangeChange={handleDateRangeChange}
              selectedMetrics={selectedMetrics}
              onMetricToggle={handleMetricToggle}
            />
          </motion.div>

          {/* Key Wellness Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <KeyInsightsStats dateRange={dateRange} />
          </motion.div>

          {/* Analytics Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnalyticsCharts 
              dateRange={dateRange} 
              selectedMetrics={selectedMetrics}
            />
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AIRecommendations />
          </motion.div>

          {/* Actionable Insights Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-neumorphic border border-border"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-secondary rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-foreground">
                  <path d="M9 11H1l9-9 9 9h-8"/>
                  <path d="M13 21L13 13"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-heading font-semibold text-foreground">
                  Actionable Insights
                </h3>
                <p className="text-sm text-muted-foreground">
                  Specific recommendations for your wellness journey
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-4 border border-border/50">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 1v6m0 6v6"/>
                    </svg>
                  </div>
                  <h4 className="font-heading font-medium text-foreground">Mood Enhancement</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your mood peaks between 2-4 PM. Schedule important activities during this window for optimal performance.
                </p>
              </div>

              <div className="bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg p-4 border border-border/50">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <h4 className="font-heading font-medium text-foreground">Habit Optimization</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Linking meditation with your morning routine could increase completion rate by 23%.
                </p>
              </div>

              <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg p-4 border border-border/50">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                    </svg>
                  </div>
                  <h4 className="font-heading font-medium text-foreground">Goal Achievement</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Breaking larger goals into 3-day mini-challenges could improve success rate to 95%.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        </PageFadeIn>
      </main>
      {/* Bottom Navigation for Mobile */}
      <BottomTabNavigation onNavigate={handleNavigation} />
      {/* Chat Widget */}
      <ChatTransition onNavigate={handleNavigation} onClose={() => {}} />
    </div>
  );
};

export default InsightsView;