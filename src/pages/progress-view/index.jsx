import React, { useMemo } from 'react';

const ProgressView = () => {
  const tasks = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('mintai.tasks.v1') || '[]'); } catch { return []; }
  }, []);
  const moods = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('mintai.moodEntries.v1') || '[]'); } catch { return []; }
  }, []);

  const byDate = useMemo(() => {
    const map = new Map();
    for (const t of tasks) {
      const d = t.date;
      const m = map.get(d) || { total: 0, done: 0 };
      m.total += 1; if (t.completed) m.done += 1;
      map.set(d, m);
    }
    return map;
  }, [tasks]);

  const streak = useMemo(() => {
    // count consecutive days with at least 1 completed task
    let count = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      const d = byDate.get(key);
      if (d && d.done > 0) count += 1; else break;
    }
    return count;
  }, [byDate]);

  const last7Keys = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      arr.push(d.toISOString().slice(0,10));
    }
    return arr;
  }, []);

  const weekCompleted = useMemo(() => last7Keys.reduce((sum, k) => sum + (byDate.get(k)?.done || 0), 0), [last7Keys, byDate]);
  const weekTotal = useMemo(() => last7Keys.reduce((sum, k) => sum + (byDate.get(k)?.total || 0), 0), [last7Keys, byDate]);
  const weekPct = weekTotal ? Math.round((weekCompleted / weekTotal) * 100) : 0;

  // Simple badges
  const badges = useMemo(() => {
    const list = [];
    if (streak >= 7) list.push({ id: 'weekly-warrior', name: 'Weekly Warrior', desc: '7+ day activity streak' });
    if (weekCompleted >= 10) list.push({ id: 'task-titan', name: 'Task Titan', desc: '10+ tasks done this week' });
    if (moods.length >= 5) list.push({ id: 'gratitude-guru', name: 'Gratitude Guru', desc: '5+ mood reflections' });
    if (streak >= 14) list.push({ id: 'meditation-master', name: 'Meditation Master', desc: 'Consistent practice for 2+ weeks' });
    return list;
  }, [streak, weekCompleted, moods]);

  return (
    <div className="min-h-[400px] bg-gradient-to-br from-background to-muted">
      <main className="max-w-5xl mx-auto px-2 py-4 pb-8 md:pb-4">
        <h1 className="text-2xl font-heading font-semibold text-foreground mb-4">Progress</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-neumorphic">
            <div className="text-sm text-muted-foreground">Current Streak</div>
            <div className="text-3xl font-heading text-foreground mt-2">{streak} days</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-neumorphic md:col-span-2">
            <div className="text-sm text-muted-foreground">Recent Task Completion</div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3">
              {[...byDate.entries()].slice(0,5).map(([date, d]) => (
                <div key={date} className="bg-background border border-border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">{date}</div>
                  <div className="text-lg font-heading">{d.done}/{d.total}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-card border border-border rounded-xl p-4 shadow-neumorphic">
          <div className="text-sm text-muted-foreground">Recent Mood Pattern</div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3">
            {moods.slice(0,5).map((e) => (
              <div key={e.date} className="bg-background border border-border rounded-lg p-3">
                <div className="text-xs text-muted-foreground">{e.date}</div>
                <div className="text-sm">{e.mood || '—'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="mt-6 bg-card border border-border rounded-xl p-4 shadow-neumorphic">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Badges</div>
            <div className="text-xs text-muted-foreground">Weekly completion: {weekPct}%</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.length === 0 && <div className="text-sm text-muted-foreground">No badges yet — keep going!</div>}
            {badges.map(b => (
              <div key={b.id} className="px-3 py-2 rounded-full bg-accent/10 text-accent text-xs border border-accent/30">
                <span className="font-medium">{b.name}</span>
                <span className="ml-2 text-muted-foreground">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
  </main>
    </div>
  );
};

export default ProgressView;


