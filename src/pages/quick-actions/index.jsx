import React from 'react';
import TopNavigation from '../../components/ui/TopNavigation';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import { useNavigate } from 'react-router-dom';
import PageFadeIn from '../../components/ui/PageFadeIn';

const ActionCard = ({ title, description, onClick }) => (
  <button onClick={onClick} className="bg-card border border-border rounded-xl p-4 text-left shadow-neumorphic hover:shadow-neumorphic-md transition-all">
    <div className="text-sm text-muted-foreground">Quick Action</div>
    <div className="text-lg font-heading text-foreground">{title}</div>
    <div className="text-xs text-muted-foreground mt-1">{description}</div>
  </button>
);

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <TopNavigation />
      <main className="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
        <PageFadeIn>
        <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">Quick Wellness Actions</h1>
        <p className="text-sm text-muted-foreground mb-4">Do something helpful in 2 minutes or less.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard title="2-min Breathing" description="Center yourself fast" onClick={() => navigate('/breathing')} />
          <ActionCard title="Mood Check" description="How are you feeling?" onClick={() => navigate('/mood')} />
          <ActionCard title="Focus Music" description="Open a focus playlist" onClick={() => window.open('https://www.youtube.com/watch?v=hHW1oY26kxQ','_blank')} />
          <ActionCard title="Sleep Story" description="Wind down gently" onClick={() => window.open('https://www.youtube.com/results?search_query=sleep+story','_blank')} />
          <ActionCard title="Book Suggestion" description="Curated reads" onClick={() => window.open('https://www.goodreads.com/shelf/show/mindfulness','_blank')} />
          <ActionCard title="Open Chat" description="Ask MintChat for tips" onClick={() => navigate('/mint-chat-full-screen')} />
        </div>
        </PageFadeIn>
      </main>
      <BottomTabNavigation />
    </div>
  );
};

export default QuickActions;


