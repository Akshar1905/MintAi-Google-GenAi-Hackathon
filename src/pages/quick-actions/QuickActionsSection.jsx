import React from 'react';

const ActionCard = ({ title, description, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="bg-card border border-border rounded-xl p-4 text-left shadow-neumorphic hover:shadow-neumorphic-md transition-all block">
    <div className="text-sm text-muted-foreground">Quick Action</div>
    <div className="text-lg font-heading text-foreground">{title}</div>
    <div className="text-xs text-muted-foreground mt-1">{description}</div>
  </a>
);

const QuickActionsSection = () => (
  <div>
    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Quick Wellness Actions</h3>
    <p className="text-sm text-muted-foreground mb-4">Do something helpful in 2 minutes or less.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ActionCard title="2-min Breathing" description="Center yourself fast" url="/breathing" />
      <ActionCard title="Mood Check" description="How are you feeling?" url="/mood" />
      <ActionCard title="Focus Music" description="Open a focus playlist" url="https://www.youtube.com/watch?v=hHW1oY26kxQ" />
      <ActionCard title="Sleep Story" description="Wind down gently" url="https://www.youtube.com/results?search_query=sleep+story" />
      <ActionCard title="Book Suggestion" description="Curated reads" url="https://www.goodreads.com/shelf/show/mindfulness" />
      <ActionCard title="Open Chat" description="Ask MintChat for tips" url="/mint-chat-full-screen" />
    </div>
  </div>
);

export default QuickActionsSection;
