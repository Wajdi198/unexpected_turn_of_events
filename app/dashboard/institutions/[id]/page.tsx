'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopBar } from '@/components/dashboard/TopBar';
import { supabase } from '@/lib/supabase';
import { 
  Building2, Users, MapPin, GraduationCap, Briefcase, 
  FileText, Bell, TrendingUp, Download, Upload, ArrowLeft,
  LayoutDashboard, PieChart, Database, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

export default function InstitutionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [kpiValues, setKpiValues] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [instRes, kpiRes, alertRes, docRes] = await Promise.all([
        supabase.from('institutions').select('*').eq('id', id).single(),
        supabase.from('kpi_values').select('*, kpi_definitions(*)').eq('institution_id', id).order('recorded_at', { ascending: false }),
        supabase.from('alerts').select('*').eq('institution_id', id).order('created_at', { ascending: false }),
        supabase.from('documents').select('*').eq('institution_id', id).order('uploaded_at', { ascending: false })
      ]);

      setInstitution(instRes.data);
      setKpiValues(kpiRes.data || []);
      setAlerts(alertRes.data || []);
      setDocuments(docRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen bg-slate-950 items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'alerts', name: 'Alerts', icon: Bell, count: alerts.filter(a => !a.resolved).length },
    { id: 'documents', name: 'Documents', icon: FileText, count: documents.length },
    { id: 'trend', name: 'Performance Trend', icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <SidebarNav activePage="institutions" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={institution?.short_name || 'Institution Detail'} subtitle={institution?.name} />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            
            {/* Header / Breadcrumb */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-4">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <ArrowLeft size={14} />
                  Back to network
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/10">
                    {institution?.short_name?.substring(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white leading-none mb-1">{institution?.name}</h2>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {institution?.city}, Tunisia</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      <span className="flex items-center gap-1.5"><Building2 size={14} /> {institution?.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => router.push(`/dashboard/reports?institutionId=${id}`)}
                  className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all uppercase tracking-widest"
                >
                  <Download size={14} />
                  Generate Report
                </button>
                <button 
                  onClick={() => router.push(`/upload?institutionId=${id}`)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-lg shadow-indigo-500/10 uppercase tracking-widest"
                >
                  <Upload size={14} />
                  Upload Data
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { label: 'Students', value: institution?.student_count?.toLocaleString(), icon: Users },
                 { label: 'Staff members', value: institution?.staff_count?.toLocaleString(), icon: Briefcase },
                 { label: 'Budget (TND)', value: (institution?.budget_allocated / 1000000).toFixed(1) + 'M', icon: Database },
                 { label: 'Success Rate', value: '87.4%', icon: GraduationCap },
               ].map((stat, i) => (
                 <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                       <stat.icon size={14} className="text-slate-600" />
                    </div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                 </div>
               ))}
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-2xl border border-slate-800 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activeTab === tab.id 
                      ? "bg-slate-800 text-indigo-400 shadow-lg" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <tab.icon size={16} />
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className={cn(
                      "ml-1 px-1.5 py-0.5 rounded-md text-[10px]",
                      tab.id === 'alerts' && tab.count > 0 ? "bg-red-500/20 text-red-400" : "bg-slate-950 text-slate-500"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kpiValues.length === 0 ? (
                    <div className="col-span-full py-20 bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl text-center">
                       <p className="text-slate-500 font-medium italic">No KPI records found for this period.</p>
                    </div>
                  ) : (
                    kpiValues.slice(0, 15).map((kv, i) => (
                      <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                            {kv.kpi_definitions?.domain_id || 'GENERAL'}
                          </div>
                          <TrendingUp size={14} className="text-emerald-500" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 mb-1">{kv.kpi_definitions?.name}</h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white">{kv.value}</span>
                          <span className="text-xs text-slate-500 font-medium">{kv.kpi_definitions?.unit}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                          Period: {kv.period}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-4">
                  {alerts.length === 0 ? (
                    <div className="py-20 bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl text-center">
                       <p className="text-slate-500 font-medium italic">No active alerts for this institution.</p>
                    </div>
                  ) : (
                    alerts.map((alert, i) => (
                      <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                              alert.severity === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              alert.severity === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            )}>
                              {alert.severity}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                              {new Date(alert.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-white">{alert.title}</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{alert.message}</p>
                        </div>
                        {alert.reasoning && (
                          <div className="md:w-1/3 bg-slate-950 p-5 rounded-xl border border-slate-800 relative">
                             <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                               <TrendingUp size={10} />
                               AI Analysis
                             </div>
                             <p className="text-xs text-slate-500 italic leading-relaxed">"{alert.reasoning}"</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.length === 0 ? (
                    <div className="col-span-full py-20 bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl text-center">
                       <p className="text-slate-500 font-medium italic">No documents uploaded yet.</p>
                    </div>
                  ) : (
                    documents.map((doc, i) => (
                      <div key={i} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 group hover:border-slate-600 transition-all">
                        <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                          <FileText size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-200 truncate">{doc.filename}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                        <button className="p-2 text-slate-600 hover:text-white transition-colors">
                          <Download size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'trend' && (
                <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-12">
                   <div className="h-80 w-full">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Success Rate Progression (4Q)</h4>
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={[
                           { period: '2024-Q1', value: 78.4 },
                           { period: '2024-Q2', value: 81.2 },
                           { period: '2024-Q3', value: 85.7 },
                           { period: '2024-Q4', value: 87.4 },
                         ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="period" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[70, 100]} dx={-10} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 0 }} />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Comparative Strengths</h4>
                        <div className="space-y-3">
                           {[
                             { label: 'Academic Innovation', val: 92, color: 'bg-emerald-500' },
                             { label: 'Infrastructure Quality', val: 74, color: 'bg-indigo-500' },
                             { label: 'Industry Partnerships', val: 88, color: 'bg-emerald-500' },
                             { label: 'Research Output', val: 65, color: 'bg-amber-500' },
                           ].map((item, i) => (
                             <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                   <span className="text-slate-400">{item.label}</span>
                                   <span className="text-white">{item.val}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                   <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.val}%` }} />
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                      <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                         <TrendingUp size={32} className="text-indigo-400 mb-4" />
                         <h5 className="text-white font-bold mb-2">High Growth Potential</h5>
                         <p className="text-xs text-slate-500 leading-relaxed">
                           Based on the last 3 quarters, {institution?.short_name} is projected to exceed network average success rates by 4.2% in the next academic year.
                         </p>
                      </div>
                   </div>
                </div>
              )}
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
