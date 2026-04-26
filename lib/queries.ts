import { supabase } from './supabase'
import { Institution, Alert, Domain, KpiDefinition, KpiValue } from './types'

export async function getInstitutions() {
  const { data, error } = await supabase
    .from('v_institution_health')
    .select('*')
  
  if (error) throw error
  return data
}

export async function getNetworkKpis(period: string = '2024-Q4') {
  const { data, error } = await supabase
    .from('v_network_kpis')
    .select('*')
    .eq('period', period)
  
  if (error) throw error
  return data
}

export async function getAlerts(limit: number = 8) {
  const { data, error } = await supabase
    .from('alerts')
    .select('*, institutions(short_name)')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

export async function getKpiTrend(kpiCode: string, periodPrefix: string = '2024') {
  const { data, error } = await supabase
    .from('kpi_values')
    .select('*, kpi_definitions!inner(code), institutions(short_name)')
    .eq('kpi_definitions.code', kpiCode)
    .like('period', `${periodPrefix}%`)
    .order('period', { ascending: true })
  
  if (error) throw error
  return data
}

export async function getDomains() {
  const { data, error } = await supabase
    .from('domains')
    .select('*, kpi_definitions(id)')
  
  if (error) throw error
  return data
}

export async function getKpiDefinitions() {
  const { data, error } = await supabase
    .from('kpi_definitions')
    .select('*')
  
  if (error) throw error
  return data
}
