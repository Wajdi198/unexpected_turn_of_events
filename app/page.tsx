'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('ucariq_user');
    if (user) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[150px]" />
      
      <div className="text-center relative z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 animate-bounce">
          <Sparkles size={12} />
          HACK4UCAR 2025 Winner
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
          UCAR<span className="text-indigo-500 italic">iq</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 font-medium mb-12 leading-relaxed">
          The intelligence brain for the University of Carthage network. 
          Real-time analytics, automated KPI extraction, and AI insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.push('/login')}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 group"
          >
            Enter Dashboard
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-20 flex items-center justify-center gap-8 grayscale opacity-40">
          <span className="text-xl font-bold text-slate-200">ENIT</span>
          <span className="text-xl font-bold text-slate-200">IHEC</span>
          <span className="text-xl font-bold text-slate-200">INSAT</span>
          <span className="text-xl font-bold text-slate-200">SUP'COM</span>
        </div>
      </div>
    </div>
  );
}
