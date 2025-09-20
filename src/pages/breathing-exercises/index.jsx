import React, { useEffect, useRef, useState } from 'react';

const patterns = {
  box: { name: 'Box (4-4-4-4)', steps: ['Inhale', 'Hold', 'Exhale', 'Hold'], durations: [4,4,4,4] },
  478: { name: '4-7-8', steps: ['Inhale', 'Hold', 'Exhale'], durations: [4,7,8] },
  equal: { name: 'Equal (5-5)', steps: ['Inhale', 'Exhale'], durations: [5,5] },
};

const BreathingExercises = () => {
  const [patternKey, setPatternKey] = useState('box');
  const [stepIndex, setStepIndex] = useState(0);
  const [remaining, setRemaining] = useState(patterns['box'].durations[0]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const current = patterns[patternKey];

  useEffect(() => {
    setStepIndex(0);
    setRemaining(current.durations[0]);
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patternKey]);

  const tick = () => {
    setRemaining((r) => {
      if (r > 1) return r - 1;
      const nextIndex = (stepIndex + 1) % current.steps.length;
      setStepIndex(nextIndex);
      return current.durations[nextIndex];
    });
  };

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(tick, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, stepIndex, current]);

  const start = () => setRunning(true);
  const pause = () => { setRunning(false); if (timerRef.current) clearInterval(timerRef.current); };
  const stop = () => { pause(); setStepIndex(0); setRemaining(current.durations[0]); };

  const progressPct = 100 - Math.round((remaining / current.durations[stepIndex]) * 100);

  return (
    <div className="min-h-[400px] bg-gradient-to-br from-background to-muted">
      <main className="max-w-4xl mx-auto px-2 py-4 pb-8 md:pb-4">
        <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">Breathing Exercises</h1>
        <p className="text-sm text-muted-foreground mb-4">Guided breathing with calm animations. Choose a pattern and press Start.</p>

        <div className="bg-card border border-border rounded-xl p-6 shadow-neumorphic">
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(patterns).map(([key, p]) => (
              <button key={key} onClick={() => setPatternKey(key)} className={`px-3 py-2 rounded-md text-sm border border-border ${patternKey === key ? 'bg-accent text-accent-foreground' : 'bg-background text-foreground hover:bg-muted'}`}>
                {p.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">{current.steps[stepIndex]}</div>
            <div className="text-5xl font-mono text-foreground my-2">{remaining}s</div>
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full bg-muted" />
              <div className="absolute inset-0 rounded-full bg-accent/80" style={{ clipPath: `inset(${100 - progressPct}% 0 0 0)` }} />
              <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center shadow-neumorphic-md">
                <div className="w-24 h-24 rounded-full bg-accent animate-breathe" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={start} className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">Start</button>
              <button onClick={pause} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">Pause</button>
              <button onClick={stop} className="px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm">Reset</button>
            </div>
          </div>
        </div>
  </main>
    </div>
  );
};

export default BreathingExercises;


