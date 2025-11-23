import React, { useState, useRef, useEffect } from 'react';
import { Send, Scale, Search, ExternalLink } from 'lucide-react';
import { Message } from '../types';
import { getTaxAdvice } from '../services/geminiService';

const TaxChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: 'Hello. I am your Regulatory Assistant. I can help you with Tax Laws, GST, IFRS/GAAP standards, and recent amendments. I use Google Search to provide up-to-date information.' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for API (excluding the latest user message which is passed as prompt)
      // Filter out error messages or internal states if any
      const history = messages
        .filter(m => m.id !== 'welcome') // Simple filtering for this demo
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const response = await getTaxAdvice(userMsg.text, history);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I couldn't generate a response.",
        groundingSources: response.sources
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I encountered an error connecting to the regulation database. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-brand-600" />
          <h2 className="font-semibold text-slate-800">Regulatory & Tax Assistant</h2>
        </div>
        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full flex items-center">
          <Search className="w-3 h-3 mr-1" /> Grounded with Search
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'}
            `}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              
              {/* Grounding Sources */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingSources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2 py-1 rounded transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        {source.title || 'Source'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Section 80C, GST rates on services, etc..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 transition-colors flex items-center justify-center min-w-[3rem]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxChat;