import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest">AI</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        <div className="text-lg font-bold text-white tracking-widest uppercase">UCAR<span className="text-indigo-500">iq</span></div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 font-medium uppercase tracking-[0.3em]">Synchronizing Network Data</p>
    </div>
  );
}
