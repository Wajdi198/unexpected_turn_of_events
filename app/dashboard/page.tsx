'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Legend,
  Cell
} from 'recharts'

import { SidebarNav } from '@/components/dashboard/SidebarNav'
import { TopBar } from '@/components/dashboard/TopBar'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { InstitutionCard } from '@/components/dashboard/InstitutionCard'
import { AlertItem } from '@/components/dashboard/AlertItem'
import { DomainCard } from '@/components/dashboard/DomainCard'
import { 
  getInstitutions, 
  getNetworkKpis, 
  getAlerts, 
  getDomains,
  getKpiDefinitions,
  getKpiTrend
} from '@/lib/queries'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [institutions, setInstitutions] = useState<any[]>([])
  const [networkKpis, setNetworkKpis] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [domains, setDomains] = useState<any[]>([])
  const [kpiDefinitions, setKpiDefinitions] = useState<any[]>([])
  const [selectedKpi, setSelectedKpi] = useState('success_rate')
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [budgetTrendData, setBudgetTrendData] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [insts, kpis, alrts, doms, defs] = await Promise.all([
          getInstitutions(),
          getNetworkKpis(),
          getAlerts(),
          getDomains(),
          getKpiDefinitions()
        ])

        setInstitutions(insts || [])
        setNetworkKpis(kpis || [])
        setAlerts(alrts || [])
        setDomains(doms || [])
        setKpiDefinitions(defs || [])
        
        // Initial comparison data (success_rate)
        const trend = await getKpiTrend('success_rate')
        // Transform for comparison bar chart: take latest period for each institution
        const latestPeriod = '2024-Q4'
        const comp = insts.map((i: any) => {
           const val = trend.find((t: any) => t.institution_id === i.id && t.period === latestPeriod)
           return {
             name: i.short_name,
             value: val ? parseFloat(val.value) : 0
           }
        })
        setComparisonData(comp)

        // Budget trend data for line chart
        const budgetTrend = await getKpiTrend('budget_execution')
        const periods = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4']
        const lineData = periods.map(p => {
          const row: any = { period: p }
          insts.forEach((i: any) => {
            const val = budgetTrend.find((t: any) => t.institution_id === i.id && t.period === p)
            row[i.short_name] = val ? parseFloat(val.value) : 0
          })
          return row
        })
        setBudgetTrendData(lineData)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleKpiChange = async (code: string) => {
    setSelectedKpi(code)
    const trend = await getKpiTrend(code)
    const latestPeriod = '2024-Q4'
    const comp = institutions.map((i: any) => {
       const val = trend.find((t: any) => t.institution_id === i.id && t.period === latestPeriod)
       return {
         name: i.short_name,
         value: val ? parseFloat(val.value) : 0
       }
    })
    setComparisonData(comp)
  }

  // Aggregate stats
  const totalStudents = institutions.reduce((acc, curr) => acc + (curr.student_count || 0), 0)
  const networkAvgSuccess = networkKpis.find(k => k.code === 'success_rate')?.network_avg || 0
  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' && !a.resolved).length

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <SidebarNav activePage="dashboard" />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="space-y-8 animate-pulse">
               <div className="grid grid-cols-4 gap-6">
                 {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-900 rounded-xl" />)}
               </div>
               <div className="h-40 bg-slate-900 rounded-xl" />
               <div className="h-96 bg-slate-900 rounded-xl" />
            </div>
          ) : (
            <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
              
              {/* SECTION A — KPI HERO CARDS */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                  title="Total Institutions"
                  value={institutions.length}
                  label="Active institutions"
                  trend="Scaling to 30+"
                  icon={Building2}
                />
                <KpiCard 
                  title="Total Students"
                  value={totalStudents.toLocaleString()}
                  label="Students across network"
                  trend="+8.2% vs last year"
                  trendType="up"
                  icon={Users}
                />
                <KpiCard 
                  title="Network Avg Success Rate"
                  value={`${parseFloat(networkAvgSuccess).toFixed(1)}%`}
                  label="Academic performance"
                  trend="+1.4% vs 2023"
                  trendType="up"
                  icon={TrendingUp}
                />
                <KpiCard 
                  title="Critical Alerts"
                  value={criticalAlertsCount}
                  label="Need immediate attention"
                  color="red"
                  icon={AlertTriangle}
                />
              </section>

              {/* SECTION B — INSTITUTION HEALTH MATRIX */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">Institution Health Matrix</h2>
                  <span className="text-xs text-slate-500 font-medium italic">Click cards for deep-dive analysis</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {institutions.map(inst => (
                    <InstitutionCard 
                      key={inst.id}
                      id={inst.id}
                      name={inst.name}
                      shortName={inst.short_name}
                      city={inst.city}
                      budgetPct={inst.budget_execution_pct}
                      students={inst.student_count}
                      successRate={82} // Sample success rate
                      alertCount={inst.critical_alerts + inst.high_alerts}
                      alertSeverity={inst.critical_alerts > 0 ? 'critical' : inst.high_alerts > 0 ? 'high' : 'none'}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION C — CROSS-INSTITUTION KPI COMPARISON */}
              <section className="bg-slate-900/40 rounded-xl border border-slate-800 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Cross-Institution Comparison</h2>
                    <p className="text-sm text-slate-400">Benchmarking performance across UCAR network</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-500 font-medium pl-2">SELECT KPI:</span>
                    <select 
                      className="bg-transparent text-sm text-white font-medium outline-none border-none cursor-pointer pr-4"
                      value={selectedKpi}
                      onChange={(e) => handleKpiChange(e.target.value)}
                    >
                      {kpiDefinitions.map(kpi => (
                        <option key={kpi.id} value={kpi.code}>{kpi.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {comparisonData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.value > 85 ? '#10b981' : '#6366f1'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* SECTION D — TWO-COLUMN ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Real-time Alerts Feed */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      <h2 className="text-lg font-bold text-white">Live Alerts</h2>
                    </div>
                    <button className="text-xs text-indigo-400 font-bold hover:underline">Mark all read</button>
                  </div>
                  
                  <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
                    {alerts.map(alert => (
                      <AlertItem 
                        key={alert.id}
                        severity={alert.severity}
                        institution={alert.institutions?.short_name || 'UCAR'}
                        title={alert.title}
                        message={alert.message}
                        timestamp={alert.created_at}
                        reasoning={alert.reasoning}
                        hasAiReasoning={!!alert.reasoning}
                      />
                    ))}
                  </div>
                </div>

                {/* Budget Execution Trend */}
                <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white">Budget Execution Trend</h2>
                      <p className="text-xs text-slate-500">Quarterly progress across institutions</p>
                    </div>
                  </div>

                  <div className="flex-1 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={budgetTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                          dataKey="period" 
                          stroke="#64748b" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          dx={-10}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend iconType="circle" />
                        <ReferenceLine y={90} label="Warning" stroke="#f59e0b" strokeDasharray="3 3" />
                        <ReferenceLine y={98} label="Critical" stroke="#ef4444" strokeDasharray="3 3" />
                        {institutions.map((inst, index) => (
                           <Line 
                             key={inst.id}
                             type="monotone" 
                             dataKey={inst.short_name} 
                             stroke={['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'][index % 5]} 
                             strokeWidth={3}
                             dot={{ r: 4, strokeWidth: 2 }}
                             activeDot={{ r: 6, strokeWidth: 0 }}
                           />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* SECTION E — DOMAIN COVERAGE GRID */}
              <section>
                <div className="mb-6 text-center lg:text-left">
                  <h2 className="text-xl font-bold text-white">All UCAR processes covered</h2>
                  <p className="text-sm text-slate-500">15 institutional process areas tracked in real-time</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {domains.map(domain => (
                    <DomainCard 
                      key={domain.id}
                      id={domain.id}
                      nameFr={domain.name_fr}
                      iconName={domain.icon}
                      kpiCount={domain.kpi_definitions.length}
                    />
                  ))}
                </div>
              </section>

            </div>
          )}
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  )
}
