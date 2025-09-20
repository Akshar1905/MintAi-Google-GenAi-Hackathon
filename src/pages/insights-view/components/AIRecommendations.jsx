import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AIRecommendations = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const recommendations = [
    {
      id: 'morning-routine',
      title: 'Morning Routine Optimization',
      category: 'Habit Building',
      confidence: 92,
      impact: 'High',
      timeframe: '2-3 weeks',
      description: 'Based on your sleep patterns and mood data, shifting your meditation to 7:30 AM could improve consistency by 34%.',
      details: [
        'Your cortisol levels peak at 7:00 AM, making 7:30 AM optimal for mindfulness',
        'This timing aligns with your natural circadian rhythm',
        'Users with similar patterns see 34% better habit retention'
      ],
      actionSteps: [
        'Set meditation timer for 7:30 AM daily',
        'Prepare meditation space the night before',
        'Track consistency for 21 days'
      ],
      expectedOutcome: '+34% meditation consistency, +15% morning mood score',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ),
      gradient: 'from-primary to-secondary'
    },
    {
      id: 'stress-management',
      title: 'Stress Response Pattern',
      category: 'Emotional Wellness',
      confidence: 87,
      impact: 'Medium',
      timeframe: '1-2 weeks',
      description: 'Your stress levels spike on Wednesdays. Implementing micro-breaks could reduce peak stress by 23%.',
      details: [
        'Wednesday stress levels are 40% higher than your weekly average',
        'Pattern correlates with your work schedule and meeting density',
        'Micro-breaks of 2-3 minutes show proven stress reduction'
      ],
      actionSteps: [
        'Schedule 5-minute breaks every 2 hours on Wednesdays',
        'Use breathing exercises during breaks',
        'Set phone reminders for consistency'
      ],
      expectedOutcome: '-23% peak stress, +18% Wednesday wellness score',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      gradient: 'from-secondary to-accent'
    },
    {
      id: 'sleep-optimization',
      title: 'Sleep Quality Enhancement',
      category: 'Sleep Health',
      confidence: 94,
      impact: 'High',
      timeframe: '3-4 weeks',
      description: 'Your deep sleep phases are suboptimal. A wind-down routine starting at 9:30 PM could improve sleep quality by 28%.',
      details: [
        'Deep sleep accounts for only 18% of your total sleep time (ideal: 25%)',
        'Your wind-down activities currently start too late',
        'Blue light exposure until 10:45 PM delays melatonin production'
      ],
      actionSteps: [
        'Begin wind-down routine at 9:30 PM sharp',
        'Eliminate screens 1 hour before sleep',
        'Try chamomile tea or light reading'
      ],
      expectedOutcome: '+28% deep sleep, +22% morning energy levels',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      ),
      gradient: 'from-accent to-primary'
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-foreground">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              AI Recommendations
            </h2>
            <p className="text-sm text-muted-foreground">
              Personalized insights powered by machine learning
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground font-body">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>High Impact</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-warning rounded-full" />
            <span>Medium Impact</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations?.map((rec, index) => (
          <motion.div
            key={rec?.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className={`bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-neumorphic border border-border hover:shadow-neumorphic-md transition-spring cursor-pointer ${
              expandedCard === rec?.id ? 'ring-2 ring-primary/30' : ''
            }`}
            onClick={() => setExpandedCard(expandedCard === rec?.id ? null : rec?.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-r ${rec?.gradient} rounded-lg flex items-center justify-center shadow-neumorphic-sm`}>
                <div className="text-white">
                  {rec?.icon}
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className={`text-xs font-body font-medium ${getImpactColor(rec?.impact)}`}>
                  {rec?.impact} Impact
                </div>
                <div className={`text-xs font-body ${getConfidenceColor(rec?.confidence)}`}>
                  {rec?.confidence}% confidence
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground font-body mb-1">
                  {rec?.category}
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  {rec?.title}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {rec?.description}
              </p>

              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-body">Confidence</span>
                  <span className="font-body font-medium text-foreground">{rec?.confidence}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rec?.confidence}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full bg-gradient-to-r ${rec?.gradient} rounded-full`}
                  />
                </div>
              </div>

              {/* Expected Timeline */}
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>Expected results in {rec?.timeframe}</span>
              </div>
            </div>

            {/* Expanded Content */}
            <motion.div
              initial={false}
              animate={{ height: expandedCard === rec?.id ? 'auto' : 0, opacity: expandedCard === rec?.id ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              {expandedCard === rec?.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  {/* Detailed Analysis */}
                  <div>
                    <h4 className="text-sm font-heading font-medium text-foreground mb-2">
                      Detailed Analysis
                    </h4>
                    <ul className="space-y-1">
                      {rec?.details?.map((detail, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground font-body flex items-start space-x-2">
                          <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Steps */}
                  <div>
                    <h4 className="text-sm font-heading font-medium text-foreground mb-2">
                      Recommended Actions
                    </h4>
                    <ul className="space-y-1">
                      {rec?.actionSteps?.map((step, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground font-body flex items-start space-x-2">
                          <div className="w-4 h-4 bg-muted rounded flex items-center justify-center text-[10px] font-medium text-foreground mt-0.5">
                            {idx + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expected Outcome */}
                  <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-lg p-3">
                    <h4 className="text-sm font-heading font-medium text-foreground mb-1">
                      Expected Outcome
                    </h4>
                    <p className="text-xs text-success font-body">
                      {rec?.expectedOutcome}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Expand Indicator */}
            <div className="flex justify-center mt-4">
              <motion.div
                animate={{ rotate: expandedCard === rec?.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;