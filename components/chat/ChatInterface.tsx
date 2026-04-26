import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  data?: any[];
  visualization?: 'table' | 'bar_chart' | 'line_chart' | 'single_value' | 'none';
}

interface ChatInterfaceProps {
  externalInput?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ externalInput }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalInput) {
      handleSend(externalInput);
    }
  }, [externalInput]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const trimmedInput = text.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmedInput }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to get answer');

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        sql: data.sql,
        data: data.data,
        visualization: data.visualization,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to get answer from AI');
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "Désolé, je n'ai pas pu traiter votre question. Réessayez." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 scroll-smooth"
        style={{ minHeight: '60vh' }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center border border-indigo-500/20">
              <Sparkles className="text-indigo-400" size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-100">Ask anything about UCARiq</h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                UCARiq understands natural language and queries the database in real-time.
              </p>
            </div>
          </div>
        ) : (
          messages.map((m, i) => <MessageBubble key={i} message={m} />)
        )}
        
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="bg-slate-900 border-l-4 border-l-indigo-500 border border-slate-800 rounded-2xl rounded-tl-none p-5 flex items-center gap-3">
              <Loader2 size={16} className="text-indigo-400 animate-spin" />
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-950 border-t border-slate-800">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask in French or English... e.g. 'Quelles institutions dǸpassent 95% du budget?'"
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/50 rounded-2xl px-5 py-4 pr-16 text-slate-200 placeholder:text-slate-600 focus:ring-4 focus:ring-indigo-500/5 focus:outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-lg active:scale-95"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
        <div className="mt-3 text-[10px] text-slate-600 text-center uppercase tracking-[0.2em] font-semibold">
          Secure Read-Only AI Query Engine
        </div>
      </div>
    </div>
  );
};
