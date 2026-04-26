'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
        <AlertCircle size={40} className="text-red-500" />
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Something went wrong</h1>
      <p className="text-slate-400 max-w-md mb-10 leading-relaxed">
        An unexpected error occurred in UCARiq. Our AI agents have been notified and are working on a fix.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95"
        >
          <RefreshCcw size={18} />
          Try again
        </button>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
        >
          <Home size={18} />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="mt-12 text-xs text-slate-600 font-mono">
        Error ID: {error.digest || 'unknown_error'}
      </div>
    </div>
  );
}
