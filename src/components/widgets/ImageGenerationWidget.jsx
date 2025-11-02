import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from '../ui/Button';
import { generateCalmingVisual, generateUpliftingVideo } from '../../utils/imageGeneration';
import { analyzeSentiment } from '../../utils/gemini';

const ImageGenerationWidget = ({ mood = null, chatHistory = null }) => {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState('image'); // 'image' or 'video'

  const detectMood = async () => {
    if (mood) return mood;
    
    if (chatHistory && chatHistory.length > 0) {
      try {
        const recentMessages = chatHistory.slice(-3).map(msg => msg.content).join(' ');
        const sentiment = await analyzeSentiment(recentMessages);
        return sentiment.emotion || 'neutral';
      } catch (error) {
        console.error('Error detecting mood:', error);
      }
    }
    
    return 'neutral';
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    setContentType('image');
    
    try {
      const detectedMood = await detectMood();
      const visual = await generateCalmingVisual(detectedMood);
      setGeneratedContent(visual);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setContentType('video');
    
    try {
      const detectedMood = await detectMood();
      const video = await generateUpliftingVideo(detectedMood);
      setGeneratedContent(video);
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6">
      <div className="text-center">
        <Icon name="Sparkles" size={48} className="text-primary mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          AI Visual Therapy
        </h3>
        <p className="text-xs font-caption text-muted-foreground">
          AI-generated visuals to uplift your mood
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="inline-block animate-spin">
            <Icon name="Loader2" size={32} className="text-primary" />
          </div>
          <p className="text-sm font-body text-muted-foreground">
            Creating your {contentType}...
          </p>
        </div>
      ) : generatedContent ? (
        <>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md space-y-4"
          >
            <div className="relative rounded-lg overflow-hidden shadow-neumorphic-md">
              <Image
                src={generatedContent.imageUrl || generatedContent.thumbnailUrl}
                alt="AI Generated Visual"
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border">
              <p className="text-xs font-caption text-muted-foreground mb-2">
                Generated for: {generatedContent.mood} mood
              </p>
              <p className="text-sm font-body text-foreground">
                {generatedContent.prompt}
              </p>
            </div>
          </motion.div>

          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={contentType === 'image' ? handleGenerateImage : handleGenerateVideo}
            >
              Generate New
            </Button>
            <Button
              variant="ghost"
              iconName="Share2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'MintAi Generated Visual',
                    text: generatedContent.prompt,
                  });
                }
              }}
            >
              Share
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <Button
              variant="default"
              onClick={handleGenerateImage}
              className="flex flex-col items-center space-y-2 h-24"
            >
              <Icon name="Image" size={32} />
              <span className="text-sm">Generate Image</span>
            </Button>
            <Button
              variant="default"
              onClick={handleGenerateVideo}
              className="flex flex-col items-center space-y-2 h-24"
            >
              <Icon name="Video" size={32} />
              <span className="text-sm">Generate Video</span>
            </Button>
          </div>
          
          <p className="text-xs font-caption text-muted-foreground text-center max-w-xs">
            Create calming visuals based on your current mood
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageGenerationWidget;

