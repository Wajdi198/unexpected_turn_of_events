import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const tables = [
      'institutions', 
      'users', 
      'domains', 
      'kpi_definitions', 
      'kpi_values', 
      'kpi_thresholds', 
      'alerts', 
      'documents', 
      'reports'
    ]

    const results: Record<string, number> = {}

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      results[table] = count || 0
    }

    return NextResponse.json({
      status: 'success',
      database: 'UCARiq Production',
      counts: results,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 })
  }
}
