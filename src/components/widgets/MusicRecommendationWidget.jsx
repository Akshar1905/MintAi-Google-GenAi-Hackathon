import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from '../ui/Button';
import { analyzeSentiment } from '../../utils/gemini';
import { getYouTubeRecommendations, getYouTubeWatchUrl } from '../../utils/youtubeMusic';

const MusicRecommendationWidget = ({ chatHistory = null }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');

  useEffect(() => {
    // Analyze sentiment from chat history if available
    if (chatHistory && chatHistory.length > 0) {
      analyzeMoodAndRecommend();
    } else {
      // Load default recommendation
      loadDefaultRecommendation();
    }
  }, [chatHistory]);

  const analyzeMoodAndRecommend = async () => {
    setLoading(true);
    try {
      // Get recent messages
      const recentMessages = chatHistory.slice(-3).map(msg => msg.content).join(' ');
      
      // Analyze sentiment
      const sentiment = await analyzeSentiment(recentMessages);
      setCurrentMood(sentiment.emotion || 'neutral');
      
      // Get YouTube music recommendation based on sentiment
      const music = await getYouTubeRecommendations(sentiment.emotion, sentiment.sentimentScore);
      setRecommendation(music);
    } catch (error) {
      console.error('Error analyzing mood:', error);
      loadDefaultRecommendation();
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultRecommendation = async () => {
    const music = await getYouTubeRecommendations('neutral', 0);
    setRecommendation(music);
  };

  const handleRefresh = () => {
    if (chatHistory && chatHistory.length > 0) {
      analyzeMoodAndRecommend();
    } else {
      loadDefaultRecommendation();
    }
  };

  if (!recommendation) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin">
          <Icon name="Loader2" size={32} className="text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6">
      <div className="text-center">
        <Icon name="Music" size={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Mood-Based Music
        </h3>
        <p className="text-xs font-caption text-muted-foreground">
          Based on your {currentMood} mood
        </p>
      </div>

      {loading ? (
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin">
            <Icon name="Loader2" size={32} className="text-primary" />
          </div>
          <p className="text-sm font-body text-muted-foreground">
            Analyzing your mood...
          </p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 rounded-full overflow-hidden shadow-neumorphic-md border-2 border-primary/20"
          >
            <Image
              src={recommendation.thumbnail}
              alt={recommendation.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="text-center space-y-2">
            <h4 className="text-lg font-heading font-semibold text-foreground">
              {recommendation.title}
            </h4>
            <p className="text-sm font-body text-muted-foreground">
              {recommendation.artist}
            </p>
            <span className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-caption text-muted-foreground">
              {recommendation.genre}
            </span>
          </div>

          <div className="flex items-center justify-center space-x-4 w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
            >
              <Icon name="RefreshCw" size={20} />
            </Button>
            
            <Button
              variant="default"
              size="icon"
              className="w-12 h-12"
              onClick={() => {
                window.open(getYouTubeWatchUrl(recommendation.videoId), '_blank');
              }}
            >
              <Icon name="Play" size={24} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                window.open(getYouTubeWatchUrl(recommendation.videoId), '_blank');
              }}
            >
              <Icon name="ExternalLink" size={20} />
            </Button>
          </div>

          <p className="text-xs font-caption text-muted-foreground text-center max-w-xs">
            Tap play to listen on YouTube Music
          </p>
        </>
      )}
    </div>
  );
};

export default MusicRecommendationWidget;

