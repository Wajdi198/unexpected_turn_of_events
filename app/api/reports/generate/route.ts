import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';
import { getReportDataSnapshot } from '@/lib/reportQueries';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { scope, institutionId, period, periodRef } = await req.json();

    if (!scope || !period || !periodRef) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch data snapshot
    const dataSnapshot = await getReportDataSnapshot({
      scope,
      institutionId,
      period,
      periodRef,
    });

    // 2. Prepare Groq Prompt
    const REPORT_PROMPT = `You are UCARiq's executive report writer for the University of Carthage.

Generate a professional executive brief in French, structured as follows:

## Résumé exécutif
2-3 sentences summarizing the network's state this period.

## Indicateurs clés
- 3-5 most important KPI movements (positive and negative)

## Points d'attention
- 3 critical alerts or anomalies that require leadership action
- For each, include: what happened, why it matters, recommended action

## Performance par institution  
Brief 1-sentence summary for each institution covered.

## Recommandations
- 2-3 strategic actions for the next period
- Be specific and tied to data points

## Conclusion
1 sentence forward-looking statement.

Tone: executive, factual, concise. Use markdown formatting with ## for sections.
Maximum 600 words total.

Also return key_findings as a separate JSON array of 3-5 bullet strings (10-15 words each).

Return ONLY valid JSON:
{
  "title": "string (e.g. 'UCAR Network — Brief Exécutif — 2024-Q4')",
  "content": "the full markdown report",
  "key_findings": ["bullet 1", "bullet 2", "bullet 3"],
  "summary_metrics": {
    "institutions_covered": number,
    "critical_alerts": number,
    "top_performer": "string",
    "needs_attention": "string"
  }
}`;

    // 3. Call Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: REPORT_PROMPT },
        { role: 'user', content: `DATA SNAPSHOT: ${JSON.stringify(dataSnapshot)}` },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const aiResponse = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // 4. Save to database
    const { data: savedReport, error: saveError } = await supabase
      .from('reports')
      .insert({
        institution_id: scope === 'institution' ? institutionId : null,
        title: aiResponse.title,
        period: `${period} (${periodRef})`,
        content: aiResponse.content,
        key_findings: aiResponse.key_findings,
        generated_by: 'ai',
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return NextResponse.json(savedReport);

  } catch (error: any) {
    console.error('Report Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
