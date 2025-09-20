import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const AnalyticsCharts = ({ dateRange, selectedMetrics }) => {
  const [activeChart, setActiveChart] = useState('trends');

  // Mock data for different charts
  const trendData = [
    { name: 'Mon', mood: 7.2, energy: 6.8, stress: 4.2 },
    { name: 'Tue', mood: 8.1, energy: 7.5, stress: 3.8 },
    { name: 'Wed', mood: 6.9, energy: 6.2, stress: 5.1 },
    { name: 'Thu', mood: 8.7, energy: 8.2, stress: 3.2 },
    { name: 'Fri', mood: 9.1, energy: 8.8, stress: 2.9 },
    { name: 'Sat', mood: 8.5, energy: 7.9, stress: 3.5 },
    { name: 'Sun', mood: 8.3, energy: 7.6, stress: 3.7 }
  ];

  const activityData = [
    { name: 'Meditation', minutes: 125, sessions: 8 },
    { name: 'Journaling', minutes: 95, sessions: 6 },
    { name: 'Breathing', minutes: 45, sessions: 12 },
    { name: 'Exercise', minutes: 180, sessions: 4 },
    { name: 'Sleep', minutes: 480, sessions: 7 }
  ];

  const progressData = [
    { month: 'Jan', wellness: 65, goals: 70, mood: 68 },
    { month: 'Feb', wellness: 72, goals: 75, mood: 74 },
    { month: 'Mar', wellness: 78, goals: 82, mood: 79 },
    { month: 'Apr', wellness: 83, goals: 85, mood: 84 },
    { month: 'May', wellness: 87, goals: 89, mood: 88 },
    { month: 'Jun', wellness: 91, goals: 93, mood: 92 }
  ];

  const habitData = [
    { name: 'Completed', value: 78, color: '#A7EBD6' },
    { name: 'Missed', value: 22, color: '#FC8181' }
  ];

  const colors = {
    primary: '#A7EBD6',
    secondary: '#7DE3C2',
    accent: '#5DDBB8',
    warning: '#F6E05E',
    success: '#68D391',
    error: '#FC8181'
  };

  const charts = [
    {
      id: 'trends',
      title: 'Weekly Mood & Energy Trends',
      description: 'Track your daily mood and energy levels',
      component: (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors?.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors?.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors?.secondary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors?.secondary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
            <XAxis dataKey="name" stroke="#718096" fontSize={12} />
            <YAxis stroke="#718096" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            {selectedMetrics?.includes('mood') && (
              <Area
                type="monotone"
                dataKey="mood"
                stroke={colors?.primary}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#moodGradient)"
                name="Mood"
              />
            )}
            {selectedMetrics?.includes('energy') && (
              <Area
                type="monotone"
                dataKey="energy"
                stroke={colors?.secondary}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#energyGradient)"
                name="Energy"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'activities',
      title: 'Activity Time Distribution',
      description: 'How you spend your wellness time',
      component: (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
            <XAxis dataKey="name" stroke="#718096" fontSize={12} />
            <YAxis stroke="#718096" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Bar 
              dataKey="minutes" 
              fill={colors?.accent} 
              radius={[4, 4, 0, 0]}
              name="Minutes"
            />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'progress',
      title: '6-Month Wellness Progress',
      description: 'Long-term wellness improvement trends',
      component: (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
            <XAxis dataKey="month" stroke="#718096" fontSize={12} />
            <YAxis stroke="#718096" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="wellness" 
              stroke={colors?.primary} 
              strokeWidth={3}
              dot={{ fill: colors?.primary, r: 6 }}
              name="Wellness Score"
            />
            <Line 
              type="monotone" 
              dataKey="goals" 
              stroke={colors?.secondary} 
              strokeWidth={3}
              dot={{ fill: colors?.secondary, r: 6 }}
              name="Goals"
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke={colors?.accent} 
              strokeWidth={3}
              dot={{ fill: colors?.accent, r: 6 }}
              name="Mood"
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      id: 'habits',
      title: 'Habit Completion Analysis',
      description: '78% completion rate this week',
      component: (
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={habitData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {habitData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          Analytics Dashboard
        </h2>
      </div>
      {/* Chart Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/30 rounded-xl">
        {charts?.map((chart) => (
          <button
            key={chart?.id}
            onClick={() => setActiveChart(chart?.id)}
            className={`flex-1 min-w-0 px-4 py-3 rounded-lg transition-spring text-sm font-body font-medium ${
              activeChart === chart?.id
                ? 'bg-card text-foreground shadow-neumorphic-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <span className="truncate">{chart?.title?.split(' ')?.[0]} {chart?.title?.split(' ')?.[1]}</span>
          </button>
        ))}
      </div>
      {/* Active Chart */}
      <motion.div
        key={activeChart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-neumorphic border border-border"
      >
        {charts?.find(chart => chart?.id === activeChart) && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-1">
                  {charts?.find(chart => chart?.id === activeChart)?.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  {charts?.find(chart => chart?.id === activeChart)?.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-spring">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23,4 23,10 17,10"/>
                    <polyline points="1,20 1,14 7,14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-spring">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
              </div>
            </div>
            {charts?.find(chart => chart?.id === activeChart)?.component}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;