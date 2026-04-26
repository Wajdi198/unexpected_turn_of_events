'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopBar } from '@/components/dashboard/TopBar';
import { supabase } from '@/lib/supabase';
import { 
  Building2, Users, TrendingUp, AlertTriangle, Search, Filter, 
  Plus, MapPin, GraduationCap, Briefcase, LayoutGrid, List
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InstitutionsPage() {
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('v_institution_health').select('*');
      setInstitutions(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         inst.short_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || inst.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <SidebarNav activePage="institutions" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Institutions" subtitle="All affiliated members of the UCAR network" />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-8">
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Members', value: institutions.length, icon: Building2, color: 'text-indigo-400' },
                { label: 'Total Students', value: institutions.reduce((acc, i) => acc + (i.student_count || 0), 0).toLocaleString(), icon: Users, color: 'text-emerald-400' },
                { label: 'Avg Success', value: '84.2%', icon: TrendingUp, color: 'text-amber-400' },
                { label: 'Critical Alerts', value: institutions.reduce((acc, i) => acc + (i.critical_alerts || 0), 0), icon: AlertTriangle, color: 'text-red-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg bg-slate-950", stat.color)}>
                    <stat.icon size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex items-center gap-4 w-full md:w-auto flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by name or initials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                  <Filter size={14} className="text-slate-500" />
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-transparent text-sm text-slate-300 outline-none border-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Applied Sciences">Applied Sciences</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/10">
                <Plus size={16} />
                Add Institution
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                [1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-slate-900 rounded-2xl animate-pulse" />)
              ) : filteredInstitutions.length === 0 ? (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-700">
                    <Search size={32} />
                  </div>
                  <p className="text-slate-500 font-medium italic">No institutions match your search criteria.</p>
                </div>
              ) : (
                filteredInstitutions.map(inst => (
                  <div key={inst.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group flex flex-col">
                    <div className="p-6 space-y-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors leading-none">{inst.short_name}</h3>
                          <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{inst.name}</p>
                        </div>
                        <div className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {inst.type}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 py-2 border-y border-slate-800/50">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <MapPin size={12} className="text-slate-600" />
                          {inst.city}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Users size={12} className="text-slate-600" />
                          {inst.student_count?.toLocaleString()}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-500">Budget Execution</span>
                          <span className="text-white">{inst.budget_execution_pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              inst.budget_execution_pct > 90 ? 'bg-emerald-500' : 
                              inst.budget_execution_pct > 75 ? 'bg-indigo-500' : 'bg-amber-500'
                            )}
                            style={{ width: `${inst.budget_execution_pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {[
                          { label: 'Success', value: '87%', icon: GraduationCap, color: 'text-emerald-400' },
                          { label: 'Employability', value: '92%', icon: Briefcase, color: 'text-indigo-400' },
                        ].map((kpi, i) => (
                          <div key={i} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
                            <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">{kpi.label}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-200">{kpi.value}</span>
                              <kpi.icon size={12} className={kpi.color} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link 
                      href={`/dashboard/institutions/${inst.id}`}
                      className="p-4 bg-slate-950 border-t border-slate-800 text-center text-xs font-bold text-slate-500 hover:text-white hover:bg-slate-900 transition-all uppercase tracking-widest"
                    >
                      View Details
                    </Link>
                  </div>
                ))
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
