import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import { generateGeminiResponse, analyzeSentiment } from '../../utils/gemini';

const MintChatWidget = ({ onOpenFull = null }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load persisted chat or initialize with welcome
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mintai.chat.widget.messages');
      if (raw) {
        const data = JSON.parse(raw);
        setMessages(data);
        const maxId = data.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0);
        setMessageIdCounter(maxId + 1);
        return;
      }
    } catch {}

    const welcomeMessage = {
      id: 1,
      content: `Hi! I'm MintChat, your wellness companion. How can I support you today?`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setMessageIdCounter(2);
  }, []);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem('mintai.chat.widget.messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;

    // Add user message
    const userMessage = {
      id: messageIdCounter,
      content: messageContent.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageIdCounter((prev) => prev + 1);
    setInput('');
    setLoading(true);

    try {
      // Analyze sentiment for more empathetic response
      let sentimentAnalysis = null;
      try {
        sentimentAnalysis = await analyzeSentiment(messageContent);
      } catch (err) {
        console.warn('[MintChat Widget] Sentiment analysis failed:', err);
      }

      // Build conversation history from recent messages (last 6 for widget)
      const recentMessages = messages.slice(-6);
      const conversationHistory = recentMessages
        .filter((msg) => msg.content && msg.content.trim())
        .map((msg) => ({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.content }],
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

Keep responses conversational, supportive, and concise (1-3 sentences for widget format). Focus on empowerment and positive coping strategies.`;

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
          temperature: 0.8,
          maxOutputTokens: 256, // Shorter for widget
        });
      } catch (err) {
        console.warn('[MintChat Widget] Gemini call failed, using fallback:', err?.message || err);
        // Fallback response
        apiText = getFallbackResponse(messageContent);
      }

      const fullText = apiText || getFallbackResponse(messageContent);

      // Add AI response
      const aiMessage = {
        id: messageIdCounter + 1,
        content: fullText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setMessageIdCounter((prev) => prev + 2);
    } catch (error) {
      console.error('[MintChat Widget] Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdCounter + 1,
          content: "I'm sorry, I'm having trouble responding right now. Please try again or open full chat for more options.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('anxious') || msg.includes('anxiety')) {
      return "I understand anxiety can feel overwhelming. Try taking 3 deep breaths - inhale for 4, hold for 4, exhale for 4. You've got this.";
    } else if (msg.includes('sad') || msg.includes('depressed')) {
      return "I'm sorry you're feeling this way. Your feelings are valid. Would you like to try journaling or speaking with someone you trust?";
    } else if (msg.includes('stress') || msg.includes('stressed')) {
      return "Stress is tough. Let's try a quick 2-minute breathing exercise or a short walk. What sounds manageable right now?";
    } else if (msg.includes('tired') || msg.includes('exhausted')) {
      return "It sounds like you could use some rest. Self-care isn't selfish - consider taking a break or doing something gentle you enjoy.";
    }
    return "Thank you for sharing. I'm here to support you. Would you like to talk more about what's on your mind, or try a wellness activity?";
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (input.trim() && !loading) {
      handleSendMessage(input);
    }
  };

  const handleOpenFull = () => {
    if (onOpenFull) {
      onOpenFull();
    } else {
      // Navigate to full screen chat
      navigate('/mint-chat-full-screen');
    }
  };

  const handleQuickReplies = [
    'How are you feeling?',
    'I need support',
    'Suggest a breathing exercise',
    'Help me relax',
  ];

  return (
    <div className="w-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-muted/20 overflow-hidden" style={{ minHeight: '400px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/50 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Bot" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground">MintChat</h3>
            <p className="text-xs text-muted-foreground">AI Wellness Companion</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenFull}
          className="text-xs h-7 px-2"
        >
          <Icon name="Maximize2" size={12} className="mr-1" />
          Full
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: '300px', maxHeight: '400px' }}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Icon name="Loader2" size={14} className="animate-spin" />
            <span>MintChat is thinking...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 1 && (
        <div className="px-4 pt-2 pb-3 border-t border-border/50">
          <div className="flex flex-wrap gap-2">
            {handleQuickReplies.map((reply, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(reply)}
                disabled={loading}
                className="text-xs h-7 px-2"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 pb-3 pt-2 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 text-sm bg-input border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            maxLength={500}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || loading}
            className="h-9 px-4"
          >
            <Icon name="Send" size={14} />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send • Click "Full" for expanded chat
        </p>
      </div>
    </div>
  );
};

export default MintChatWidget;

