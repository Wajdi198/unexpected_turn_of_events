'use client'

import { LucideIcon } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  label: string
  trend?: string
  trendType?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: 'indigo' | 'red'
  data?: any[]
}

export function KpiCard({ 
  title, 
  value, 
  label, 
  trend, 
  trendType = 'neutral', 
  icon: Icon, 
  color = 'indigo',
  data = [
    { v: 40 }, { v: 60 }, { v: 50 }, { v: 80 }, { v: 70 }
  ]
}: KpiCardProps) {
  const isRed = color === 'red'

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight mt-1">{value}</h3>
        </div>
        <div className={cn(
          "p-2 rounded-lg",
          isRed ? "bg-red-500/10 text-red-500" : "bg-indigo-500/10 text-indigo-500"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-300 font-medium">{label}</p>
          {trend && (
            <p className={cn(
              "text-[10px] mt-0.5",
              trendType === 'up' ? "text-emerald-500" : trendType === 'down' ? "text-red-500" : "text-slate-500"
            )}>
              {trend}
            </p>
          )}
        </div>

        {data && !isRed && (
          <div className="h-10 w-full opacity-50 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gradient-card" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="v" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  fill="url(#gradient-card)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {isRed && (
           <div className="pt-2">
             <button className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline">
               View all alerts
             </button>
           </div>
        )}
      </div>
    </div>
  )
}
