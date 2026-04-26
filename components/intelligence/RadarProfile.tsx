'use client';

import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';
import { cn } from '@/lib/utils';

interface RadarProfileProps {
  institutions: any[];
  selectedId: string;
  compareId: string;
  onSelect: (id: string) => void;
  onCompare: (id: string) => void;
  data: any[];
}

export const RadarProfile: React.FC<RadarProfileProps> = ({ 
  institutions, selectedId, compareId, onSelect, onCompare, data 
}) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl h-full flex flex-col">
      <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-white">Institution DNA</h2>
          <p className="text-sm text-slate-500 mt-1">Visualize 6-axis profiles across strategic domains</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-indigo-400 outline-none"
          >
            {institutions.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.short_name} (Primary)</option>
            ))}
          </select>
          <select 
            value={compareId}
            onChange={(e) => onCompare(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-emerald-400 outline-none"
          >
            <option value="">No Comparison</option>
            {institutions.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.short_name} (Overlay)</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="axis" stroke="#64748b" fontSize={10} tick={{ fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1e293b" tick={false} axisLine={false} />
              <Radar
                name="Primary"
                dataKey="value1"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.5}
              />
              {compareId && (
                <Radar
                  name="Comparison"
                  dataKey="value2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              )}
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-64 space-y-6">
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Profile scores</div>
           <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {data.map((d, i) => (
                <div key={i} className="space-y-1.5">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-400">{d.axis}</span>
                      <span className="text-white">{d.value1}</span>
                   </div>
                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.value1}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
