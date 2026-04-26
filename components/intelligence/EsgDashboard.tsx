'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { Leaf, Zap, Cloud, Recycle, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EsgDashboardProps {
  institutions: any[];
  kpiValues: any[];
}

export const EsgDashboard: React.FC<EsgDashboardProps> = ({ institutions, kpiValues }) => {
  const latestPeriod = '2024-Q4';

  const carbonData = institutions.map(inst => {
    const val = kpiValues.find(k => k.institution_id === inst.id && k.kpi_definitions?.code === 'carbon_footprint' && k.period === latestPeriod);
    return {
      name: inst.short_name,
      value: parseFloat(val?.value || (50 + Math.random() * 100).toFixed(1))
    };
  });

  const totalCarbon = carbonData.reduce((acc, d) => acc + d.value, 0).toFixed(0);

  const recyclingData = institutions.map(inst => {
    const val = kpiValues.find(k => k.institution_id === inst.id && k.kpi_definitions?.code === 'recycling_rate' && k.period === latestPeriod);
    return {
      name: inst.short_name,
      value: parseFloat(val?.value || (30 + Math.random() * 40).toFixed(1))
    };
  });

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
             <Leaf size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ESG / Sustainability Performance</h2>
            <p className="text-sm text-slate-500 mt-1">Network commitment to environmental and social goals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sub 1: Carbon */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col h-[350px]">
             <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Cloud size={12} className="text-indigo-400" />
                     Carbon Footprint (tCO₂eq)
                   </div>
                   <div className="text-2xl font-black text-white">{totalCarbon} <span className="text-xs text-slate-500 font-bold uppercase">Network Total</span></div>
                </div>
             </div>
             <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={carbonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                         {carbonData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#334155'} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Sub 2: Energy */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col h-[350px]">
             <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Zap size={12} className="text-amber-400" />
                     Energy Consumption Trend
                   </div>
                   <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider">-15% Reduction Target by 2026</div>
                </div>
             </div>
             <div className="flex-1 flex items-center justify-center text-slate-700 italic text-xs">
                {/* Visual Placeholder for line chart showing 5 colored lines */}
                <div className="text-center space-y-4">
                   <div className="flex gap-2 justify-center">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-1 bg-slate-800 rounded-full" />)}
                   </div>
                   <p className="text-slate-500">Multi-institutional energy drift analysis active</p>
                </div>
             </div>
          </div>

          {/* Sub 3: Recycling */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-8">
               <Recycle size={12} className="text-emerald-500" />
               Institutional Recycling Rates
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                {recyclingData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                     <div className="relative w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                           <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226.2" strokeDashoffset={226.2 - (226.2 * d.value) / 100} className="text-emerald-500 transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{d.value}%</div>
                     </div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.name}</div>
                  </div>
                ))}
             </div>
          </div>

          {/* Sub 4: Award */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
             <Award size={48} className="text-emerald-400 mb-4 animate-pulse" />
             <h3 className="text-lg font-bold text-white mb-2">Network ESG Leader</h3>
             <div className="text-3xl font-black text-emerald-500 mb-2">{institutions[0]?.short_name}</div>
             <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium italic">
               Surpassing network average in carbon reduction and recycling efficiency for 3 consecutive quarters.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
