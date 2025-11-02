import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import { generateGeminiResponse } from '../../utils/gemini';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const DailyWellnessSummaryWidget = () => {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      generateWellnessSummary();
    }
  }, [currentUser]);

  const generateWellnessSummary = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      // Collect user data from localStorage and Firestore
      const today = new Date().toISOString().slice(0, 10);
      const userId = currentUser.uid;

      // Get mood entries (from localStorage for now, can be migrated to Firestore)
      const moodEntries = JSON.parse(localStorage.getItem('mintai.moodEntries.v1') || '[]');
      const recentMoods = moodEntries.slice(0, 7);

      // Get journal entries
      const journalEntries = JSON.parse(localStorage.getItem('mintai.journal.v1') || '[]');
      const recentJournals = journalEntries.slice(0, 5);

      // Get chat history (if available)
      const chatMessages = JSON.parse(localStorage.getItem('mintai.chat.full.messages') || '[]');
      const recentChats = chatMessages.filter(m => m.isUser).slice(-10);

      // Build context for Gemini
      const context = {
        date: today,
        recentMoods: recentMoods.map(e => ({
          date: e.date,
          mood: e.mood,
          note: e.note || ''
        })),
        recentJournalCount: recentJournals.length,
        recentJournalTitles: recentJournals.map(e => e.title).filter(Boolean),
        chatActivity: recentChats.length
      };

      const prompt = `Analyze this user's wellness data and create a personalized daily wellness summary.

User Data:
- Date: ${context.date}
- Recent Mood Entries (last 7 days): ${JSON.stringify(context.recentMoods)}
- Journal Entries: ${context.recentJournalCount} entries
- Journal Topics: ${context.recentJournalTitles.join(', ') || 'None'}
- Chat Activity: ${context.chatActivity} messages

Create a warm, supportive, and personalized daily wellness summary that:
1. Acknowledges their emotional patterns (if data available)
2. Highlights positive trends or improvements
3. Offers gentle encouragement
4. Suggests 2-3 actionable wellness tips for today
5. Keeps it concise (3-4 paragraphs max)
6. Uses an empathetic, Gen-Z friendly tone

Format as a friendly message that feels like a caring friend checking in.`;

      const summaryText = await generateGeminiResponse(prompt, {
        model: 'gemini-1.5-flash',
        temperature: 0.8,
        maxOutputTokens: 512
      });

      setSummary(summaryText);
    } catch (err) {
      console.error('[Wellness Summary] Error:', err);
      setError('Unable to generate summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <Icon name="User" size={48} className="text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Please sign in to view your wellness summary</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-muted/20 rounded-xl overflow-hidden p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Sparkles" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Daily Wellness Summary</h3>
            <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateWellnessSummary}
          disabled={loading}
          className="text-xs h-8 px-3"
        >
          <Icon name="RefreshCw" size={14} className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Icon name="Loader2" size={32} className="text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground">Generating your wellness summary...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          {!loading && !error && summary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {summary}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Info" size={14} />
                <span>Summary is AI-generated based on your recent activity</span>
              </div>
            </motion.div>
          )}

          {!loading && !error && !summary && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Generate your daily wellness summary</p>
              <Button onClick={generateWellnessSummary} variant="default" size="sm">
                Generate Summary
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyWellnessSummaryWidget;

