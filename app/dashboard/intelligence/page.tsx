'use client';

import React, { useState, useEffect } from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { TopBar } from '@/components/dashboard/TopBar';
import { RiskMatrix } from '@/components/intelligence/RiskMatrix';
import { ForecastCard } from '@/components/intelligence/ForecastCard';
import { Leaderboard } from '@/components/intelligence/Leaderboard';
import { RadarProfile } from '@/components/intelligence/RadarProfile';
import { AnomalyTimeline } from '@/components/intelligence/AnomalyTimeline';
import { EsgDashboard } from '@/components/intelligence/EsgDashboard';
import { 
  getIntelligenceSnapshot, 
  calculateRiskMatrix, 
  getKpiForecast, 
  getLeaderboardData 
} from '@/lib/intelligenceQueries';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeLeaderboard, setActiveLeaderboard] = useState('Academic Excellence');
  const [radarPrimary, setRadarPrimary] = useState('');
  const [radarCompare, setRadarCompare] = useState('');

  useEffect(() => {
    async function loadData() {
      const snapshot = await getIntelligenceSnapshot();
      setData(snapshot);
      if (snapshot.institutions.length > 0) {
        setRadarPrimary(snapshot.institutions[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="flex h-screen bg-slate-950 items-center justify-center space-y-4 flex-col">
      <BrainCircuit className="animate-pulse text-indigo-500" size={48} />
      <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
        <Loader2 className="animate-spin" size={14} />
        Initializing Intelligence Lab...
      </div>
    </div>
  );

  const matrix = calculateRiskMatrix(data.institutions, data.kpiValues, data.thresholds);
  const leaderboard = getLeaderboardData(data.institutions, data.kpiValues, activeLeaderboard);
  
  // Forecasts
  const successForecast = getKpiForecast('success_rate', data.kpiValues);
  const dropoutForecast = getKpiForecast('dropout_rate', data.kpiValues);
  const budgetForecast = getKpiForecast('budget_execution', data.kpiValues);
  const energyForecast = getKpiForecast('energy_consumption', data.kpiValues);

  // Radar Data
  const getRadarData = (id1: string, id2: string) => {
    const axes = ['Academic', 'Finance', 'HR', 'Research', 'Infrastructure', 'ESG'];
    return axes.map(axis => {
      const val1 = calculateDimensionScore(id1, axis);
      const val2 = id2 ? calculateDimensionScore(id2, axis) : 0;
      return { axis, value1: val1, value2: val2 };
    });
  };

  const calculateDimensionScore = (instId: string, dimension: string) => {
    // Simple mock calculation for demo stability
    const hash = instId.split('-')[0].split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const base = (hash % 40) + 50; // 50-90
    if (dimension === 'Research' && instId.includes('1111')) return 95; // ENIT
    if (dimension === 'Academic' && instId.includes('3333')) return 92; // INSAT
    return base + (dimension.length * 2) % 10;
  };

  const radarData = getRadarData(radarPrimary, radarCompare);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <SidebarNav activePage="intelligence" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Intelligence Lab" subtitle="Predictive analytics and network-wide anomaly detection" />
        
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-12 pb-24">
            
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={12} />
                    AI-Powered Network Brain
                  </div>
                  <h1 className="text-4xl font-black text-white tracking-tight">Intelligence Lab</h1>
                  <p className="text-slate-500 max-w-xl font-medium">
                    The command center for predictive UCAR analytics. Monitor risk heat maps, explore multi-quarter forecasts, and benchmark institutional DNA.
                  </p>
               </div>
               <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">
                     <BrainCircuit size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Llama 3.3 Engine</div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Active · 70B Model</div>
                  </div>
               </div>
            </div>

            {/* SECTION 1: Risk Matrix */}
            <RiskMatrix matrix={matrix} institutions={data.institutions} />

            {/* SECTION 2: Predictive Forecasting */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-xl font-bold text-white">AI-Powered Forecasting</h2>
                   <p className="text-sm text-slate-500 mt-1">Trend predictions for 2025 based on historical multi-quarter patterns</p>
                </div>
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">✨ 4 Linear Models Active</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ForecastCard title="Network Success Rate (%)" data={successForecast} />
                <ForecastCard title="Network Dropout Rate (%)" data={dropoutForecast} />
                <ForecastCard title="Budget Execution (%)" data={budgetForecast} />
                <ForecastCard title="Energy Consumption (kWh)" data={energyForecast} />
              </div>
            </div>

            {/* SECTION 3: Leaderboard */}
            <Leaderboard 
              data={leaderboard} 
              activeDimension={activeLeaderboard} 
              dimensions={['Academic Excellence', 'Financial Health', 'Research Impact', 'ESG Performance']}
              onDimensionChange={setActiveLeaderboard}
            />

            {/* SECTION 4: Radar Profile */}
            <RadarProfile 
              institutions={data.institutions}
              selectedId={radarPrimary}
              compareId={radarCompare}
              onSelect={setRadarPrimary}
              onCompare={setRadarCompare}
              data={radarData}
            />

            {/* SECTION 5: Anomaly Timeline */}
            <AnomalyTimeline alerts={data.alerts} institutions={data.institutions} />

            {/* SECTION 6: ESG Dashboard */}
            <EsgDashboard institutions={data.institutions} kpiValues={data.kpiValues} />

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
