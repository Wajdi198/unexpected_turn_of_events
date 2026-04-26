'use client';

import React from 'react';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StageStatus = 'pending' | 'active' | 'done' | 'error';

interface Stage {
  id: number;
  title: string;
  subtitle: string;
}

interface ExtractionTimelineProps {
  stages: Record<number, StageStatus>;
  timings: Record<number, number | null>;
}

const STAGES: Stage[] = [
  { id: 1, title: 'Reading document', subtitle: 'Extracting raw text from PDF' },
  { id: 2, title: 'Sending to AI', subtitle: 'Llama 3.3 via Groq is analyzing content' },
  { id: 3, title: 'Structuring data', subtitle: "Mapping to UCAR's unified schema" },
  { id: 4, title: 'Saving to database', subtitle: 'Writing KPIs and creating alerts' },
];

export default function ExtractionTimeline({ stages, timings }: ExtractionTimelineProps) {
  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      {STAGES.map((stage) => {
        const status = stages[stage.id];
        const timing = timings[stage.id];

        return (
          <div
            key={stage.id}
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-all duration-500",
              status === 'active' ? "bg-indigo-500/5 border-indigo-500/50 shadow-lg shadow-indigo-500/5" : "bg-slate-900/40 border-slate-800",
              status === 'done' && "bg-emerald-500/5 border-emerald-500/20"
            )}
          >
            <div className="mt-1">
              {status === 'pending' && <Clock className="text-slate-600" size={24} />}
              {status === 'active' && <Loader2 className="text-indigo-500 animate-spin" size={24} />}
              {status === 'done' && <CheckCircle2 className="text-emerald-500 animate-in scale-in-0 duration-500" size={24} />}
              {status === 'error' && <XCircle className="text-red-500" size={24} />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={cn(
                  "font-semibold transition-colors duration-300",
                  status === 'pending' ? "text-slate-500" : "text-slate-100"
                )}>
                  {stage.title}
                </h4>
                {timing !== null && (
                  <span className="text-xs font-mono text-slate-500">
                    {timing}ms
                  </span>
                )}
              </div>
              <p className={cn(
                "text-sm transition-colors duration-300",
                status === 'pending' ? "text-slate-600" : "text-slate-400"
              )}>
                {stage.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
