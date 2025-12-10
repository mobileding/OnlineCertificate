// src/app/api/generate/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast & Cheap
      messages: [
        {
          role: "system",
          content: `You are a strict JSON-only API for a certificate generation platform called OnlineCertificate.org.
          RULES:
          1. You must ONLY return valid JSON. Do not include markdown formatting.
          2. If the user input is offensive, return: {"error": true, "reason": "content_policy"}.
          
          OUTPUT SCHEMA:
          {
            "design_theme": "Modern" | "Ivy" | "Playful" | "Nature" | "Minimal",
            "theme_color": "Hex Code string",
            "certificate_title": "String",
            "recipient_name_placeholder": "String",
            "organization_name": "String",
            "course_title": "String",
            "action_text": "String (2 sentences of professional appreciation)",
            "icon_keyword": "String"
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');
    
    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}