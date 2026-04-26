'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Sparkles, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastCardProps {
  title: string;
  data: {
    actuals: number[];
    predictions: number[];
    periods: string[];
  };
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ title, data }) => {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(`forecast_${title}`);
    if (cached) {
      setInsight(JSON.parse(cached));
    } else {
      fetchInsight();
    }
  }, [title]);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/intelligence/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpiName: title,
          actuals: data.actuals,
          predictions: data.predictions
        }),
      });
      const resData = await response.json();
      setInsight(resData);
      localStorage.setItem(`forecast_${title}`, JSON.stringify(resData));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data.periods.map((p, i) => ({
    period: p,
    actual: i < 4 ? data.actuals[i] : null,
    predicted: i >= 3 ? (i === 3 ? data.actuals[3] : data.predictions[i - 4]) : null
  }));

  const TrendIcon = insight?.trend === 'improving' ? TrendingUp : 
                    insight?.trend === 'declining' ? TrendingDown : Minus;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-5 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prediction Model</span>
        </div>
      </div>

      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="period" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dx={-10}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <ReferenceLine x="2024-Q4" stroke="#475569" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#6366f1" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} 
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#6366f1" 
              strokeWidth={3} 
              strokeDasharray="5 5"
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-950 p-5 border-t border-slate-800">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Loader2 className="animate-spin" size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Analyzing Trend...</span>
          </div>
        ) : insight ? (
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                   <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">AI INSIGHT</span>
                </div>
                <div className="flex items-center gap-2">
                   <TrendIcon size={14} className={cn(
                     insight.trend === 'improving' ? 'text-emerald-500' : 
                     insight.trend === 'declining' ? 'text-red-500' : 'text-slate-500'
                   )} />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     Confidence: <span className="text-slate-300">{insight.confidence}</span>
                   </span>
                </div>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed italic">
               "{insight.insight}"
             </p>
          </div>
        ) : (
          <div className="text-[10px] text-slate-600 font-bold uppercase text-center">
             Insight Unavailable
          </div>
        )}
      </div>
    </div>
  );
};
