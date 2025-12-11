import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const generateCode = () => {
  const part = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${part()}-${part()}-${part()}`;
};

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored in API routes
          }
        },
      },
    }
  );

  try {
    const body = await req.json();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check for business email (simple verification logic)
    const FREE_EMAIL_PROVIDERS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    let isOrgVerified = false;
    let orgName = body.organization_name;

    if (user && user.email) {
      const emailDomain = user.email.split('@')[1].toLowerCase();
      if (!FREE_EMAIL_PROVIDERS.includes(emailDomain)) {
        isOrgVerified = true;
        if (!orgName || orgName.trim() === "") {
            orgName = emailDomain; 
        }
      }
      
      // Update profile silently
      await supabase
        .from('profiles')
        .update({ 
          organization_name: orgName,
          is_org_verified: isOrgVerified 
        })
        .eq('id', user.id);
    }

    // Generate Code
    const verificationCode = generateCode();

    // Insert Certificate
    const { data, error } = await supabase
      .from('certificates')
      .insert([
        {
          recipient_name: body.recipient_name_placeholder,
          course_title: body.certificate_title,
          organization_name: body.organization_name,
          verification_code: verificationCode,
          theme: body.design_theme,
          theme_color: body.theme_color,
          issue_date: new Date().toISOString(),
          issuer_id: user ? user.id : null
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, code: data.verification_code });

  } catch (error: any) {
    console.error("Save Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}