import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGeminiResponse } from '../../utils/gemini';

const QuickChatWidget = ({ onOpenFull = () => {} }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mintai.chat.widget.messages')||'[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: 'Hi! I\'m MintChat. How can I help you today?' }]);
    }
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    try { localStorage.setItem('mintai.chat.widget.messages', JSON.stringify(messages)); } catch {}
  }, [messages, open]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content) return;
    setMessages((m) => [...m, { role: 'user', content }]);
    setInput('');
    setLoading(true);
    try {
      // Build conversation history from recent messages (last 6)
      const recentMessages = messages.slice(-6);
      const conversationHistory = recentMessages
        .filter((msg) => msg.content && msg.content.trim())
        .map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

      // System instruction for wellness-focused responses
      const systemInstruction = `You are MintChat, a compassionate mental wellness companion. Provide warm, empathetic, and supportive responses. Keep replies concise (1-2 sentences for quick chat widget).`;

      let reply = null;
      try {
        reply = await generateGeminiResponse(content, {
          conversationHistory: conversationHistory,
          systemInstruction: systemInstruction,
          temperature: 0.8,
          maxOutputTokens: 256,
        });
      } catch (_) {
        // ignore, will fallback
      }
      if (!reply) reply = mockReply(content);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-300">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-80 h-96 bg-card border border-border rounded-xl shadow-neumorphic flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-background border-b border-border">
              <div className="text-sm font-heading text-foreground">MintChat</div>
              <div className="flex items-center gap-2">
                <button className="text-xs text-muted-foreground hover:text-foreground" onClick={onOpenFull}>Open</button>
                <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>Close</button>
              </div>
            </div>
            <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((m, idx) => (
                <div key={idx} className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${m.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted text-foreground'}`}>
                  {m.content}
                </div>
              ))}
              {loading && <div className="text-xs text-muted-foreground">MintChat is typing…</div>}
            </div>
            <div className="p-2 border-t border-border flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                placeholder="Type a message"
                className="flex-1 text-sm bg-input border border-border rounded-md px-3 py-2 outline-none"
              />
              <button onClick={sendMessage} className="px-3 py-2 bg-accent text-accent-foreground rounded-md text-sm">Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-accent text-accent-foreground shadow-neumorphic flex items-center justify-center"
        aria-label="Open MintChat"
      >
        💬
      </motion.button>
    </div>
  );
};

function mockReply(text) {
  if (/breath|stress/i.test(text)) return 'Try a 2-minute box breathing: 4 in, 4 hold, 4 out, 4 hold.';
  if (/task|todo/i.test(text)) return 'You can create a daily task in the Tasks page.';
  return "Here's a helpful tip: small consistent actions lead to big changes.";
}

export default QuickChatWidget;


