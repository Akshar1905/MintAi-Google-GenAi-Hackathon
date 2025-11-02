/**
 * Meme API integration for uplifting meme content
 * Uses meme-api.com for fetching random memes
 */

const MEME_API_URL = import.meta.env.VITE_MEME_API || 'https://meme-api.com/gimme';

// Fallback curated positive memes in case API fails
const positiveMemes = [
  {
    id: 1,
    title: 'You Got This!',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    caption: 'When Monday hits but you remember you survived last Monday too',
    category: 'Motivation',
  },
  {
    id: 2,
    title: 'Progress!',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Me: I haven\'t accomplished anything today. Also me: I woke up, got out of bed, and kept myself alive. That\'s something!',
    category: 'Self-Care',
  },
  {
    id: 3,
    title: 'Small Wins',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    caption: 'Remember: Every expert was once a beginner. Every pro was once an amateur.',
    category: 'Growth',
  },
  {
    id: 4,
    title: 'Be Kind',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop',
    caption: 'You\'re doing better than you think you are. Keep going!',
    category: 'Encouragement',
  },
  {
    id: 5,
    title: 'Mindfulness Moment',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=400&fit=crop',
    caption: 'Your mental health is more important than your grades, your job, your social life. Take care of yourself.',
    category: 'Wellness',
  },
  {
    id: 6,
    title: 'Self-Love',
    imageUrl: 'https://images.unsplash.com/photo-1534367507877-d2fed8d563f6?w=400&h=400&fit=crop',
    caption: 'Treat yourself with the same kindness you would treat a friend.',
    category: 'Self-Compassion',
  },
];

/**
 * Get a random meme from the meme-api.com API
 * Falls back to curated list if API fails
 * @param {string} subreddit - Optional subreddit to fetch from (e.g., 'wholesomememes', 'MadeMeSmile')
 * @returns {Promise<Object>} Meme object with { title, imageUrl, caption, category }
 */
export async function getRandomMeme(subreddit = null) {
  try {
    // Build API URL with optional subreddit filter
    let apiUrl = MEME_API_URL;
    if (subreddit) {
      // meme-api.com supports subreddit parameter: /gimme/{subreddit}
      apiUrl = `${MEME_API_URL.replace('/gimme', '')}/gimme/${subreddit}`;
    }

    console.log('[Meme API] Fetching meme from:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Meme API error: ${response.status}`);
    }

    const data = await response.json();
    
    // meme-api.com returns: { postLink, subreddit, title, url, ... }
    return {
      id: Date.now(),
      title: data.title || 'Funny Meme',
      imageUrl: data.url || data.preview?.[data.preview.length - 1],
      caption: data.title || 'Hope this makes you smile! 😊',
      category: data.subreddit || 'Meme',
      postLink: data.postLink,
      subreddit: data.subreddit,
    };
  } catch (error) {
    console.warn('[Meme API] Failed to fetch from API, using fallback:', error.message);
    
    // Fallback to curated positive memes
    const randomIndex = Math.floor(Math.random() * positiveMemes.length);
    return positiveMemes[randomIndex];
  }
}

/**
 * Get memes by category
 * @param {string} category - Meme category
 * @returns {Array} Array of meme objects
 */
export function getMemesByCategory(category) {
  return positiveMemes.filter(meme => meme.category.toLowerCase() === category.toLowerCase());
}

/**
 * Get all available meme categories
 * @returns {Array} Array of category names
 */
export function getMemeCategories() {
  const categories = [...new Set(positiveMemes.map(meme => meme.category))];
  return categories;
}

