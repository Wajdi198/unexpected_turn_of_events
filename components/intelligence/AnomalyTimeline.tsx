'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AnomalyTimelineProps {
  alerts: any[];
  institutions: any[];
}

export const AnomalyTimeline: React.FC<AnomalyTimelineProps> = ({ alerts, institutions }) => {
  const quarters = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4'];
  
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      case 'high': return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
      case 'medium': return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      <div className="p-8 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">Anomaly Detection Timeline</h2>
        <p className="text-sm text-slate-500 mt-1">Spatio-temporal mapping of network alerts</p>
      </div>

      <div className="p-8">
        <div className="relative overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Quarter Headers */}
            <div className="grid grid-cols-[140px_repeat(4,1fr)] mb-8">
              <div />
              {quarters.map(q => (
                <div key={q} className="text-center">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{q}</div>
                  <div className="h-px bg-slate-800 mt-2 w-full" />
                </div>
              ))}
            </div>

            {/* Institution Lanes */}
            <div className="space-y-8 relative">
               {/* Vertical Grid Lines */}
               <div className="absolute inset-0 grid grid-cols-[140px_repeat(4,1fr)] pointer-events-none opacity-20">
                  <div />
                  {[1, 2, 3, 4].map(i => <div key={i} className="border-r border-slate-700 h-full last:border-0" />)}
               </div>

               {institutions.map(inst => (
                 <div key={inst.id} className="grid grid-cols-[140px_repeat(4,1fr)] items-center h-12">
                   <div className="text-xs font-bold text-slate-400">{inst.short_name}</div>
                   {quarters.map(q => {
                     // Filter alerts for this institution and quarter
                     const qAlerts = alerts.filter(a => a.institution_id === inst.id && (a.period === q || a.title.includes(q)));
                     
                     return (
                       <div key={q} className="flex justify-center gap-1 relative z-10">
                         {qAlerts.length > 0 ? (
                           qAlerts.slice(0, 3).map((a, i) => (
                             <div 
                               key={a.id}
                               className={cn(
                                 "w-3 h-3 rounded-full cursor-pointer hover:scale-150 transition-transform",
                                 getSeverityStyles(a.severity)
                               )}
                               title={`${a.severity.toUpperCase()}: ${a.title}`}
                             />
                           ))
                         ) : (
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                         )}
                         {qAlerts.length > 3 && <span className="text-[8px] text-slate-600">+{qAlerts.length - 3}</span>}
                       </div>
                     );
                   })}
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
           <div className="flex gap-6">
              {[
                { label: 'Critical', color: 'bg-red-500' },
                { label: 'High', color: 'bg-orange-500' },
                { label: 'Medium', color: 'bg-amber-500' },
                { label: 'Healthy', color: 'bg-slate-800' }
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                   <div className={cn("w-2 h-2 rounded-full", l.color)} />
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{l.label}</span>
                </div>
              ))}
           </div>
           <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">
             Total Network Events: {alerts.length}
           </div>
        </div>
      </div>
    </div>
  );
};
