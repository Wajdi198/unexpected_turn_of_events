import { supabase } from './supabase';
import { linearRegression, normalize } from './statistics';

export async function getIntelligenceSnapshot() {
  // 1. Fetch all institutions
  const { data: institutions } = await supabase.from('institutions').select('*');
  
  // 2. Fetch all KPIs for the last year
  const { data: kpiValues } = await supabase
    .from('kpi_values')
    .select('*, kpi_definitions(*)')
    .order('period', { ascending: true });

  // 3. Fetch thresholds
  const { data: thresholds } = await supabase.from('kpi_thresholds').select('*');

  // 4. Fetch alerts
  const { data: alerts } = await supabase.from('alerts').select('*, institutions(short_name)');

  return { institutions, kpiValues, thresholds, alerts };
}

// Section 1: Risk Matrix
export function calculateRiskMatrix(institutions: any[], kpiValues: any[], thresholds: any[]) {
  const domains = ['Academic', 'Finance', 'HR', 'Research', 'Infrastructure', 'ESG', 'Partnerships', 'Employment'];
  const matrix: any = {};

  institutions.forEach(inst => {
    matrix[inst.id] = {};
    domains.forEach(domain => {
      const domainKpis = kpiValues.filter(kv => kv.institution_id === inst.id && kv.kpi_definitions?.domain_id === domain);
      
      if (domainKpis.length === 0) {
        matrix[inst.id][domain] = 0;
        return;
      }

      let totalRisk = 0;
      domainKpis.forEach(kv => {
        const threshold = thresholds.find(t => t.kpi_id === kv.kpi_id);
        if (threshold) {
          // Simplified risk calculation: distance from warning threshold
          const val = parseFloat(kv.value);
          const warn = threshold.warning_threshold;
          const crit = threshold.critical_threshold;
          
          if (val >= warn && val < crit) totalRisk += 40;
          else if (val >= crit) totalRisk += 80;
        }
      });
      
      matrix[inst.id][domain] = Math.min(100, Math.round(totalRisk / domainKpis.length));
    });
  });

  return matrix;
}

// Section 2: Forecasting
export function getKpiForecast(kpiCode: string, kpiValues: any[]) {
  const codeKpis = kpiValues.filter(kv => kv.kpi_definitions?.code === kpiCode);
  const periods = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4'];
  
  // Aggregate network-wide average per period
  const actuals = periods.map(p => {
    const periodVals = codeKpis.filter(k => k.period === p);
    if (periodVals.length === 0) return 0;
    return periodVals.reduce((acc, k) => acc + parseFloat(k.value), 0) / periodVals.length;
  });

  const reg = linearRegression(actuals);
  const predictions = [5, 6, 7, 8].map(x => reg.predict(x));

  return { actuals, predictions, periods: [...periods, '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4'] };
}

// Section 3: Leaderboard
export function getLeaderboardData(institutions: any[], kpiValues: any[], dimension: string) {
  const latestPeriod = '2024-Q4';
  
  return institutions.map(inst => {
    const instKpis = kpiValues.filter(kv => kv.institution_id === inst.id && kv.period === latestPeriod);
    const getVal = (code: string) => parseFloat(instKpis.find(k => k.kpi_definitions?.code === code)?.value || '0');

    let score = 0;
    if (dimension === 'Academic Excellence') {
      score = (getVal('success_rate') * 0.4) + (getVal('attendance_rate') * 0.2) + ((100 - getVal('dropout_rate')) * 0.3) + (getVal('employability_rate') * 0.1);
    } else if (dimension === 'Financial Health') {
      const budgetEx = getVal('budget_execution');
      score = 100 - Math.abs(budgetEx - 85) * 2;
    } else if (dimension === 'Research Impact') {
      score = (getVal('publications_count') / 120 * 60) + (getVal('active_projects') / 18 * 25) + (getVal('patents_filed') / 7 * 15);
    } else if (dimension === 'ESG Performance') {
      const energy = getVal('energy_consumption');
      const carbon = getVal('carbon_footprint');
      const normEnergy = (energy / 200000) * 100;
      const normCarbon = (carbon / 200) * 100;
      score = (getVal('recycling_rate') * 0.4) + ((100 - Math.min(100, normEnergy)) * 0.4) + ((100 - Math.min(100, normCarbon)) * 0.2);
    }

    return { 
      id: inst.id, 
      short_name: inst.short_name, 
      name: inst.name, 
      score: Math.round(score * 10) / 10 
    };
  }).sort((a, b) => b.score - a.score);
}
