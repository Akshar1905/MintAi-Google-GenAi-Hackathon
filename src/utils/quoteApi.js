/**
 * Quote API integration for daily inspirational quotes
 * Uses ZenQuotes API as primary source with Gemini as fallback
 */

import { generateMotivationalQuote } from './gemini';

const QUOTE_API_URL = import.meta.env.VITE_QUOTE_API || 'https://zenquotes.io/api/random';

/**
 * Get a daily inspirational quote from ZenQuotes API
 * Falls back to Gemini-generated quote if API fails
 * @param {string} mood - Optional mood context for quote generation
 * @returns {Promise<Object>} Quote object with { text, author }
 */
export async function getDailyQuote(mood = null) {
  try {
    console.log('[Quote API] Fetching quote from ZenQuotes...');
    
    const response = await fetch(QUOTE_API_URL);
    
    if (!response.ok) {
      throw new Error(`Quote API error: ${response.status}`);
    }

    const data = await response.json();
    
    // ZenQuotes returns: [{ q: "quote text", a: "author" }]
    if (Array.isArray(data) && data.length > 0) {
      const quote = data[0];
      return {
        text: quote.q || quote.quote,
        author: quote.a || quote.author || 'Unknown',
      };
    }
    
    throw new Error('Invalid response format from ZenQuotes API');
  } catch (error) {
    console.warn('[Quote API] Failed to fetch from ZenQuotes, using Gemini fallback:', error.message);
    
    // Fallback to Gemini-generated quote
    try {
      const geminiQuote = await generateMotivationalQuote(mood);
      
      // Try to extract author if mentioned
      const authorMatch = geminiQuote.match(/—\s*(.+?)$|—(.+?)$/);
      if (authorMatch) {
        return {
          text: geminiQuote.replace(/—\s*.+?$/, '').trim(),
          author: authorMatch[1] || authorMatch[2],
        };
      }
      
      return {
        text: geminiQuote,
        author: null,
      };
    } catch (geminiError) {
      console.error('[Quote API] Gemini fallback also failed:', geminiError);
      
      // Final fallback
      return {
        text: 'You are stronger than you think, and braver than you feel. Keep going.',
        author: null,
      };
    }
  }
}

/**
 * Get multiple quotes (for variety)
 * @param {number} count - Number of quotes to fetch
 * @returns {Promise<Array>} Array of quote objects
 */
export async function getMultipleQuotes(count = 3) {
  const promises = Array.from({ length: count }, () => getDailyQuote());
  return Promise.all(promises);
}

