/**
 * Wellness Analytics Utilities
 * Functions for analyzing user wellness data using Gemini AI
 */

import { generateGeminiResponse } from './gemini';

/**
 * Generate mood trend analysis from mood entries
 * @param {Array} moodEntries - Array of mood entries with {date, mood, note}
 * @returns {Promise<string>} Analysis text
 */
export async function analyzeMoodTrends(moodEntries) {
  if (!moodEntries || moodEntries.length === 0) {
    return 'No mood data available yet. Start tracking your mood to see insights!';
  }

  const prompt = `Analyze these mood entries and provide insights:

Mood Entries:
${JSON.stringify(moodEntries, null, 2)}

Provide:
1. Overall mood pattern (trending up/down/stable)
2. Most common moods
3. Any notable patterns or triggers
4. Gentle suggestions for improvement (if needed)

Keep it warm, supportive, and concise (2-3 paragraphs).`;

  try {
    const analysis = await generateGeminiResponse(prompt, {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxOutputTokens: 384
    });
    return analysis;
  } catch (error) {
    console.error('[Mood Trends] Error:', error);
    return 'Unable to analyze mood trends at the moment.';
  }
}

/**
 * Generate journal entry summary using Gemini
 * @param {Array} journalEntries - Array of journal entries
 * @param {number} days - Number of days to analyze
 * @returns {Promise<string>} Summary text
 */
export async function summarizeJournalEntries(journalEntries, days = 7) {
  if (!journalEntries || journalEntries.length === 0) {
    return 'No journal entries to summarize yet. Start journaling to see insights!';
  }

  const recentEntries = journalEntries.slice(0, days);
  
  const prompt = `Summarize these journal entries and provide emotional insights:

Journal Entries (last ${days} days):
${recentEntries.map(e => `[${e.date}] ${e.title || 'Untitled'}: ${e.body?.substring(0, 200) || 'No content'}`).join('\n\n')}

Provide:
1. Key themes and emotions expressed
2. Positive highlights and growth moments
3. Areas of concern or stress
4. Encouraging insights about their journey

Keep it empathetic, warm, and supportive (3-4 paragraphs).`;

  try {
    const summary = await generateGeminiResponse(prompt, {
      model: 'gemini-1.5-flash',
      temperature: 0.8,
      maxOutputTokens: 512
    });
    return summary;
  } catch (error) {
    console.error('[Journal Summary] Error:', error);
    return 'Unable to generate journal summary at the moment.';
  }
}

/**
 * Generate visual mood timeline data
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Object} Chart-ready data
 */
export function generateMoodTimeline(moodEntries) {
  const moodValues = {
    'great': 5,
    'good': 4,
    'okay': 3,
    'low': 2,
    'down': 1
  };

  const last30Days = moodEntries.slice(0, 30);
  
  // Group by date and calculate average mood
  const dailyMoods = {};
  last30Days.forEach(entry => {
    if (!dailyMoods[entry.date]) {
      dailyMoods[entry.date] = [];
    }
    dailyMoods[entry.date].push(moodValues[entry.mood] || 3);
  });

  // Create timeline data
  const timeline = Object.entries(dailyMoods).map(([date, values]) => {
    const avgMood = values.reduce((a, b) => a + b, 0) / values.length;
    return {
      date,
      mood: avgMood,
      count: values.length
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate trends
  const recentMoods = timeline.slice(-7).map(t => t.mood);
  const olderMoods = timeline.slice(-14, -7).map(t => t.mood);
  
  const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length || 3;
  const olderAvg = olderMoods.reduce((a, b) => a + b, 0) / olderMoods.length || 3;
  
  const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';

  return {
    timeline,
    trend,
    recentAverage: recentAvg,
    olderAverage: olderAvg,
    totalEntries: last30Days.length
  };
}

/**
 * Get mood statistics
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Object} Statistics
 */
export function getMoodStatistics(moodEntries) {
  const moodCounts = {
    'great': 0,
    'good': 0,
    'okay': 0,
    'low': 0,
    'down': 0
  };

  moodEntries.forEach(entry => {
    if (moodCounts.hasOwnProperty(entry.mood)) {
      moodCounts[entry.mood]++;
    }
  });

  const total = moodEntries.length;
  const percentages = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  }));

  const mostCommon = percentages.reduce((max, curr) => 
    curr.count > max.count ? curr : max, percentages[0] || { mood: 'okay', count: 0 }
  );

  return {
    total,
    moodCounts,
    percentages,
    mostCommon
  };
}

