import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import { getDailyQuote } from '../../utils/quoteApi';

const MotivationalQuoteWidget = ({ mood = null }) => {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    loadQuote();
  }, [mood]);

  const loadQuote = async () => {
    setLoading(true);
    try {
      const quoteData = await getDailyQuote(mood);
      setQuote(quoteData.text);
      setAuthor(quoteData.author);
    } catch (error) {
      console.error('Error loading quote:', error);
      setQuote('You are stronger than you think, and braver than you feel. Keep going.');
      setAuthor(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6 text-center">
      {loading ? (
        <div className="space-y-4">
          <div className="inline-block animate-spin">
            <Icon name="Loader2" size={32} className="text-primary" />
          </div>
          <p className="text-sm font-body text-muted-foreground">
            Generating your daily quote...
          </p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Icon name="MessageSquareQuote" size={64} className="text-primary opacity-20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md space-y-4"
          >
            <p className="text-lg font-body text-foreground leading-relaxed">
              {quote}
            </p>
            
            {author && (
              <p className="text-sm font-caption text-muted-foreground">
                — {author}
              </p>
            )}
          </motion.div>

          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={loadQuote}
              disabled={loading}
            >
              New Quote
            </Button>
            <Button
              variant="ghost"
              iconName="Share2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'MintAi Daily Quote',
                    text: quote,
                  });
                } else {
                  navigator.clipboard.writeText(quote);
                }
              }}
            >
              Share
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MotivationalQuoteWidget;

