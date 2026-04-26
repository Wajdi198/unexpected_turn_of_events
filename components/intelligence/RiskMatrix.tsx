'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Landmark, Users, Search, 
  Settings, Leaf, Handshake, Briefcase 
} from 'lucide-react';

interface RiskMatrixProps {
  matrix: Record<string, Record<string, number>>;
  institutions: any[];
}

const domains = [
  { name: 'Academic', icon: BookOpen },
  { name: 'Finance', icon: Landmark },
  { name: 'HR', icon: Users },
  { name: 'Research', icon: Search },
  { name: 'Infrastructure', icon: Settings },
  { name: 'ESG', icon: Leaf },
  { name: 'Partnerships', icon: Handshake },
  { name: 'Employment', icon: Briefcase },
];

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ matrix, institutions }) => {
  const getRiskColor = (score: number) => {
    if (score <= 30) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20';
    if (score <= 60) return 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20';
    if (score <= 80) return 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20';
    return 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30 animate-pulse';
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Network Risk Matrix</h2>
          <p className="text-sm text-slate-500 mt-1">5 institutions × 8 KPI domains · Real-time anomaly scoring</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Healthy</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Critical</span>
           </div>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-[140px_repeat(8,1fr)] mb-4">
            <div />
            {domains.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <d.icon size={16} className="text-slate-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{d.name}</span>
              </div>
            ))}
          </div>

          {/* Data Rows */}
          <div className="space-y-3">
            {institutions.map((inst) => (
              <div key={inst.id} className="grid grid-cols-[140px_repeat(8,1fr)] items-center">
                <div className="text-sm font-bold text-slate-300 pr-4">{inst.short_name}</div>
                {domains.map((d, i) => {
                  const score = matrix[inst.id]?.[d.name] || 0;
                  return (
                    <div key={i} className="px-1">
                      <div className={cn(
                        "h-12 rounded-xl border flex items-center justify-center text-sm font-black transition-all cursor-pointer",
                        getRiskColor(score)
                      )}>
                        {score}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-slate-950/50 p-4 border-t border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-center">
        3 critical risk areas detected · 7 medium risk areas · 30 healthy
      </div>
    </div>
  );
};
