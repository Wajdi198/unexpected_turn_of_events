'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, GraduationCap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (user: { name: string; role: string; institutionId: string | null; initials: string; bgColor: string }) => {
    localStorage.setItem('ucariq_user', JSON.stringify({
      name: user.name,
      role: user.role,
      institutionId: user.institutionId,
      initials: user.initials,
      bgColor: user.bgColor
    }));
    router.push('/dashboard');
  };

  const users = [
    {
      id: 'rectorate',
      name: "Pr. Sami Ben Naceur",
      role: "Rectorate · UCAR",
      description: "Network-wide access · 30+ institutions",
      institutionId: null,
      initials: "SB",
      bgColor: "bg-indigo-600",
      icon: ShieldCheck
    },
    {
      id: 'enit',
      name: "Pr. Amira Trabelsi",
      role: "Dean · ENIT",
      description: "École Nationale d'Ingénieurs de Tunis",
      institutionId: '11111111-1111-1111-1111-111111111111',
      initials: "AT",
      bgColor: "bg-emerald-600",
      icon: GraduationCap
    },
    {
      id: 'insat',
      name: "Pr. Mariem Saidi",
      role: "Dean · INSAT",
      description: "Institut National des Sciences Appliquées et de Technologie",
      institutionId: '33333333-3333-3333-3333-333333333333',
      initials: "MS",
      bgColor: "bg-amber-600",
      icon: GraduationCap
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-700">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-10 relative z-10">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              UCAR<span className="text-indigo-500">iq</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">UCAR Intelligence Platform</p>
            <div className="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-500 border border-slate-700 uppercase tracking-widest">
              HACK4UCAR 2025
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Sign in as</h3>
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group text-left"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold border-2 border-slate-900 transition-transform group-hover:scale-110",
                  user.bgColor
                )}>
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{user.name}</div>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">{user.role}</div>
                  <div className="text-xs text-slate-500 truncate">{user.description}</div>
                </div>
                <ChevronRight className="text-slate-800 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" size={18} />
              </button>
            ))}
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-bold tracking-[0.2em]">OR</span>
            </div>
          </div>

          <div className="space-y-4 opacity-50 pointer-events-none">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-600">
                your.name@ucar.tn
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-600">
                ••••••••
              </div>
            </div>
            <button disabled className="w-full py-4 bg-indigo-600/50 text-white font-bold rounded-xl text-sm">
              Sign In
            </button>
            <p className="text-[10px] text-center text-slate-600 font-medium">
              Demo mode — click a profile above
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-slate-600 font-medium">
            Demo prototype · Real authentication coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
