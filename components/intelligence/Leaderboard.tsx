'use client';

import React, { useState } from 'react';
import { Trophy, Medal, ChevronRight, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  data: any[];
  dimensions: string[];
  activeDimension: string;
  onDimensionChange: (dim: string) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  data, dimensions, activeDimension, onDimensionChange 
}) => {
  const top3 = data.slice(0, 3);
  const others = data.slice(3);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-white">Performance Leaderboard</h2>
          <p className="text-sm text-slate-500 mt-1">Composite scores across 4 strategic dimensions</p>
        </div>
        
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {dimensions.map(dim => (
            <button
              key={dim}
              onClick={() => onDimensionChange(dim)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeDimension === dim ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {dim.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {/* Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
          {/* Silver (Rank 2) */}
          <div className="order-2 md:order-1 flex flex-col items-center">
            <div className="bg-slate-800 border border-slate-700 w-full p-6 rounded-2xl text-center space-y-3 relative">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-slate-900 font-black text-xs">2</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{top3[1]?.short_name}</div>
               <div className="text-3xl font-black text-white">{top3[1]?.score}</div>
            </div>
            <div className="w-full h-8 bg-slate-800/20 mt-1 rounded-b-xl" />
          </div>

          {/* Gold (Rank 1) */}
          <div className="order-1 md:order-2 flex flex-col items-center scale-110 md:scale-125 z-10">
            <div className="bg-indigo-600/10 border-2 border-indigo-500 w-full p-8 rounded-3xl text-center space-y-3 relative shadow-2xl shadow-indigo-500/20">
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 font-black text-sm animate-bounce">
                 <Trophy size={16} />
               </div>
               <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{top3[0]?.short_name}</div>
               <div className="text-4xl font-black text-white">{top3[0]?.score}</div>
               <div className="text-[8px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Network Leader</div>
            </div>
            <div className="w-full h-4 mt-2" />
          </div>

          {/* Bronze (Rank 3) */}
          <div className="order-3 flex flex-col items-center">
            <div className="bg-slate-800 border border-slate-700 w-full p-6 rounded-2xl text-center space-y-3 relative">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-700 rounded-full flex items-center justify-center text-white font-black text-xs">3</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{top3[2]?.short_name}</div>
               <div className="text-3xl font-black text-white">{top3[2]?.score}</div>
            </div>
            <div className="w-full h-4 bg-slate-800/10 mt-1 rounded-b-xl" />
          </div>
        </div>

        {/* Others */}
        <div className="space-y-3">
          {others.map((item, i) => (
            <div key={item.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-500">{i + 4}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-200">{item.short_name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{item.name}</div>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <div className="h-1.5 w-24 bg-slate-900 rounded-full overflow-hidden">
                     <div className="h-full bg-slate-700 rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                  <div className="text-xl font-black text-slate-400 group-hover:text-white transition-colors">{item.score}</div>
                  <ChevronRight size={16} className="text-slate-800 group-hover:text-slate-400 transition-all" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
