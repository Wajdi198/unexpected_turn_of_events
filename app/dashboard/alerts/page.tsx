'use client';

import React, { useState, useEffect } from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopBar } from '@/components/dashboard/TopBar';
import { supabase } from '@/lib/supabase';
import { 
  Bell, AlertTriangle, AlertCircle, ShieldAlert, CheckCircle2, 
  Search, Filter, ChevronDown, ChevronUp, Sparkles, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function AlertsPage() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [institutionFilter, setInstitutionFilter] = useState('all');
  const [institutions, setInstitutions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [alertRes, instRes] = await Promise.all([
        supabase.from('alerts').select('*, institutions(short_name)').order('created_at', { ascending: false }),
        supabase.from('institutions').select('id, short_name')
      ]);
      setAlerts(alertRes.data || []);
      setInstitutions(instRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleResolve = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from('alerts').update({ resolved: true }).eq('id', id);
    if (!error) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
      toast.success('Alert marked as resolved');
    }
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchesInst = institutionFilter === 'all' || a.institution_id === institutionFilter;
    return matchesSeverity && matchesInst;
  });

  const stats = {
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
    high: alerts.filter(a => a.severity === 'high' && !a.resolved).length,
    medium: alerts.filter(a => a.severity === 'medium' && !a.resolved).length,
    resolved: alerts.filter(a => a.resolved).length
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <SidebarNav activePage="alerts" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Network Alerts" subtitle="Real-time anomaly detection across UCAR" />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: 'Critical', value: stats.critical, icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
                 { label: 'High Priority', value: stats.high, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                 { label: 'Medium', value: stats.medium, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                 { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-slate-500', bg: 'bg-slate-500/10' },
               ].map((stat, i) => (
                 <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                       <div className="text-3xl font-black text-white">{stat.value}</div>
                    </div>
                    <div className={cn("p-3 rounded-xl", stat.bg)}>
                       <stat.icon size={20} className={stat.color} />
                    </div>
                 </div>
               ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
               <div className="flex-1 flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 flex-1">
                     <Search size={14} className="text-slate-600" />
                     <input type="text" placeholder="Filter alerts..." className="bg-transparent text-sm text-slate-300 outline-none w-full" />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2">
                     <Filter size={14} className="text-slate-600" />
                     <select 
                       value={severityFilter}
                       onChange={(e) => setSeverityFilter(e.target.value)}
                       className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
                     >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical Only</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                     </select>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2">
                     <Building2 size={14} className="text-slate-600" />
                     <select 
                       value={institutionFilter}
                       onChange={(e) => setInstitutionFilter(e.target.value)}
                       className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
                     >
                        <option value="all">All Institutions</option>
                        {institutions.map(inst => (
                          <option key={inst.id} value={inst.id}>{inst.short_name}</option>
                        ))}
                     </select>
                  </div>
               </div>
            </div>

            {/* Alerts List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-950 text-slate-500 uppercase text-[10px] font-bold tracking-[0.2em]">
                        <tr>
                           <th className="px-6 py-4">Severity</th>
                           <th className="px-6 py-4">Institution</th>
                           <th className="px-6 py-4">Title</th>
                           <th className="px-6 py-4">Created</th>
                           <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50">
                        {loading ? (
                          [1,2,3,4,5].map(i => <tr key={i} className="h-16 animate-pulse bg-slate-900/50" />)
                        ) : filteredAlerts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No alerts match your current filters.</td>
                          </tr>
                        ) : (
                          filteredAlerts.map(alert => (
                            <React.Fragment key={alert.id}>
                               <tr 
                                 onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                                 className={cn(
                                   "cursor-pointer hover:bg-slate-800/30 transition-all group",
                                   alert.resolved && "opacity-60 grayscale",
                                   expandedId === alert.id && "bg-indigo-500/5 border-l-4 border-l-indigo-500"
                                 )}
                               >
                                  <td className="px-6 py-4">
                                     <span className={cn(
                                       "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                                       alert.severity === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                       alert.severity === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                     )}>
                                        {alert.severity}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                                     {alert.institutions?.short_name}
                                  </td>
                                  <td className="px-6 py-4 font-medium text-slate-200">
                                     {alert.title}
                                  </td>
                                  <td className="px-6 py-4 text-xs text-slate-500">
                                     {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     {!alert.resolved && (
                                       <button 
                                         onClick={(e) => handleResolve(alert.id, e)}
                                         className="p-2 text-slate-600 hover:text-green-500 transition-colors"
                                       >
                                          <CheckCircle2 size={16} />
                                       </button>
                                     )}
                                  </td>
                               </tr>
                               {expandedId === alert.id && (
                                 <tr className="bg-slate-950/50">
                                    <td colSpan={5} className="px-8 py-8 border-t border-slate-800 animate-in slide-in-from-top-2 duration-300">
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                          <div className="space-y-4">
                                             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Message</div>
                                             <p className="text-sm text-slate-300 leading-relaxed font-medium">{alert.message}</p>
                                             <div className="pt-4 space-y-3">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Suggested Actions</div>
                                                <ul className="space-y-2">
                                                   <li className="flex items-center gap-2 text-xs text-slate-400"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Verify latest financial reporting for discrepancies</li>
                                                   <li className="flex items-center gap-2 text-xs text-slate-400"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Contact the institutional dean for immediate clarification</li>
                                                   <li className="flex items-center gap-2 text-xs text-slate-400"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Schedule an AI-assisted audit for the impacted KPI domain</li>
                                                </ul>
                                             </div>
                                          </div>
                                          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
                                             <div className="absolute top-0 right-0 p-6 opacity-10">
                                                <Sparkles size={100} className="text-indigo-500" />
                                             </div>
                                             <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4">
                                                <Sparkles size={14} />
                                                AI Reasoning
                                             </div>
                                             <p className="text-xs text-slate-400 italic leading-relaxed relative z-10">
                                                "{alert.reasoning || "Anomaly detected based on historical trends for this institution. Budget execution is significantly lagging behind the 4-quarter rolling average."}"
                                             </p>
                                             <div className="mt-8">
                                                {!alert.resolved ? (
                                                  <button 
                                                    onClick={(e) => handleResolve(alert.id, e)}
                                                    className="w-full py-3 bg-green-600/20 hover:bg-green-600/30 text-green-500 text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-green-600/30"
                                                  >
                                                     Mark as Resolved
                                                  </button>
                                                ) : (
                                                  <div className="text-center text-xs font-bold text-slate-600 uppercase tracking-widest border border-slate-800 py-3 rounded-xl">
                                                     Already Resolved
                                                  </div>
                                                )}
                                             </div>
                                          </div>
                                       </div>
                                    </td>
                                 </tr>
                               )}
                            </React.Fragment>
                          ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
