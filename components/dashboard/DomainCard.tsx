'use client'

import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'

interface DomainCardProps {
  id: string
  nameFr: string
  iconName: string
  kpiCount: number
  hasData?: boolean
}

export function DomainCard({
  id,
  nameFr,
  iconName,
  kpiCount,
  hasData = true
}: DomainCardProps) {
  // @ts-ignore
  const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle

  return (
    <div className="flex flex-col p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 hover:border-indigo-500/30 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-500/10 transition-colors">
          <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-400" />
        </div>
        <div className={cn(
          "h-1.5 w-1.5 rounded-full",
          hasData ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-600"
        )} />
      </div>
      
      <h6 className="text-xs font-bold text-white mb-0.5">{nameFr}</h6>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
        {kpiCount} KPIs tracked
      </p>
    </div>
  )
}
