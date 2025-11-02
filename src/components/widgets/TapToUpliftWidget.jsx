import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import { getDailyQuote } from '../../utils/quoteApi';
import { getRandomMeme } from '../../utils/memeApi';
import { generateCalmingVisual } from '../../utils/imageGeneration';

const TapToUpliftWidget = () => {
  const [content, setContent] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [loading, setLoading] = useState(false);

  const upliftTypes = ['quote', 'meme', 'visual'];

  const handleUplift = async () => {
    setLoading(true);
    setContent(null);
    setContentType(null);

    // Randomly select uplift type
    const randomType = upliftTypes[Math.floor(Math.random() * upliftTypes.length)];
    setContentType(randomType);

    try {
      switch (randomType) {
        case 'quote':
          const quoteData = await getDailyQuote();
          setContent({ text: quoteData.text, author: quoteData.author, type: 'quote' });
          break;
        
        case 'meme':
          const meme = await getRandomMeme('wholesomememes');
          setContent(meme);
          break;
        
        case 'visual':
          const visual = await generateCalmingVisual('positive');
          setContent(visual);
          break;
        
        default:
          const fallbackQuote = await getDailyQuote();
          setContent({ text: fallbackQuote.text, author: fallbackQuote.author, type: 'quote' });
      }
    } catch (error) {
      console.error('Error generating uplift:', error);
      // Fallback to a simple quote
      setContent({ text: 'You are doing great! Keep going! 🌟', type: 'quote' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6">
      {!content ? (
        <>
          <div className="text-center space-y-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon name="Stars" size={64} className="text-primary mx-auto" />
            </motion.div>
            
            <h3 className="text-xl font-heading font-semibold text-foreground">
              Tap to Uplift
            </h3>
            <p className="text-sm font-body text-muted-foreground max-w-xs">
              Instantly receive a random positive experience: a quote, meme, or calming visual
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="default"
              size="lg"
              onClick={handleUplift}
              disabled={loading}
              className="px-8 py-6 text-lg"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin">
                    <Icon name="Loader2" size={20} />
                  </div>
                  <span>Creating magic...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <Icon name="Zap" size={20} />
                  <span>Tap for Positivity</span>
                </span>
              )}
            </Button>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6 text-center"
        >
          {contentType === 'quote' && (
            <div className="space-y-4">
              <Icon name="MessageSquareQuote" size={48} className="text-primary opacity-30 mx-auto" />
              <p className="text-lg font-body text-foreground leading-relaxed">
                {content.text}
              </p>
              {content.author && (
                <p className="text-sm font-caption text-muted-foreground">
                  — {content.author}
                </p>
              )}
            </div>
          )}

          {contentType === 'meme' && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden shadow-neumorphic-md">
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="bg-muted rounded-lg p-4 border border-border">
                <p className="text-sm font-body text-foreground leading-relaxed">
                  {content.caption}
                </p>
              </div>
            </div>
          )}

          {contentType === 'visual' && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden shadow-neumorphic-md">
                <img
                  src={content.imageUrl}
                  alt="Calming visual"
                  className="w-full h-64 object-cover"
                />
              </div>
              <p className="text-sm font-body text-muted-foreground">
                {content.prompt}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="default"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={handleUplift}
              disabled={loading}
            >
              Another One
            </Button>
            <Button
              variant="ghost"
              iconName="X"
              onClick={() => {
                setContent(null);
                setContentType(null);
              }}
            >
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TapToUpliftWidget;

