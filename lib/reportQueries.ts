import { supabase } from './supabase';

export async function getReportDataSnapshot(params: {
  scope: 'network' | 'institution';
  institutionId?: string;
  period: string;
  periodRef: string;
}) {
  const { scope, institutionId, period, periodRef } = params;

  if (scope === 'network') {
    // 1. Fetch all institutions
    const { data: institutions } = await supabase
      .from('v_institution_health')
      .select('*');

    // 2. Fetch all network KPIs for the period
    const { data: networkKpis } = await supabase
      .from('v_network_kpis')
      .select('*')
      .eq('period', periodRef);

    // 3. Fetch recent alerts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentAlerts } = await supabase
      .from('alerts')
      .select('*, institutions(short_name)')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    // 4. Fetch critical alerts
    const { data: criticalAlerts } = await supabase
      .from('alerts')
      .select('*, institutions(short_name)')
      .eq('severity', 'critical')
      .eq('resolved', false)
      .limit(5);

    return {
      scope,
      period,
      periodRef,
      timestamp: new Date().toISOString(),
      summary: {
        total_institutions: institutions?.length || 0,
        total_students: institutions?.reduce((acc, i) => acc + (i.student_count || 0), 0) || 0,
        avg_budget_execution: institutions?.reduce((acc, i) => acc + (parseFloat(i.budget_execution_pct) || 0), 0) / (institutions?.length || 1),
      },
      institutions: institutions || [],
      networkKpis: networkKpis || [],
      recentAlerts: recentAlerts || [],
      criticalAlerts: criticalAlerts || [],
    };
  } else {
    // Single institution scope
    const { data: institution } = await supabase
      .from('v_institution_health')
      .select('*')
      .eq('id', institutionId)
      .single();

    const { data: kpiValues } = await supabase
      .from('kpi_values')
      .select('*, kpi_definitions(name, code, unit)')
      .eq('institution_id', institutionId)
      .eq('period', periodRef);

    const { data: alerts } = await supabase
      .from('alerts')
      .select('*')
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });

    return {
      scope,
      period,
      periodRef,
      timestamp: new Date().toISOString(),
      institution,
      kpiValues: kpiValues || [],
      alerts: alerts || [],
    };
  }
}
