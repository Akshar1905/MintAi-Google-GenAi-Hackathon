// export function getGeminiApiKey() {
//   // Preferred: Vite env
//   const fromVite = import.meta?.env?.VITE_GEMINI_API_KEY;
//   if (fromVite) return fromVite;

//   // CRA-style env fallback (in case of mixed setups)
//   // @ts-ignore
//   const fromCRA = typeof process !== 'undefined' ? process?.env?.REACT_APP_GEMINI_API_KEY : undefined;
//   if (fromCRA) return fromCRA;

//   // window.env support (some deployments inject env at runtime)
//   // eslint-disable-next-line no-undef
//   const fromWindow = typeof window !== 'undefined' ? (window.env?.VITE_GEMINI_API_KEY || window.env?.REACT_APP_GEMINI_API_KEY) : undefined;
//   if (fromWindow) return fromWindow;

//   // LocalStorage fallback so users can set the key at runtime without rebuild
//   try {
//     const fromLS = typeof localStorage !== 'undefined' ? localStorage.getItem('mintai.gemini.apiKey') : null;
//     if (fromLS) return fromLS;
//   } catch {}

//   return '';
// }


export function getGeminiApiKey() {
  // Preferred: Vite env variable
  let fromVite = import.meta?.env?.VITE_GEMINI_API_KEY;
  
  // Remove quotes if present (Vite sometimes preserves quotes from .env)
  if (fromVite) {
    fromVite = fromVite.toString().replace(/^["']|["']$/g, '').trim();
    if (fromVite && fromVite.length > 0) {
      console.log('[Gemini] Using API key from environment variable');
      return fromVite;
    }
  }

  // LocalStorage fallback so users can set the key at runtime without rebuild
  try {
    const fromLS = typeof localStorage !== 'undefined' ? localStorage.getItem('mintai.gemini.apiKey') : null;
    if (fromLS && fromLS.trim().length > 0) {
      console.log('[Gemini] Using API key from localStorage');
      return fromLS.trim();
    }
  } catch {}

  // Fallback: Hardcoded key (should be replaced with env variable in production)
  // For development/testing only - NOT recommended for production
  const fallbackKey = "AIzaSyBVsX1_kQOuehuPimjoVWlMnVEu9hEWctY";
  console.warn('[Gemini] ⚠️ Using fallback API key. Set VITE_GEMINI_API_KEY in .env file.');
  console.warn('[Gemini] Current env value:', import.meta?.env?.VITE_GEMINI_API_KEY || 'undefined');
  return fallbackKey;
}

/**
 * Generate response using Gemini with conversation history support
 * @param {string} userText - User's message
 * @param {Array} conversationHistory - Array of previous messages with {role: 'user'|'model', parts: [{text: string}]}
 * @param {Object} opts - Options for generation
 * @param {string} opts.model - Model name (default: 'gemini-1.5-flash')
 * @param {number} opts.temperature - Temperature (0-1, default: 0.7)
 * @param {number} opts.maxOutputTokens - Max tokens (default: 512)
 * @param {string} opts.systemInstruction - System instruction/context for the AI
 * @returns {Promise<string>} Generated response
 */
export async function generateGeminiResponse(userText, opts = {}) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY');

  // Valid models: gemini-1.5-pro, gemini-1.5-flash, etc.
  const model = opts.model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Build conversation history
  const contents = [];
  
  // Add conversation history if provided
  if (opts.conversationHistory && Array.isArray(opts.conversationHistory)) {
    contents.push(...opts.conversationHistory);
  }

  // Add current user message
  contents.push({
    role: 'user',
    parts: [{ text: userText }],
  });

  const body = {
    contents,
    generationConfig: {
      temperature: opts.temperature || 0.7,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: opts.maxOutputTokens || 512,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  // Add system instruction if provided (for gemini-1.5-pro/flash)
  if (opts.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: opts.systemInstruction }],
    };
  }

  let res;
  try {
    console.log('[Gemini] Making API request to:', model);
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error('[Gemini] Network error:', e);
    throw new Error(`Network error: ${e.message || 'Failed to connect to Gemini API'}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[Gemini] HTTP error', res.status, text);
    
    // Provide more helpful error messages
    let errorMessage = `Gemini API error (${res.status})`;
    try {
      const errorData = JSON.parse(text);
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (errorData.error) {
        errorMessage = JSON.stringify(errorData.error);
      }
    } catch {}
    
    // Common error cases
    if (res.status === 400) {
      errorMessage = 'Invalid API request. Please check your API key and request format.';
    } else if (res.status === 401 || res.status === 403) {
      errorMessage = 'API key is invalid or has insufficient permissions. Please check your VITE_GEMINI_API_KEY in .env file.';
    } else if (res.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (res.status === 500) {
      errorMessage = 'Gemini API server error. Please try again later.';
    }
    
    throw new Error(errorMessage);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || '';
  if (!text) {
    console.error('[Gemini] Empty response payload', data);
    throw new Error('Empty Gemini response');
  }
  return text;
}

/**
 * Generate caption for an image using Gemini Vision API
 * @param {string} imageBase64 - Base64 encoded image data
 * @param {string} imageMimeType - MIME type (e.g., 'image/jpeg', 'image/png')
 * @param {string} prompt - Optional custom prompt for caption generation
 * @returns {Promise<string>} Generated caption
 */
export async function generateImageCaption(imageBase64, imageMimeType = 'image/jpeg', prompt = null) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY');

  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Enhanced prompt for wellness-focused, emotionally intelligent captions
  const defaultPrompt = `Analyze this image carefully and create an emotionally intelligent, positive, and mindful caption. 

Guidelines:
- Focus on positive emotions, beauty, gratitude, or meaningful moments
- Use warm, empathetic, and encouraging language
- Help the viewer reflect on positivity, mindfulness, or personal growth
- Keep it concise (2-3 sentences, under 100 words)
- Avoid being overly descriptive of technical details
- Focus on the emotional or meaningful aspect of the image
- If the image shows people, focus on connection, joy, or human moments
- If it's nature/scenery, focus on peace, beauty, or perspective
- Make it feel personal and relatable

Write a caption that would uplift someone's mood and help them appreciate the moment.`;

  // Clean base64 data (remove data URL prefix if present)
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
  
  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt || defaultPrompt,
          },
          {
            inlineData: {
              mimeType: imageMimeType,
              data: cleanBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.85, // Slightly higher for more creative, empathetic captions
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 256,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[Gemini Vision] HTTP error', res.status, text);
      
      // Provide more helpful error messages
      let errorMessage = `Gemini Vision API error (${res.status})`;
      try {
        const errorData = JSON.parse(text);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData.error) {
          errorMessage = JSON.stringify(errorData.error);
        }
      } catch {}
      
      // Common error cases
      if (res.status === 400) {
        errorMessage = 'Invalid image or request format.';
      } else if (res.status === 401 || res.status === 403) {
        errorMessage = 'API key is invalid or has insufficient permissions. Please check your VITE_GEMINI_API_KEY in .env file.';
      } else if (res.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (res.status === 500) {
        errorMessage = 'Gemini API server error. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }

    const data = await res.json();
    
    // Handle potential blocking due to safety settings
    if (data?.promptFeedback?.blockReason) {
      console.warn('[Gemini Vision] Content blocked:', data.promptFeedback.blockReason);
      return 'This image contains content that I cannot generate a caption for. Please try another image.';
    }
    
    const caption = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || '';
    
    if (!caption) {
      console.error('[Gemini Vision] Empty response payload', data);
      throw new Error('Empty Gemini Vision response');
    }
    
    return caption.trim();
  } catch (e) {
    console.error('[Gemini Vision] Error:', e);
    throw e;
  }
}

/**
 * Analyze sentiment and emotion from text using Gemini
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Sentiment analysis with emotion, mood, and suggestions
 */
export async function analyzeSentiment(text) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY');

  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `Analyze the emotional tone and sentiment of this text. Respond in JSON format with:
{
  "emotion": "primary emotion (happy/sad/anxious/excited/calm/frustrated)",
  "mood": "overall mood (positive/neutral/negative)",
  "sentimentScore": number between -1 and 1,
  "keywords": ["array", "of", "emotional", "keywords"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Text: "${text}"

Only return valid JSON, no additional text.`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Sentiment analysis failed: ${res.status}`);
    }

    const data = await res.json();
    const responseText = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || '';
    
    try {
      return JSON.parse(responseText);
    } catch {
      // Fallback if JSON parsing fails
      return {
        emotion: 'neutral',
        mood: 'neutral',
        sentimentScore: 0,
        keywords: [],
        suggestions: ['Take a moment to breathe', 'Reflect on what you need right now'],
      };
    }
  } catch (e) {
    console.error('[Sentiment Analysis] Error:', e);
    return {
      emotion: 'neutral',
      mood: 'neutral',
      sentimentScore: 0,
      keywords: [],
      suggestions: [],
    };
  }
}

/**
 * Generate a motivational quote using Gemini
 * @param {string} mood - Optional mood context
 * @returns {Promise<string>} Generated quote
 */
export async function generateMotivationalQuote(mood = null) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY');

  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const moodContext = mood ? ` The user's current mood is: ${mood}.` : '';
  const prompt = `Generate a short, uplifting, and motivational quote or affirmation (maximum 150 words). Make it warm, empathetic, and relevant to mental wellness and personal growth.${moodContext} Return only the quote text, no author name unless it's a well-known quote.`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Quote generation failed: ${res.status}`);
    }

    const data = await res.json();
    const quote = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || '';
    
    return quote || 'You are stronger than you think, and braver than you feel. Keep going.';
  } catch (e) {
    console.error('[Quote Generation] Error:', e);
    return 'You are stronger than you think, and braver than you feel. Keep going.';
  }
}

/**
 * Test Gemini API connection
 * Call this function in browser console to test: testGeminiConnection()
 * @returns {Promise<string>} Test result message
 */
export async function testGeminiConnection() {
  console.log('[Gemini Test] Starting connection test...');
  
  const apiKey = getGeminiApiKey();
  console.log('[Gemini Test] API Key found:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
  
  if (!apiKey) {
    return '❌ ERROR: No API key found. Please set VITE_GEMINI_API_KEY in .env file.';
  }
  
  try {
    const testResponse = await generateGeminiResponse('Say "Hello, Gemini is working!"', {
      model: 'gemini-1.5-flash',
      temperature: 0.5,
      maxOutputTokens: 50
    });
    
    console.log('[Gemini Test] ✅ SUCCESS! Response:', testResponse);
    return `✅ SUCCESS! Gemini API is working.\nResponse: ${testResponse}`;
  } catch (error) {
    console.error('[Gemini Test] ❌ FAILED:', error);
    return `❌ FAILED: ${error.message}\n\nPlease check:\n1. Your API key in .env file\n2. Your internet connection\n3. Browser console for detailed errors`;
  }
}

// Make test function available globally for browser console testing
if (typeof window !== 'undefined') {
  window.testGeminiConnection = testGeminiConnection;
  console.log('%c[Gemini] Test function available!', 'color: #4CAF50; font-weight: bold');
  console.log('%cRun testGeminiConnection() in console to test your API key', 'color: #2196F3;');
}

