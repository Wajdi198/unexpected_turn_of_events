'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopBar } from '@/components/dashboard/TopBar';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { ReportDisplay } from '@/components/reports/ReportDisplay';
import { supabase } from '@/lib/supabase';
import { History, Eye, Download, Trash2, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const autoTrigger = searchParams.get('auto') === 'true';
  
  const [reports, setReports] = useState<any[]>([]);
  const [activeReport, setActiveReport] = useState<any>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('generated_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch report history');
    } else {
      setReports(data || []);
    }
    setIsLoadingHistory(false);
  };

  const handleReportGenerated = (report: any) => {
    setActiveReport(report);
    setReports(prev => [report, ...prev]);
  };

  const handleDeleteReport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this report?')) return;

    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete report');
    } else {
      setReports(prev => prev.filter(r => r.id !== id));
      if (activeReport?.id === id) setActiveReport(null);
      toast.success('Report deleted');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <SidebarNav activePage="reports" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          title="Executive Reports" 
          subtitle="AI-generated briefs across the UCAR network" 
        />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Generator Section */}
            <ReportGenerator 
              onReportGenerated={handleReportGenerated} 
              autoTrigger={autoTrigger} 
            />

            {/* History Table */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <History size={18} className="text-slate-400" />
                  Report History
                </h2>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Total Reports: {reports.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Report Title</th>
                      <th className="px-6 py-4">Scope / Period</th>
                      <th className="px-6 py-4">Generated</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {isLoadingHistory ? (
                      [1,2,3].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={4} className="px-6 py-8 bg-slate-900/50 h-16" />
                        </tr>
                      ))
                    ) : reports.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                          No reports generated yet.
                        </td>
                      </tr>
                    ) : (
                      reports.map(report => (
                        <tr 
                          key={report.id} 
                          onClick={() => setActiveReport(report)}
                          className={`group cursor-pointer hover:bg-slate-800/50 transition-all ${activeReport?.id === report.id ? 'bg-indigo-600/5 border-l-4 border-l-indigo-600' : ''}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                                <FileText size={16} />
                              </div>
                              <span className="font-bold text-slate-200">{report.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-300 font-medium">
                                {report.institution_id ? 'Institution' : 'Network-wide'}
                              </span>
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                {report.period}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {new Date(report.generated_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-slate-500 hover:text-white transition-colors" title="View">
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={(e) => handleDeleteReport(report.id, e)}
                                className="p-2 text-slate-500 hover:text-red-500 transition-colors" 
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                              <ChevronRight size={16} className="text-slate-700 group-hover:text-slate-400 transition-all group-hover:translate-x-1" />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Active Report Display */}
            {activeReport && (
              <ReportDisplay report={activeReport} />
            )}

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
