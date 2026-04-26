'use client'

import React, { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, Loader2 } from 'lucide-react'

interface AlertItemProps {
  id?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  institution: string
  title: string
  message: string
  timestamp: string
  reasoning?: string
  hasAiReasoning?: boolean
  ai_actions?: string[]
}

export function AlertItem({
  id,
  severity,
  institution,
  title,
  message,
  timestamp,
  reasoning,
  hasAiReasoning,
  ai_actions
}: AlertItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [actions, setActions] = useState<string[]>(ai_actions || [])
  const [loadingActions, setLoadingActions] = useState(false)

  const severityStyles = {
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    critical: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
  }

  const fetchActions = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (actions.length > 0) return;
    
    setLoadingActions(true);
    try {
      const response = await fetch('/api/alerts/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: id,
          shortName: institution,
          domain: 'General',
          title,
          message,
          reasoning
        }),
      });
      const data = await response.json();
      setActions(data.actions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActions(false);
    }
  };

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "group p-4 rounded-lg border transition-all cursor-pointer",
        isExpanded 
          ? "bg-slate-900 border-slate-700 shadow-xl" 
          : "border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-700"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
            severityStyles[severity]
          )}>
            {severity}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {institution}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </span>
          {isExpanded ? <ChevronUp size={12} className="text-slate-600" /> : <ChevronDown size={12} className="text-slate-600" />}
        </div>
      </div>

      <h5 className="text-sm font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">
        {title}
      </h5>
      
      <p className={cn(
        "text-xs text-slate-400 leading-relaxed transition-all",
        !isExpanded && "line-clamp-2"
      )}>
        {message}
      </p>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {reasoning && (
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI Reasoning</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{reasoning}"
              </p>
            </div>
          )}

          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">🎯 Recommended Actions</div>
                {actions.length === 0 && !loadingActions && (
                  <button 
                    onClick={fetchActions}
                    className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors underline"
                  >
                    Generate Actions
                  </button>
                )}
             </div>
             
             {loadingActions ? (
               <div className="flex items-center gap-2 text-slate-600">
                 <Loader2 className="animate-spin" size={12} />
                 <span className="text-[10px] font-medium italic">Analyzing network response...</span>
               </div>
             ) : actions.length > 0 ? (
               <div className="space-y-2">
                 {actions.map((action, i) => (
                   <div key={i} className="flex items-start gap-3 p-2 bg-slate-950 border border-slate-800 rounded-lg group/action hover:border-slate-700">
                      <div className="mt-0.5 text-emerald-500">
                         <CheckCircle size={12} />
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover/action:text-slate-200 transition-colors">{action}</p>
                   </div>
                 ))}
               </div>
             ) : null}
          </div>
        </div>
      )}

      {!isExpanded && hasAiReasoning && (
        <div className="mt-3 flex items-center gap-1.5">
           <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
             <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
             <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">AI Insight Available</span>
           </div>
        </div>
      )}
    </div>
  )
}
