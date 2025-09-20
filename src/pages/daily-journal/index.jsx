import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'mintai.journal.v1';

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

const DailyJournal = () => {
  const [entries, setEntries] = useState(() => loadEntries());
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => { saveEntries(entries); }, [entries]);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const createEntry = () => {
    if (!title.trim() && !body.trim()) return;
    const entry = {
      id: crypto.randomUUID(),
      date: todayKey,
      title: title.trim() || 'Untitled',
      body: body.trim(),
      updatedAt: new Date().toISOString(),
    };
    setEntries(prev => [entry, ...prev]);
    setTitle('');
    setBody('');
    setSelectedId(entry.id);
  };

  const updateSelected = () => {
    if (!selectedId) return;
    setEntries(prev => prev.map(e => e.id === selectedId ? { ...e, title: title.trim() || e.title, body: body.trim(), updatedAt: new Date().toISOString() } : e));
    setTitle('');
    setBody('');
    setSelectedId(null);
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setTitle('');
      setBody('');
    }
  };

  const startEdit = (id) => {
    const e = entries.find(x => x.id === id);
    if (!e) return;
    setSelectedId(id);
    setTitle(e.title);
    setBody(e.body);
  };

  return (
    <div className="min-h-[400px] bg-gradient-to-br from-background to-muted">
      <main className="max-w-5xl mx-auto px-2 py-4 pb-8 md:pb-4">
        <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">Daily Journal</h1>
        <p className="text-sm text-muted-foreground mb-4">Capture your thoughts. Entries are saved on this device.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-card border border-border rounded-xl p-4 shadow-neumorphic">
            <div className="flex flex-col gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="text-base bg-input border border-border rounded-md px-3 py-2 outline-none"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your thoughts..."
                rows={10}
                className="text-sm bg-input border border-border rounded-md px-3 py-2 outline-none"
              />
              <div className="flex items-center gap-2">
                {!selectedId && (
                  <button onClick={createEntry} className="px-3 py-2 bg-accent text-accent-foreground rounded-md text-sm">Save</button>
                )}
                {selectedId && (
                  <>
                    <button onClick={updateSelected} className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">Update</button>
                    <button onClick={() => { setSelectedId(null); setTitle(''); setBody(''); }} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">Cancel</button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-neumorphic">
            <div className="text-sm text-muted-foreground mb-2">Recent Entries</div>
            <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
              {entries.length === 0 && <div className="text-sm text-muted-foreground">No entries yet.</div>}
              {entries.map(e => (
                <div key={e.id} className="bg-background border border-border rounded-md p-3">
                  <div className="text-xs text-muted-foreground">{e.date}</div>
                  <div className="text-sm font-medium text-foreground">{e.title}</div>
                  {e.body && <div className="text-xs text-muted-foreground line-clamp-2">{e.body}</div>}
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => startEdit(e.id)} className="text-xs text-foreground">Edit</button>
                    <button onClick={() => deleteEntry(e.id)} className="text-xs text-destructive">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  </main>
    </div>
  );
};

export default DailyJournal;
