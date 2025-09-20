import React, { useEffect, useMemo, useRef, useState } from 'react';

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


