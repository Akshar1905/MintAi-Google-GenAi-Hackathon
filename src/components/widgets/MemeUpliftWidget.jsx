import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from '../ui/Button';
import { getRandomMeme } from '../../utils/memeApi';

const MemeUpliftWidget = () => {
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMeme = async () => {
    setLoading(true);
    try {
      // Try wholesome memes first, fallback to general
      const meme = await getRandomMeme('wholesomememes');
      setMeme(meme);
    } catch (error) {
      console.error('Error loading meme:', error);
      // Fallback to general memes
      try {
        const meme = await getRandomMeme();
        setMeme(meme);
      } catch (fallbackError) {
        console.error('Fallback meme load failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6">
      {loading ? (
        <div className="space-y-4">
          <div className="inline-block animate-spin">
            <Icon name="Loader2" size={32} className="text-primary" />
          </div>
          <p className="text-sm font-body text-muted-foreground">
            Loading something to make you smile...
          </p>
        </div>
      ) : meme ? (
        <>
          <div className="text-center">
            <Icon name="Smile" size={48} className="text-primary mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Remember to Laugh
            </h3>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md space-y-4"
          >
            <div className="relative rounded-lg overflow-hidden shadow-neumorphic-md">
              <Image
                src={meme.imageUrl}
                alt={meme.title}
                className="w-full h-48 object-cover"
              />
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border">
              <p className="text-sm font-body text-foreground leading-relaxed">
                {meme.caption}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/20 rounded-full text-xs font-caption text-primary">
                {meme.category}
              </span>
            </div>
          </motion.div>

          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="default"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={loadMeme}
            >
              Another One
            </Button>
            <Button
              variant="ghost"
              iconName="Share2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: meme.title,
                    text: meme.caption,
                  });
                }
              }}
            >
              Share
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default MemeUpliftWidget;

