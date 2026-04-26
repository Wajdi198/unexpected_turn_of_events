import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SQL_GENERATION_PROMPT = `You are UCARiq's analytics SQL generator for the University of Carthage.
You convert natural language questions into safe read-only PostgreSQL queries.

DATABASE SCHEMA:
- institutions(id uuid, name, short_name, type, city, student_count, staff_count, budget_allocated, budget_spent, created_at)
- users(id, email, full_name, role, institution_id)
- domains(id text PK, name, name_fr, icon, description)
- kpi_definitions(id, code, name, name_en, domain_id, unit, description, direction)
- kpi_values(id, institution_id, kpi_definition_id, value, period, source, recorded_at)
- kpi_thresholds(id, kpi_definition_id, warning_value, critical_value, comparison)
- alerts(id, institution_id, kpi_definition_id, severity, domain_id, title, message, reasoning, resolved, created_at)
- documents(id, institution_id, filename, file_type, raw_text, extracted_data, summary, status, uploaded_at)
- reports(id, institution_id, title, period, content, key_findings, generated_at, generated_by)

VIEWS:
- v_network_kpis(code, name, name_en, unit, domain_id, direction, network_avg, network_min, network_max, institutions_count, period)
- v_institution_health(id, name, short_name, type, city, student_count, budget_allocated, budget_spent, budget_execution_pct, critical_alerts, high_alerts)

KPI CODES (use these exact codes):
success_rate, attendance_rate, dropout_rate, repetition_rate, employability_rate, time_to_employment, budget_execution, cost_per_student, absenteeism_rate, staff_count, training_hours, publications_count, active_projects, patents_filed, classroom_occupancy, equipment_availability, energy_consumption, recycling_rate, carbon_footprint, intl_partnerships, national_partnerships, student_mobility, student_satisfaction, active_clubs, new_enrollments

RULES:
- ONLY generate SELECT statements. Never INSERT, UPDATE, DELETE, DROP, ALTER.
- Always use proper JOINs when crossing tables.
- For KPI questions, JOIN kpi_values + kpi_definitions + institutions.
- Limit results to 10 rows by default unless the user asks for all.
- Use ORDER BY when ranking.
- For comparison queries, use the views (v_network_kpis, v_institution_health).
- Use ILIKE for text matching.
- The user may ask in French or English — handle both.

OUTPUT FORMAT (strict JSON, nothing else):
{
  "sql": "the SELECT query",
  "explanation": "1-sentence English explanation of what this query does",
  "language": "fr" or "en" (detected from user question),
  "visualization": "table" | "bar_chart" | "line_chart" | "single_value" | "none"
}

If the question is unrelated to UCAR data (e.g., weather, jokes), return:
{ "sql": null, "explanation": "Question outside scope", "language": "fr"|"en", "visualization": "none" }`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { question, history } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // STAGE 1: Generate SQL
    const sqlCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SQL_GENERATION_PROMPT },
        { role: 'user', content: question },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const sqlGenResponse = JSON.parse(sqlCompletion.choices[0]?.message?.content || '{}');
    const { sql, explanation, language, visualization } = sqlGenResponse;

    let data = [];
    let sqlError = null;

    // STAGE 2: Execute SQL
    if (sql) {
      // Basic security check
      const forbiddenKeywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE', 'GRANT', 'REVOKE'];
      const isUnsafe = forbiddenKeywords.some(keyword => sql.toUpperCase().includes(keyword));
      const isSelect = sql.toUpperCase().trim().startsWith('SELECT');

      if (isUnsafe || !isSelect) {
        sqlError = 'Safety violation: Only SELECT queries are allowed.';
      } else {
        try {
          const { data: queryResult, error: queryError } = await supabase.rpc('run_safe_query', { 
            query_text: sql 
          });

          if (queryError) throw queryError;
          data = queryResult || [];
        } catch (err: any) {
          console.error('SQL Execution Error:', err);
          sqlError = err.message;
        }
      }
    }

    // STAGE 3: Generate Natural Language Answer
    const answerCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: `You are UCARiq's friendly assistant. Given the user's question, the SQL we generated, and the data we got back, write a clear, concise answer in the SAME LANGUAGE as the user's question (French or English). Use markdown for formatting. Be conversational but precise. If the data has multiple rows, summarize the key findings. If it's a single value, state it clearly. If the question was outside scope, politely redirect to UCAR-related questions.` 
        },
        { 
          role: 'user', 
          content: JSON.stringify({ 
            question, 
            sql, 
            explanation, 
            dataPreview: data.slice(0, 10), 
            sqlError,
            language 
          }) 
        },
      ],
      temperature: 0.5,
    });

    const answer = answerCompletion.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";

    return NextResponse.json({
      answer,
      sql,
      data,
      visualization,
      language,
      elapsedMs: Date.now() - startTime,
      error: sqlError,
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      answer: "Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.",
      error: error.message 
    }, { status: 200 }); // Always 200 for graceful handling in chat
  }
}
