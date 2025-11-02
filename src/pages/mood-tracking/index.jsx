import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { analyzeMoodTrends, generateMoodTimeline, getMoodStatistics } from '../../utils/wellnessAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STORAGE_KEY = 'mintai.moodEntries.v1';

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const MOOD_OPTIONS = [
  { id: 'great', label: 'Great', emoji: '😄' },
  { id: 'good', label: 'Good', emoji: '😊' },
  { id: 'okay', label: 'Okay', emoji: '😐' },
  { id: 'low', label: 'Low', emoji: '😕' },
  { id: 'down', label: 'Down', emoji: '😞' },
];

const MoodTracking = () => {
  const [entries, setEntries] = useState(() => loadEntries());
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'How are you feeling right now?' }
  ]);
  const [note, setNote] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayEntry = entries.find((e) => e.date === todayKey);

  const pickMood = (moodId) => {
    const mood = MOOD_OPTIONS.find((m) => m.id === moodId);
    if (!mood) return;
    setMessages((msgs) => [
      ...msgs,
      { role: 'user', content: `${mood.emoji} ${mood.label}` },
      { role: 'assistant', content: 'Want to add a short note about your mood?' }
    ]);
    if (!todayEntry) {
      const newEntry = { date: todayKey, mood: moodId, note: '' };
      setEntries((prev) => [newEntry, ...prev]);
    } else {
      setEntries((prev) => prev.map((e) => e.date === todayKey ? { ...e, mood: moodId } : e));
    }
  };

  const submitNote = () => {
    const text = note.trim();
    if (!text) return;
    setMessages((msgs) => [
      ...msgs,
      { role: 'user', content: text },
      { role: 'assistant', content: 'Got it. Thanks for sharing. I’m here with you. 💚' }
    ]);
    setNote('');
    setEntries((prev) => {
      if (!todayEntry) {
        const newEntry = { date: todayKey, mood: 'okay', note: text };
        return [newEntry, ...prev];
      }
      return prev.map((e) => e.date === todayKey ? { ...e, note: text } : e);
    });
  };

  const lastSeven = useMemo(() => entries.slice(0, 7), [entries]);
  const moodTimeline = useMemo(() => generateMoodTimeline(entries), [entries]);
  const moodStats = useMemo(() => getMoodStatistics(entries), [entries]);

  const handleAnalyzeMoods = async () => {
    setLoadingAnalysis(true);
    try {
      const analysis = await analyzeMoodTrends(entries);
      setAiAnalysis(analysis);
      setShowAnalytics(true);
    } catch (error) {
      console.error('[Mood Tracking] Analysis error:', error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-background to-muted">
      <main className="max-w-4xl mx-auto px-4 py-4 pb-8 md:pb-4">
        <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">Mood Tracking</h1>
        <p className="text-sm text-muted-foreground mb-4">Tap a mood and optionally add a note. Your last 7 days are saved on this device.</p>

        {/* Chat-like capture */}
        <div className="bg-card border border-border rounded-xl shadow-neumorphic overflow-hidden">
          <div ref={listRef} className="h-64 overflow-y-auto p-4 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${m.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted text-foreground'}`}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {MOOD_OPTIONS.map((m) => (
                <button key={m.id} onClick={() => pickMood(m.id)} className={`px-3 py-2 rounded-md text-sm border border-border ${todayEntry?.mood === m.id ? 'bg-accent text-accent-foreground' : 'bg-background text-foreground hover:bg-muted'}`}>
                  <span className="mr-1">{m.emoji}</span>{m.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitNote(); }}
                placeholder="Add a short note (optional)"
                className="flex-1 text-sm bg-input border border-border rounded-md px-3 py-2 outline-none"
              />
              <button onClick={submitNote} className="px-3 py-2 bg-accent text-accent-foreground rounded-md text-sm">Save</button>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        {entries.length >= 3 && (
          <div className="mt-6 bg-card border border-border rounded-xl p-4 shadow-neumorphic">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-foreground">Mood Analytics</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyzeMoods}
                disabled={loadingAnalysis}
              >
                {loadingAnalysis ? (
                  <>
                    <Icon name="Loader2" size={14} className="animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={14} className="mr-2" />
                    AI Analysis
                  </>
                )}
              </Button>
            </div>

            {showAnalytics && aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-start gap-2 mb-2">
                  <Icon name="Brain" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {aiAnalysis}
                </p>
              </motion.div>
            )}

            {/* Mood Timeline Chart */}
            {moodTimeline.timeline.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Mood Trend (Last 30 Days)</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodTimeline.timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: 'currentColor', fontSize: 10 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        domain={[0, 5]}
                        tick={{ fill: 'currentColor', fontSize: 10 }}
                        tickFormatter={(value) => {
                          const labels = { 1: 'Down', 2: 'Low', 3: 'Okay', 4: 'Good', 5: 'Great' };
                          return labels[value] || '';
                        }}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px'
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value) => {
                          const labels = { 1: 'Down', 2: 'Low', 3: 'Okay', 4: 'Good', 5: 'Great' };
                          return labels[Math.round(value)] || value;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="var(--primary)" 
                        strokeWidth={2}
                        dot={{ fill: 'var(--primary)', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      moodTimeline.trend === 'improving' ? 'bg-green-500' :
                      moodTimeline.trend === 'declining' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span>Trend: {moodTimeline.trend}</span>
                  </div>
                  <span>Average: {moodTimeline.recentAverage.toFixed(1)}/5</span>
                </div>
              </div>
            )}

            {/* Mood Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {moodStats.percentages.map((stat) => {
                const mood = MOOD_OPTIONS.find(m => m.id === stat.mood);
                return (
                  <div key={stat.mood} className="text-center p-2 bg-background rounded-lg">
                    <div className="text-2xl mb-1">{mood?.emoji || '😐'}</div>
                    <div className="text-xs font-medium text-foreground">{stat.count}</div>
                    <div className="text-xs text-muted-foreground">{stat.percentage}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent history */}
        <div className="mt-6">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-2">Recent</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lastSeven.length === 0 && (
              <div className="text-sm text-muted-foreground">No entries yet.</div>
            )}
            {lastSeven.map((e) => {
              const mood = MOOD_OPTIONS.find((m) => m.id === e.mood);
              return (
                <div key={e.date} className="bg-card border border-border rounded-lg p-3">
                  <div className="text-sm font-medium text-foreground">{e.date}</div>
                  <div className="text-sm mt-1">{mood ? `${mood.emoji} ${mood.label}` : '—'}</div>
                  {e.note && <div className="text-xs text-muted-foreground mt-1">{e.note}</div>}
                </div>
              );
            })}
          </div>
        </div>
  </main>
    </div>
  );
};

export default MoodTracking;


