import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { alertId, shortName, domain, title, message, reasoning } = await req.json();

    const ACTION_PROMPT = `Given this UCARiq alert:
Institution: ${shortName}
Domain: ${domain}
Title: ${title}
Message: ${message}
Reasoning: ${reasoning}

Generate 3 specific, actionable next steps for the rectorate. Each action must:
- Be concrete (specify amount, timeline, or person)
- Be realistic in a Tunisian university context
- Reference real numbers from the alert when possible

Return ONLY valid JSON: { "actions": [string, string, string] }
Tone: executive, French, imperative.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: ACTION_PROMPT }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const aiResponse = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Save to database
    await supabase
      .from('alerts')
      .update({ ai_actions: aiResponse.actions })
      .eq('id', alertId);

    return NextResponse.json(aiResponse);

  } catch (error: any) {
    console.error('Alert Action AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
