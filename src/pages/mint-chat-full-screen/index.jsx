import React, { useState, useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';
import QuickReplyChips from './components/QuickReplyChips';
import { generateGeminiResponse, analyzeSentiment } from '../../utils/gemini';

const MintChatFullScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(1);

  // Mock AI responses for different wellness topics
  const aiResponses = {
    anxiety: [
      `I understand you're feeling anxious right now. That's completely valid, and I'm here to help. Let's try a simple grounding technique together.\n\nCan you name 5 things you can see around you right now?`,
      `Anxiety can feel overwhelming, but remember that this feeling is temporary. You've gotten through difficult moments before, and you can get through this one too.\n\nWould you like to try some deep breathing exercises with me?`,
      `Thank you for sharing that with me. Anxiety is your mind's way of trying to protect you, even when there's no immediate danger.\n\nLet's work on some coping strategies. What usually helps you feel more grounded?`
    ],
    motivation: [
      `I hear that you need some motivation today. Remember, even small steps forward are still progress. You don't have to climb the whole mountain today - just take the next step.\n\nWhat's one small thing you can accomplish right now that would make you feel good?`,
      `Motivation often comes after action, not before it. Sometimes we need to start moving before we feel ready.\n\nWhat's something you've been putting off that you could spend just 5 minutes on today?`,
      `You're stronger than you think, and you've overcome challenges before. Today might feel difficult, but you have the resilience to handle whatever comes your way.\n\nWhat's one thing you're grateful for right now?`
    ],
    checkin: [
      `I'm glad you're taking time for your daily check-in. Self-awareness is such an important part of wellness.\n\nOn a scale of 1-10, how are you feeling emotionally right now? And what's contributing to that feeling?`,
      `Thank you for prioritizing your mental health with this check-in. It shows real self-care.\n\nWhat's been the highlight of your day so far? And is there anything that's been challenging?`,`Daily check-ins are a wonderful habit. You're investing in your wellbeing.\n\nHow has your energy been today? And what's one thing you're looking forward to?`
    ],
    breathing: [
      `Breathing exercises are a powerful tool for calming your nervous system. Let's do this together.\n\nFirst, find a comfortable position. Now, breathe in slowly through your nose for 4 counts... hold for 4... and exhale through your mouth for 6 counts.\n\nLet's repeat this 3 more times. Ready?`,
      `Great choice! Focused breathing can help reset your mind and body. Here's a simple technique:\n\nInhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. This is called the 4-7-8 technique.\n\nShall we try it together? I'll guide you through each breath.`,
      `Breathing exercises are like a reset button for your nervous system. Let's try box breathing:\n\nBreathe in for 4, hold for 4, breathe out for 4, hold for 4. Imagine tracing the sides of a box as you breathe.\n\nReady to give it a try?`
    ],
    gratitude: [
      `Gratitude practice is such a beautiful way to shift our perspective. Research shows it can actually rewire our brains for more positivity.\n\nWhat are three things, big or small, that you're grateful for today?`,
      `I love that you want to practice gratitude! It's one of the most powerful tools for mental wellness.\n\nLet's start simple: Can you think of one person in your life you're thankful for, and why?`,
      `Gratitude practice can transform how we see our days. Even in difficult times, there are often small moments of goodness.\n\nWhat's something that made you smile recently, even if just for a moment?`
    ],
    sleep: [
      `Sleep troubles can be really frustrating. Good sleep is so important for our mental health and overall wellbeing.\n\nWhat's been making it difficult for you to sleep? Is it racing thoughts, physical discomfort, or something else?`,
      `I understand how challenging sleep issues can be. Let's work on creating better conditions for rest.\n\nHave you tried a wind-down routine before bed? Things like dimming lights, avoiding screens, or doing some gentle stretches can help signal to your body that it's time to sleep.`,
      `Sleep difficulties are more common than you might think, and there are many strategies we can try.\n\nWhat does your current bedtime routine look like? And what time do you usually try to go to sleep?`
    ],
    default: [
      `Thank you for sharing that with me. I'm here to listen and support you through whatever you're experiencing.\n\nCan you tell me a bit more about what's on your mind today?`,
      `I appreciate you opening up to me. Your feelings and experiences are valid, and it's okay to not be okay sometimes.\n\nWhat would be most helpful for you right now - would you like to talk through what you're feeling, or would you prefer some coping strategies?`,
      `I'm glad you reached out. Sometimes just expressing what we're going through can be the first step toward feeling better.\n\nWhat's been weighing on your mind lately?`
    ]
  };

  // Load persisted chat or initialize with welcome
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mintai.chat.full.messages');
      if (raw) {
        const data = JSON.parse(raw);
        setMessages(data);
        const maxId = data.reduce((m, x) => Math.max(m, Number(x.id)||0), 0);
        setMessageIdCounter(maxId + 1);
        return;
      }
    } catch {}
    const welcomeMessage = {
      id: 1,
      content: `Hello! I'm MintChat, your personal wellness companion. I'm here to support you through whatever you're experiencing today.\n\nHow are you feeling right now? You can share what's on your mind or use the quick options below to get started.`,
      isUser: false,
      timestamp: new Date(),
      status: 'delivered'
    };
    setMessages([welcomeMessage]);
    setMessageIdCounter(2);
  }, []);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem('mintai.chat.full.messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const getAIResponse = (userMessage) => {
    const message = userMessage?.toLowerCase();
    
    if (message?.includes('anxious') || message?.includes('anxiety') || message?.includes('worried') || message?.includes('nervous')) {
      return aiResponses?.anxiety?.[Math.floor(Math.random() * aiResponses?.anxiety?.length)];
    } else if (message?.includes('motivation') || message?.includes('motivated') || message?.includes('energy') || message?.includes('lazy')) {
      return aiResponses?.motivation?.[Math.floor(Math.random() * aiResponses?.motivation?.length)];
    } else if (message?.includes('check-in') || message?.includes('checkin') || message?.includes('daily')) {
      return aiResponses?.checkin?.[Math.floor(Math.random() * aiResponses?.checkin?.length)];
    } else if (message?.includes('breathing') || message?.includes('breathe') || message?.includes('breath')) {
      return aiResponses?.breathing?.[Math.floor(Math.random() * aiResponses?.breathing?.length)];
    } else if (message?.includes('gratitude') || message?.includes('grateful') || message?.includes('thankful')) {
      return aiResponses?.gratitude?.[Math.floor(Math.random() * aiResponses?.gratitude?.length)];
    } else if (message?.includes('sleep') || message?.includes('sleeping') || message?.includes('insomnia') || message?.includes('tired')) {
      return aiResponses?.sleep?.[Math.floor(Math.random() * aiResponses?.sleep?.length)];
    } else {
      return aiResponses?.default?.[Math.floor(Math.random() * aiResponses?.default?.length)];
    }
  };

  const handleSendMessage = async (messageContent) => {
    // Add user message
    const userMessage = {
      id: messageIdCounter,
      content: messageContent,
      isUser: true,
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageIdCounter(prev => prev + 1);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Update status while waiting
      setMessages(prev => prev?.map(msg => msg?.id === userMessage?.id ? { ...msg, status: 'delivered' } : msg));
      setMessages(prev => prev?.map(msg => msg?.id === userMessage?.id ? { ...msg, status: 'read' } : msg));

      // Analyze sentiment for more empathetic response
      let sentimentAnalysis = null;
      try {
        sentimentAnalysis = await analyzeSentiment(messageContent);
      } catch (err) {
        console.warn('[MintChat] Sentiment analysis failed:', err);
      }

      // Build conversation history from recent messages (last 10 exchanges)
      // Convert messages to Gemini format: {role: 'user'|'model', parts: [{text: string}]}
      const recentMessages = messages.slice(-10); // Last 10 messages for context
      const conversationHistory = recentMessages
        .filter(msg => msg.content && msg.content.trim()) // Filter out empty messages
        .map(msg => ({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

      // System instruction for wellness-focused AI companion
      const systemInstruction = `You are MintChat, a compassionate and empathetic mental wellness companion. Your role is to:
- Provide emotional support and understanding
- Offer practical wellness strategies and coping techniques
- Listen actively and validate feelings
- Suggest appropriate self-care activities (breathing exercises, journaling, meditation, etc.)
- Maintain a warm, non-judgmental, and encouraging tone
- Remember context from previous messages in the conversation
- Never provide medical advice or diagnose conditions
- If someone expresses serious mental health concerns, gently suggest professional help

Keep responses conversational, supportive, and typically 2-4 sentences unless the user asks for more detail. Focus on empowerment and positive coping strategies.`;

      // Build enhanced prompt with emotion context
      let enhancedPrompt = messageContent;
      if (sentimentAnalysis) {
        enhancedPrompt = `[User emotion: ${sentimentAnalysis.emotion}, mood: ${sentimentAnalysis.mood}]
${messageContent}`;
      }

      let apiText = null;
      try {
        apiText = await generateGeminiResponse(enhancedPrompt, { 
          model: 'gemini-1.5-flash',
          conversationHistory: conversationHistory,
          systemInstruction: systemInstruction,
          temperature: 0.8, // Slightly higher for more empathetic responses
          maxOutputTokens: 512
        });
      } catch (err) {
        console.warn('[MintChat] Gemini call failed, using fallback:', err?.message || err);
      }
      const fullText = apiText || getAIResponse(messageContent);

      // Streaming type effect
      const newId = messageIdCounter + 1;
      setMessages(prev => [...prev, { id: newId, content: '', isUser: false, timestamp: new Date(), status: 'delivered' }]);
      setMessageIdCounter(prev => prev + 2);
      let i = 0;
      const interval = setInterval(() => {
        i += 2;
        setMessages(prev => prev.map(m => m.id === newId ? { ...m, content: fullText.slice(0, i) } : m));
        if (i >= fullText.length) clearInterval(interval);
      }, 20);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (message) => {
    handleSendMessage(message);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-muted/20">
      <ChatHeader />
      
      <ChatContainer 
        messages={messages}
        isTyping={isTyping}
      />
      
      <QuickReplyChips 
        onQuickReply={handleQuickReply}
        disabled={isTyping}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  );
};

export default MintChatFullScreen;