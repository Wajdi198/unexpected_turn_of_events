import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { kpiName, actuals, predictions } = await req.json();

    const FORECAST_PROMPT = `You are a higher education analyst for the University of Carthage (UCAR).

KPI: ${kpiName}
Historical values (2024): Q1=${actuals[0]}, Q2=${actuals[1]}, Q3=${actuals[2]}, Q4=${actuals[3]}
Predicted (2025): Q1=${predictions[0]}, Q2=${predictions[1]}, Q3=${predictions[2]}, Q4=${predictions[3]}

Write a 2-sentence insight in French explaining the trend and what action the rectorate should consider. 
Be specific and reference the numbers.

Return ONLY valid JSON: 
{ 
  "insight": "...", 
  "trend": "improving|declining|stable", 
  "confidence": "high|medium|low" 
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: FORECAST_PROMPT }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const aiResponse = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return NextResponse.json(aiResponse);

  } catch (error: any) {
    console.error('Forecast AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
