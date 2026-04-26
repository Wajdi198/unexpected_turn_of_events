import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-8 border border-indigo-500/20 rotate-12">
        <Search size={48} className="text-indigo-500" />
      </div>
      
      <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold text-slate-200 mb-4">Command not found</h2>
      <p className="text-slate-400 max-w-sm mb-10 leading-relaxed">
        The page you are looking for doesn't exist or has been moved to another domain in the UCAR network.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Home size={18} />
          Return Home
        </Link>
        <Link
          href="javascript:history.back()"
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
        >
          <ArrowLeft size={18} />
          Go Back
        </Link>
      </div>
    </div>
  );
}
