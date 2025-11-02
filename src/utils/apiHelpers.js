/**
 * API Helpers Index
 * Centralized exports for all API helper functions
 */

// Gemini API
export {
  getGeminiApiKey,
  generateGeminiResponse,
  generateImageCaption,
  analyzeSentiment,
  generateMotivationalQuote,
  testGeminiConnection,
} from './gemini';

// Quote API
export {
  getDailyQuote,
  getMultipleQuotes,
} from './quoteApi';

// Meme API
export {
  getRandomMeme,
  getMemesByCategory,
  getMemeCategories,
} from './memeApi';

// YouTube Music API
export {
  getYouTubeRecommendations,
  getMusicRecommendation,
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
} from './youtubeMusic';

// Helper function aliases for backward compatibility
export const getGeminiResponse = generateGeminiResponse;

