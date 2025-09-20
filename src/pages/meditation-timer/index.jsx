import React, { useState, useRef, useEffect } from 'react';

const MeditationTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => { setIsRunning(false); setSeconds(0); };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="bg-gradient-to-br from-background to-muted">
      <main className="max-w-4xl mx-auto px-4 py-4 pb-8 md:pb-4">
        <h1 className="text-2xl font-heading font-semibold text-foreground mb-4">Mindful Meditation</h1>
        <p className="text-sm text-muted-foreground mb-6">Simple timer with start, pause, and reset.</p>
        <div className="bg-card border border-border rounded-xl p-6 shadow-neumorphic max-w-md">
          <div className="text-center mb-6">
            <div className="text-5xl font-mono text-foreground tracking-wider">{mm}:{ss}</div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={handleStart} className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Start</button>
            <button onClick={handlePause} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground">Pause</button>
            <button onClick={handleReset} className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground">Reset</button>
          </div>
        </div>
  </main>
    </div>
  );
};

export default MeditationTimer;


