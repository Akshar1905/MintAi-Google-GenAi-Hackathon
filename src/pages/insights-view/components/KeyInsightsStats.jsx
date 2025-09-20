import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const KeyInsightsStats = ({ dateRange }) => {
  const tasks = useMemo(() => { try { return JSON.parse(localStorage.getItem('mintai.tasks.v1')||'[]'); } catch { return []; } }, []);
  const moods = useMemo(() => { try { return JSON.parse(localStorage.getItem('mintai.moodEntries.v1')||'[]'); } catch { return []; } }, []);

  const last7 = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate()-i); arr.push(d.toISOString().slice(0,10)); }
    return arr;
  }, []);

  const byDate = useMemo(() => {
    const map = new Map();
    for (const t of tasks) {
      const d = t.date; const v = map.get(d) || { total:0, done:0 }; v.total++; if (t.completed) v.done++; map.set(d, v);
    }
    return map;
  }, [tasks]);

  const weekDone = last7.reduce((s,k)=>s+(byDate.get(k)?.done||0),0);
  const weekTotal = last7.reduce((s,k)=>s+(byDate.get(k)?.total||0),0);
  const weeklyProgress = weekTotal ? Math.round((weekDone/weekTotal)*100) : 0;

  const moodScoreMap = { great: 5, good: 4, okay: 3, low: 2, down: 1 };
  const moodAvg = moods.slice(0,7).reduce((s,m)=> s + (moodScoreMap[m.mood]||3), 0) / Math.max(1, Math.min(7, moods.length));
  const stressLevel = moodAvg >= 4 ? 'Low' : moodAvg >= 3 ? 'Moderate' : 'High';
  const energyLevel = moodAvg >= 4 ? 'High' : moodAvg >= 3 ? 'Medium' : 'Low';

  const [animatedValues, setAnimatedValues] = useState({
    mood: 0,
    meditation: 0,
    goals: 0,
    sleep: 0
  });

  const targetValues = {
    mood: 15,
    meditation: 18,
    goals: 88,
    sleep: 12
  };

  // Animate counter values
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60fps
    const increment = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValues({
        mood: Math.round(targetValues?.mood * easeOut),
        meditation: Math.round(targetValues?.meditation * easeOut),
        goals: Math.round(targetValues?.goals * easeOut),
        sleep: Math.round(targetValues?.sleep * easeOut)
      });

      if (progress === 1) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, [dateRange]);

  const insights = [
    {
      id: 'mood',
      title: 'Weekly Progress',
      value: weeklyProgress,
      unit: '%',
      prefix: '',
      description: 'Tasks completed',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      ),
      gradient: 'from-primary to-secondary',
      bgGradient: 'from-primary/20 to-secondary/20'
    },
    {
      id: 'meditation',
      title: 'Energy Level',
      value: energyLevel === 'High' ? 90 : energyLevel === 'Medium' ? 60 : 30,
      unit: '%',
      description: energyLevel,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      ),
      gradient: 'from-secondary to-accent',
      bgGradient: 'from-secondary/20 to-accent/20'
    },
    {
      id: 'goals',
      title: 'Stress Level',
      value: stressLevel === 'Low' ? 25 : stressLevel === 'Moderate' ? 50 : 75,
      unit: '%',
      description: stressLevel,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      gradient: 'from-accent to-primary',
      bgGradient: 'from-accent/20 to-primary/20'
    },
    {
      id: 'sleep',
      title: 'Mood Entries',
      value: Math.min(100, (moods.slice(0,7).length/7)*100),
      unit: '%',
      prefix: '',
      description: 'Last 7 days',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      ),
      gradient: 'from-primary via-accent to-secondary',
      bgGradient: 'from-primary/20 via-accent/20 to-secondary/20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          Key Wellness Insights
        </h2>
        <div className="text-sm text-muted-foreground font-body">
          Last {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '6 months'}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights?.map((insight, index) => (
          <motion.div
            key={insight?.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className={`bg-gradient-to-br ${insight?.bgGradient} backdrop-blur-sm rounded-xl p-6 shadow-neumorphic border border-border/50 hover:shadow-neumorphic-md transition-spring cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${insight?.gradient} rounded-lg flex items-center justify-center shadow-neumorphic-sm group-hover:scale-110 transition-spring`}>
                <div className="text-white">
                  {insight?.icon}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground font-body mb-1">
                  {insight?.description}
                </div>
                <div className="flex items-baseline space-x-1">
                  {insight?.prefix && (
                    <span className="text-lg font-heading font-semibold text-success">
                      {insight?.prefix}
                    </span>
                  )}
                  <span className="text-2xl font-heading font-bold text-foreground">
                    {insight?.value}
                  </span>
                  <span className="text-sm font-body text-muted-foreground">
                    {insight?.unit}
                  </span>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              {insight?.title}
            </h3>
            
            {/* Progress indicator */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((insight?.value / (insight?.id === 'goals' ? 100 : 30)) * 100, 100)}%` }}
                transition={{ delay: index * 0.1 + 0.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full bg-gradient-to-r ${insight?.gradient} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KeyInsightsStats;