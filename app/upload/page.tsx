'use client';

import React, { useState, useEffect } from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopBar } from '@/components/dashboard/TopBar';
import DropZone from '@/components/upload/DropZone';
import ExtractionTimeline, { StageStatus } from '@/components/upload/ExtractionTimeline';
import ExtractionResults from '@/components/upload/ExtractionResults';
import { supabase } from '@/lib/supabase';
import { toast, Toaster } from 'sonner';
import { FileText, Lightbulb } from 'lucide-react';

export default function UploadPage() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [activeSample, setActiveSample] = useState<string | null>(null);
  const [stages, setStages] = useState<Record<number, StageStatus>>({
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending',
  });
  const [timings, setTimings] = useState<Record<number, number | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    async function fetchInstitutions() {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name, short_name')
        .order('name');
      
      if (data) {
        setInstitutions(data);
        if (data.length > 0) setSelectedInstitutionId(data[0].id);
      }
    }
    fetchInstitutions();
  }, []);

  const handleExtraction = async ({ 
    file, 
    mode = 'pdf', 
    instId, 
    customFilename 
  }: { 
    file?: File, 
    mode?: 'pdf' | 'demo', 
    instId?: string, 
    customFilename?: string 
  }) => {
    const targetInstId = instId || selectedInstitutionId;
    if (!targetInstId) {
      toast.error('Please select a target institution first');
      return;
    }

    setIsProcessing(true);
    setResults(null);
    setStages({ 1: 'active', 2: 'pending', 3: 'pending', 4: 'pending' });
    setTimings({ 1: null, 2: null, 3: null, 4: null });

    const start = Date.now();

    try {
      // Step 1: Reading document (Fake delay for drama)
      await new Promise(resolve => setTimeout(resolve, 800));
      setStages(prev => ({ ...prev, 1: 'done' }));
      setTimings(prev => ({ ...prev, 1: Date.now() - start }));

      // Step 2: Sending to AI
      setStages(prev => ({ ...prev, 2: 'active' }));
      
      let fileBase64 = null;
      if (file && mode === 'pdf') {
        const reader = new FileReader();
        fileBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });
      }

      const aiStart = Date.now();
      
      // Step 3: Structuring data (Active while waiting for API)
      const structuringTimer = setTimeout(() => {
        setStages(prev => ({ ...prev, 3: 'active' }));
      }, 1500);

      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionId: targetInstId,
          filename: customFilename || file?.name || 'document.pdf',
          fileBase64,
          mode,
        }),
      });

      clearTimeout(structuringTimer);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to process document');

      const aiEnd = Date.now();
      setStages(prev => ({ ...prev, 2: 'done', 3: 'done', 4: 'done' }));
      setTimings(prev => ({ 
        ...prev, 
        2: Math.floor((aiEnd - aiStart) * 0.4), // Split timing for visual effect
        3: Math.floor((aiEnd - aiStart) * 0.4),
        4: Math.floor((aiEnd - aiStart) * 0.2) 
      }));

      setResults(data);
      toast.success('Document processed successfully');

    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setStages(prev => {
        const next = { ...prev };
        if (next[2] === 'active') next[2] = 'error';
        else if (next[3] === 'active') next[3] = 'error';
        else if (next[4] === 'active') next[4] = 'error';
        else next[1] = 'error';
        return next;
      });
    } finally {
      setIsProcessing(false);
      setActiveSample(null);
    }
  };

  const handleFileAccepted = (file: File) => {
    handleExtraction({ file, mode: 'pdf' });
  };

  const handleSampleClick = (sampleKey: string, instId: string) => {
    setActiveSample(sampleKey);
    setSelectedInstitutionId(instId);
    handleExtraction({ 
      mode: 'demo', 
      instId, 
      customFilename: `${sampleKey}_demo.pdf` 
    });
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const inst = institutions.find(i => i.id === selectedInstitutionId);
    toast.success(`Document processed and added to ${inst?.short_name || 'institution'}`);
    setIsConfirming(false);
  };

  const SAMPLES = [
    { key: 'enit', id: '11111111-1111-1111-1111-111111111111', name: 'ENIT', type: 'Engineering — Tunis' },
    { key: 'ihec', id: '22222222-2222-2222-2222-222222222222', name: 'IHEC', type: 'Business — Carthage' },
    { key: 'insat', id: '33333333-3333-3333-3333-333333333333', name: 'INSAT', type: 'Technology — Tunis' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <SidebarNav activePage="upload" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="AI Document Extraction" 
          subtitle="Upload any document. UCARiq extracts structured KPIs in seconds." 
        />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Step 1: Institution Selector */}
            <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Target institution
              </label>
              <select
                value={selectedInstitutionId}
                onChange={(e) => setSelectedInstitutionId(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              >
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.short_name} — {inst.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">
                Extracted KPIs will be linked to this institution
              </p>
            </section>

            {/* Step 2: Drag & Drop Zone */}
            <DropZone onFileAccepted={handleFileAccepted} isProcessing={isProcessing} />

            {/* OR Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-slate-950 px-4 text-slate-500 font-bold tracking-widest">OR</span>
              </div>
            </div>

            {/* Step 3: Demo Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-4 justify-center">
                <Lightbulb size={16} className="text-indigo-400" />
                <span>💡 PDF parsing is in beta — use a sample document for guaranteed demo</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SAMPLES.map((sample) => (
                  <button
                    key={sample.key}
                    onClick={() => handleSampleClick(sample.key, sample.id)}
                    disabled={isProcessing}
                    className={`
                      relative group flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-300
                      ${activeSample === sample.key 
                        ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 scale-105' 
                        : 'bg-slate-900 border-slate-700 hover:border-indigo-500 hover:scale-105'
                      }
                      ${isProcessing && activeSample !== sample.key ? 'opacity-50 grayscale' : ''}
                    `}
                  >
                    <div className={`
                      p-3 rounded-lg transition-colors
                      ${activeSample === sample.key ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'}
                    `}>
                      <FileText size={32} />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-slate-200">{sample.name} Sample</div>
                      <div className="text-xs text-slate-500 mt-1">{sample.type}</div>
                    </div>
                    {activeSample === sample.key && (
                      <div className="absolute inset-0 rounded-xl bg-indigo-500/5 blur-xl animate-pulse -z-10" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 4: Live Extraction View */}
            {(isProcessing || results) && !results && (
              <ExtractionTimeline stages={stages} timings={timings} />
            )}

            {/* Step 5: Results Display */}
            {results && (
              <ExtractionResults 
                results={results} 
                onConfirm={handleConfirm} 
                isConfirming={isConfirming}
              />
            )}
          </div>
        </main>
      </div>
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}
