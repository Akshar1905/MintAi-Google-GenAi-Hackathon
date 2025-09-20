import React from 'react';
import { motion } from 'framer-motion';

const DateRangeSelector = ({ currentRange, onRangeChange, selectedMetrics, onMetricToggle }) => {
  const dateRanges = [
    { id: '7d', label: '7 Days', icon: '7️⃣' },
    { id: '30d', label: '30 Days', icon: '📅' },
    { id: '6m', label: '6 Months', icon: '📊' }
  ];

  const metrics = [
    { id: 'mood', label: 'Mood', color: 'primary' },
    { id: 'energy', label: 'Energy', color: 'secondary' },
    { id: 'sleep', label: 'Sleep', color: 'accent' },
    { id: 'stress', label: 'Stress', color: 'warning' }
  ];

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-neumorphic border border-border">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 lg:space-x-8">
        {/* Date Range Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-heading font-medium text-foreground">Time Period</h3>
          <div className="flex flex-wrap gap-2">
            {dateRanges?.map((range) => (
              <button
                key={range?.id}
                onClick={() => onRangeChange(range?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-spring text-sm font-body font-medium ${
                  currentRange === range?.id
                    ? 'bg-primary text-primary-foreground shadow-neumorphic-sm'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>{range?.icon}</span>
                <span>{range?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Metric Toggles */}
        <div className="space-y-3">
          <h3 className="text-sm font-heading font-medium text-foreground">Metrics</h3>
          <div className="flex flex-wrap gap-2">
            {metrics?.map((metric) => (
              <motion.button
                key={metric?.id}
                onClick={() => onMetricToggle(metric?.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-spring text-sm font-body font-medium border ${
                  selectedMetrics?.includes(metric?.id)
                    ? `bg-${metric?.color}/20 border-${metric?.color} text-${metric?.color}-foreground`
                    : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedMetrics?.includes(metric?.id)
                      ? `bg-${metric?.color}`
                      : 'bg-muted-foreground/30'
                  }`}
                />
                <span>{metric?.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="flex items-center">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-secondary to-accent text-accent-foreground rounded-lg shadow-neumorphic-sm hover:shadow-neumorphic transition-spring text-sm font-body font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;