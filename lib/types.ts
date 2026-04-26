export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Institution {
  id: string
  name: string
  short_name: string | null
  type: string | null
  city: string | null
  student_count: number
  staff_count: number
  budget_allocated: number
  budget_spent: number
  created_at: string
}

export interface User {
  id: string
  email: string
  full_name: string | null
  role: 'rectorate' | 'dean' | 'staff'
  institution_id: string | null
  created_at: string
}

export interface Domain {
  id: string
  name: string
  name_fr: string | null
  icon: string | null
  description: string | null
}

export interface KpiDefinition {
  id: string
  code: string
  name: string
  name_en: string | null
  domain_id: string | null
  unit: string | null
  description: string | null
  direction: 'higher_better' | 'lower_better'
}

export interface KpiValue {
  id: string
  institution_id: string
  kpi_definition_id: string
  value: number
  period: string
  recorded_at: string
  source: string
}

export interface KpiThreshold {
  id: string
  kpi_definition_id: string
  warning_value: number | null
  critical_value: number | null
  comparison: 'greater_than' | 'less_than'
}

export interface Alert {
  id: string
  institution_id: string
  kpi_definition_id: string | null
  severity: 'low' | 'medium' | 'high' | 'critical'
  domain_id: string | null
  title: string
  message: string
  reasoning: string | null
  resolved: boolean
  created_at: string
}

export interface Document {
  id: string
  institution_id: string
  filename: string
  file_type: string | null
  raw_text: string | null
  extracted_data: Json | null
  summary: string | null
  status: string
  uploaded_at: string
}

export interface Report {
  id: string
  institution_id: string | null
  title: string
  period: string | null
  content: string | null
  key_findings: Json | null
  generated_at: string
  generated_by: string
}
