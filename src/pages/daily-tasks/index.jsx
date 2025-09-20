import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'mintai.tasks.v1';

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const DailyTasks = () => {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [title, setTitle] = useState('');

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todaysTasks = useMemo(() => tasks.filter(t => t.date === todayKey), [tasks, todayKey]);
  const completedCount = todaysTasks.filter(t => t.completed).length;
  const completionPct = todaysTasks.length ? Math.round((completedCount / todaysTasks.length) * 100) : 0;

  const addTask = () => {
    const name = title.trim();
    if (!name) return;
    const newTask = { id: crypto.randomUUID(), date: todayKey, name, completed: false };
    setTasks(prev => [newTask, ...prev]);
    setTitle('');
  };

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div className="bg-gradient-to-br from-background to-muted">
      <main className="max-w-3xl mx-auto px-4 py-4 pb-8 md:pb-4">
        <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">Daily Tasks</h1>
        <p className="text-sm text-muted-foreground mb-4">Create tasks for today and track completion. Progress auto-updates.</p>

        <div className="bg-card border border-border rounded-xl p-4 shadow-neumorphic">
          <div className="flex items-center gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addTask(); }}
              placeholder="Add a new task"
              className="flex-1 text-sm bg-input border border-border rounded-md px-3 py-2 outline-none"
            />
            <button onClick={addTask} className="px-3 py-2 bg-accent text-accent-foreground rounded-md text-sm">Add</button>
          </div>

          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">Today: {completedCount}/{todaysTasks.length} done ({completionPct}%)</div>
            <div className="space-y-2">
              {todaysTasks.length === 0 && <div className="text-sm text-muted-foreground">No tasks yet.</div>}
              {todaysTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between bg-background border border-border rounded-md px-3 py-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} />
                    <span className={`text-sm ${t.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{t.name}</span>
                  </label>
                  <button onClick={() => deleteTask(t.id)} className="text-xs text-destructive">Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
  </main>
    </div>
  );
};

export default DailyTasks;


