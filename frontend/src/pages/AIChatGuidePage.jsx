import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlinePaperAirplane, HiOutlineChatBubbleOvalLeftEllipsis, 
  HiOutlineUser, HiOutlineSparkles, HiOutlineGlobeAlt
} from 'react-icons/hi2';
import { aiAPI } from '../api';
import { TypingIndicator } from '../components/LoadingSkeleton';

export default function AIChatGuidePage() {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: 'Hello! I am your AI Travel Guide. Where are we heading next? Ask me about destinations, local food, or travel tips!',
      suggestions: ['Best time to visit Japan?', 'Tell me about Bali', 'Travel safety in Europe']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (msg = input) => {
    const text = msg.trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.chat({ message: text });
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: res.data.response,
        suggestions: res.data.suggestions
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container pt-24 h-[calc(100vh-100px)] flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <HiOutlineChatBubbleOvalLeftEllipsis className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">AI Travel <span className="gradient-text">Guide</span></h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Always Active • Expert Knowledge</p>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 glass overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.role === 'ai' ? 'bg-gradient-to-br from-cyan-400 to-blue-500' : 'bg-white/10'
                }`}>
                  {msg.role === 'ai' ? <HiOutlineSparkles className="w-4 h-4" /> : <HiOutlineUser className="w-4 h-4" />}
                </div>
                <div className="space-y-4">
                  <div className={`px-5 py-3 rounded-2xl ${
                    msg.role === 'ai' ? 'glass-strong text-white/90' : 'bg-cyan-500 text-navy-950 font-medium shadow-lg shadow-cyan-500/20'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(s)}
                          className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/40 hover:bg-white/5 hover:text-white transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <HiOutlineSparkles className="w-4 h-4" />
                </div>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-navy-900/50 backdrop-blur-md">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-3 max-w-4xl mx-auto"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your next trip..."
              className="flex-1 input-field !py-3"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="p-3 bg-cyan-500 text-navy-950 rounded-xl hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50"
            >
              <HiOutlinePaperAirplane className="w-6 h-6 transform rotate-45" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
