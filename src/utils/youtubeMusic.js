/**
 * YouTube Music API integration for mood-based music recommendations
 * Uses YouTube Data API v3 to search for music based on mood
 */

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

// Mood-based search queries for YouTube
const moodSearchQueries = {
  happy: ['upbeat happy music', 'positive vibes', 'feel good songs', 'happy playlist'],
  sad: ['calming music', 'emotional healing', 'sad songs comfort', 'peaceful melodies'],
  anxious: ['meditation music', 'calm anxiety', 'relaxing sounds', 'stress relief music'],
  calm: ['peaceful music', 'ambient sounds', 'zen music', 'mindfulness music'],
  excited: ['energetic music', 'pump up songs', 'high energy', 'motivation music'],
  neutral: ['chill music', 'background music', 'lo-fi beats', 'relaxing music'],
};

// Fallback recommendations if API fails
const fallbackMusicMap = {
  happy: [
    { title: 'Upbeat Vibes', artist: 'Happy Beats', videoId: 'jfKfPfyJRdk', genre: 'Lo-Fi' },
    { title: 'Sunshine Days', artist: 'Joyful Sounds', videoId: '5qap5aO4i9A', genre: 'Ambient' },
  ],
  sad: [
    { title: 'Gentle Rain', artist: 'Calm Melodies', videoId: 'jfKfPfyJRdk', genre: 'Ambient' },
    { title: 'Healing Tones', artist: 'Peaceful Music', videoId: '5qap5aO4i9A', genre: 'Instrumental' },
  ],
  anxious: [
    { title: 'Meditation Flow', artist: 'Zen Sounds', videoId: 'jfKfPfyJRdk', genre: 'Ambient' },
    { title: 'Breathing Space', artist: 'Calm Collective', videoId: '5qap5aO4i9A', genre: 'Meditation' },
  ],
  calm: [
    { title: 'Peaceful Morning', artist: 'Calm Sounds', videoId: 'jfKfPfyJRdk', genre: 'Ambient' },
    { title: 'Mindful Moments', artist: 'Zen Music', videoId: '5qap5aO4i9A', genre: 'Meditation' },
  ],
  excited: [
    { title: 'Energy Boost', artist: 'Upbeat Mix', videoId: 'jfKfPfyJRdk', genre: 'Electronic' },
    { title: 'Pump Up', artist: 'Energy Music', videoId: '5qap5aO4i9A', genre: 'Dance' },
  ],
  neutral: [
    { title: 'Background Vibes', artist: 'Chill Beats', videoId: 'jfKfPfyJRdk', genre: 'Lo-Fi' },
    { title: 'Soft Focus', artist: 'Ambient Sounds', videoId: '5qap5aO4i9A', genre: 'Ambient' },
  ],
};

/**
 * Get YouTube music recommendation based on mood using YouTube Data API
 * Falls back to mock data if API key is missing or fails
 * @param {string} emotion - Emotion type (happy, sad, anxious, etc.)
 * @param {number} sentimentScore - Sentiment score (-1 to 1)
 * @returns {Promise<Object>} Music recommendation object
 */
export async function getYouTubeRecommendations(emotion = 'neutral', sentimentScore = 0) {
  // Map sentiment to emotion if emotion is not specific
  let mappedEmotion = emotion.toLowerCase();
  
  if (sentimentScore > 0.5) {
    mappedEmotion = 'happy';
  } else if (sentimentScore > 0.2) {
    mappedEmotion = 'calm';
  } else if (sentimentScore < -0.3) {
    mappedEmotion = 'sad';
  } else if (sentimentScore < -0.1) {
    mappedEmotion = 'anxious';
  }

  // If no API key, use fallback
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === '') {
    console.warn('[YouTube API] No API key provided, using fallback recommendations');
    return getMusicRecommendation(mappedEmotion, sentimentScore);
  }

  try {
    // Get random search query for the mood
    const queries = moodSearchQueries[mappedEmotion] || moodSearchQueries.neutral;
    const searchQuery = queries[Math.floor(Math.random() * queries.length)];

    console.log('[YouTube API] Searching for:', searchQuery);

    const url = new URL(YOUTUBE_API_URL);
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('q', `${searchQuery} music`);
    url.searchParams.append('type', 'video');
    url.searchParams.append('videoCategoryId', '10'); // Music category
    url.searchParams.append('maxResults', '10');
    url.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      // Pick a random video from results
      const randomVideo = data.items[Math.floor(Math.random() * data.items.length)];
      const snippet = randomVideo.snippet;
      
      return {
        title: snippet.title,
        artist: snippet.channelTitle,
        videoId: randomVideo.id.videoId,
        genre: mappedEmotion,
        mood: mappedEmotion,
        thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
        description: snippet.description,
      };
    }
    
    throw new Error('No videos found');
  } catch (error) {
    console.warn('[YouTube API] Failed to fetch from YouTube, using fallback:', error.message);
    
    // Fallback to mock data
    return getMusicRecommendation(mappedEmotion, sentimentScore);
  }
}

/**
 * Get music recommendation (synchronous fallback version)
 * @param {string} emotion - Emotion type (happy, sad, anxious, etc.)
 * @param {number} sentimentScore - Sentiment score (-1 to 1)
 * @returns {Object} Music recommendation object
 */
export function getMusicRecommendation(emotion = 'neutral', sentimentScore = 0) {
  // Map sentiment to emotion if emotion is not specific
  let mappedEmotion = emotion.toLowerCase();
  
  if (sentimentScore > 0.5) {
    mappedEmotion = 'happy';
  } else if (sentimentScore > 0.2) {
    mappedEmotion = 'calm';
  } else if (sentimentScore < -0.3) {
    mappedEmotion = 'sad';
  } else if (sentimentScore < -0.1) {
    mappedEmotion = 'anxious';
  }

  const songs = fallbackMusicMap[mappedEmotion] || fallbackMusicMap.neutral;
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  
  return {
    ...randomSong,
    mood: mappedEmotion,
    thumbnail: `https://img.youtube.com/vi/${randomSong.videoId}/hqdefault.jpg`,
  };
}

/**
 * Generate YouTube embed URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} Embed URL
 */
export function getYouTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
}

/**
 * Generate YouTube watch URL
 * @param {string} videoId - YouTube video ID
 * @returns {string} Watch URL
 */
export function getYouTubeWatchUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

