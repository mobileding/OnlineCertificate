// src/app/api/save/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// Helper to generate a short 8-character ID (like "A9X-22B")
function generateCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const verificationCode = generateCode();

    // Insert into Supabase
    const { data, error } = await supabase
      .from('certificates')
      .insert([
        {
          recipient_name: body.recipient_name_placeholder, // From the AI or Input
          course_title: body.course_title,
          organization_name: body.organization_name,
          issue_date: new Date().toISOString(),
          verification_code: verificationCode,
          theme: body.design_theme,
          theme_color: body.theme_color,
          // We store the full "action text" so we don't lose the AI's writing
          course_title: body.action_text 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id, code: verificationCode });

  } catch (error) {
    console.error('Save Error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}