'use client';

import React, { useState } from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopBar } from '@/components/dashboard/TopBar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ExampleQuestions } from '@/components/chat/ExampleQuestions';
import { Toaster } from 'sonner';

export default function ChatPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | undefined>(undefined);

  const handleSelectQuestion = (q: string) => {
    // Resetting and setting the question triggers the useEffect in ChatInterface
    setSelectedQuestion(undefined);
    setTimeout(() => setSelectedQuestion(q), 0);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <SidebarNav activePage="chat" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Ask UCARiq" 
          subtitle="Natural language analytics across all UCAR institutions" 
        />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 h-full min-h-[700px]">
              
              {/* Chat Interface Column */}
              <div className="lg:col-span-6 flex flex-col h-full">
                <ChatInterface externalInput={selectedQuestion} />
              </div>

              {/* Sidebar/Examples Column */}
              <div className="lg:col-span-4 space-y-6">
                <ExampleQuestions onSelect={handleSelectQuestion} />
                
                {/* Stats/Info Card */}
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">How it works</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    UCARiq uses a custom-trained LLM to translate your questions into optimized SQL queries. 
                    The results are then processed and visualized in real-time using our live data warehouse.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-slate-200">25+</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-tighter">KPI Metrics</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-slate-200">Live</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Supabase Sync</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}
