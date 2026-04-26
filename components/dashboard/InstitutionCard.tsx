'use client'

import { Users, TrendingUp, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface InstitutionCardProps {
  id: string
  name: string
  shortName: string
  city: string
  budgetPct: number
  students: number
  successRate: number
  alertCount: number
  alertSeverity: 'critical' | 'high' | 'medium' | 'none'
}

export function InstitutionCard({
  id,
  name,
  shortName,
  city,
  budgetPct,
  students,
  successRate,
  alertCount,
  alertSeverity
}: InstitutionCardProps) {
  const successColor = successRate > 85 ? 'text-emerald-500' : successRate > 70 ? 'text-amber-500' : 'text-red-500'
  const alertColor = alertSeverity === 'critical' ? 'text-red-500' : alertSeverity === 'high' ? 'text-amber-500' : 'text-slate-500'

  return (
    <Link href={`/dashboard/institution/${id}`} className="block group">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/60 shadow-lg">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">{shortName}</h4>
          <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">{city}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Budget Execution</span>
            <span className="text-[10px] font-bold text-indigo-400">{budgetPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-1000" 
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-4">
          <div className="flex flex-col items-center">
            <Users className="h-3.5 w-3.5 text-slate-500 mb-1" />
            <span className="text-xs font-bold text-white">{students.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-800 px-2">
            <TrendingUp className={cn("h-3.5 w-3.5 mb-1", successColor)} />
            <span className={cn("text-xs font-bold", successColor)}>{successRate}%</span>
          </div>
          <div className="flex flex-col items-center">
            <Bell className={cn("h-3.5 w-3.5 mb-1", alertColor)} />
            <span className={cn("text-xs font-bold", alertColor)}>{alertCount}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
