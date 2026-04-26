import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Network, School, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ReportGeneratorProps {
  onReportGenerated: (report: any) => void;
  autoTrigger?: boolean;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onReportGenerated, autoTrigger }) => {
  const [scope, setScope] = useState<'network' | 'institution'>('network');
  const [institutionId, setInstitutionId] = useState('');
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [period, setPeriod] = useState('quarterly');
  const [periodRef, setPeriodRef] = useState('2024-Q4');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function fetchInstitutions() {
      const { data } = await supabase.from('institutions').select('id, short_name').order('short_name');
      if (data) {
        setInstitutions(data);
        if (data.length > 0) setInstitutionId(data[0].id);
      }
    }
    fetchInstitutions();

    if (autoTrigger) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope,
          institutionId: scope === 'institution' ? institutionId : undefined,
          period,
          periodRef,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate report');

      onReportGenerated(data);
      toast.success('Report generated successfully');
      
      // Scroll to display
      setTimeout(() => {
        const display = document.getElementById('report-display');
        display?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800 bg-slate-950/50">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="text-indigo-400" size={20} />
          Generate New Report
        </h2>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Scope */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Report Scope</label>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setScope('network')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${
                scope === 'network' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Network size={14} />
              Network
            </button>
            <button
              onClick={() => setScope('institution')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all ${
                scope === 'institution' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <School size={14} />
              Institution
            </button>
          </div>
        </div>

        {/* Institution Dropdown (Conditional) */}
        <div className={`space-y-3 transition-all ${scope === 'institution' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Institution</label>
          <select
            value={institutionId}
            onChange={(e) => setInstitutionId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {institutions.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.short_name}</option>
            ))}
          </select>
        </div>

        {/* Period */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Period Type</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        {/* Period Reference */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reference</label>
          <div className="relative">
            <select
              value={periodRef}
              onChange={(e) => setPeriodRef(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
            >
              <option value="2024-Q1">2024-Q1</option>
              <option value="2024-Q2">2024-Q2</option>
              <option value="2024-Q3">2024-Q3</option>
              <option value="2024-Q4">2024-Q4</option>
            </select>
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-col items-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full md:w-auto min-w-[240px] flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-indigo-500/10 transition-all active:scale-95"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing network data...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Executive Brief
            </>
          )}
        </button>
        <span className="mt-3 text-[10px] text-slate-600 uppercase tracking-[0.2em] font-semibold">
          Powered by Llama 3.3 · ~5 seconds
        </span>
      </div>
    </div>
  );
};
