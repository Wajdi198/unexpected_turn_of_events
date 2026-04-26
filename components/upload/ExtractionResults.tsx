'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, TrendingUp, AlertTriangle, Bell, ChevronRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ExtractionResultsProps {
  results: any;
  onConfirm: () => void;
  isConfirming: boolean;
}

const TypewriterText = ({ text, delay = 20 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return <p className="text-slate-300 leading-relaxed italic">{displayedText}</p>;
};

export default function ExtractionResults({ results, onConfirm, isConfirming }: ExtractionResultsProps) {
  const router = useRouter();
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setHasConfirmed(true);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">
                Extraction complete in {(results.elapsedMs / 1000).toFixed(1)}s
              </h3>
              <p className="text-slate-400 mt-1 animate-in fade-in duration-1000 delay-500">
                {results.summary}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary" className="bg-slate-800 text-indigo-400 border-indigo-500/30 px-3 py-1 gap-2">
            <TrendingUp size={14} />
            {results.kpisCount} KPIs detected
          </Badge>
          <Badge variant="secondary" className="bg-slate-800 text-amber-400 border-amber-500/30 px-3 py-1 gap-2">
            <AlertTriangle size={14} />
            {results.anomaliesCount} anomalies found
          </Badge>
          <Badge variant="secondary" className="bg-slate-800 text-rose-400 border-rose-500/30 px-3 py-1 gap-2">
            <Bell size={14} />
            {results.alertsCount} new alerts created
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="kpis" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 p-1">
          <TabsTrigger value="kpis" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Extracted KPIs
          </TabsTrigger>
          <TabsTrigger value="json" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Raw extraction (JSON)
          </TabsTrigger>
          <TabsTrigger value="reasoning" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            AI reasoning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="mt-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700">
                  <th className="px-4 py-3 text-slate-400 font-medium text-sm">KPI Name</th>
                  <th className="px-4 py-3 text-slate-400 font-medium text-sm">Value</th>
                  <th className="px-4 py-3 text-slate-400 font-medium text-sm">Unit</th>
                  <th className="px-4 py-3 text-slate-400 font-medium text-sm">Period</th>
                  <th className="px-4 py-3 text-slate-400 font-medium text-sm">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {results.fullResponse.extracted_kpis.map((kpi: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-medium">{kpi.code.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-slate-200">{kpi.value}</td>
                    <td className="px-4 py-3 text-slate-400">{kpi.unit}</td>
                    <td className="px-4 py-3 text-slate-400">{kpi.period}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${kpi.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{(kpi.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="json" className="mt-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 max-h-[400px] overflow-auto">
            <pre className="text-xs text-indigo-300 font-mono">
              {JSON.stringify(results.fullResponse, null, 2)}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="reasoning" className="mt-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 min-h-[100px]">
             <TypewriterText text={results.fullResponse.reasoning} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-6 flex gap-4 animate-in slide-in-from-bottom-10 duration-1000 delay-300">
        {!hasConfirmed ? (
          <Button 
            onClick={handleConfirm} 
            disabled={isConfirming}
            className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 text-lg font-bold rounded-xl shadow-xl shadow-indigo-500/20 gap-3"
          >
            {isConfirming ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" /> Saving data...
              </span>
            ) : (
              <>Confirm and add to database <ChevronRight /></>
            )}
          </Button>
        ) : (
          <Button 
            onClick={() => router.push('/dashboard')}
            className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-lg font-bold rounded-xl shadow-xl shadow-emerald-500/20 gap-3"
          >
            Go to dashboard <Check />
          </Button>
        )}
      </div>
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-loader-2", props.className)}
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}
