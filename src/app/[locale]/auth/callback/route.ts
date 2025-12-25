import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in params, use it, otherwise default to /
  const next = searchParams.get("next") ?? "/";

  if (code) {
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
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // SUCCESS: Redirect to the intended page (or dashboard)
      const forwardedHost = request.headers.get('x-forwarded-host'); // Load balancer support
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        // on localhost, we can just use origin
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // in production (Vercel/etc), use the real domain
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
        // LOG THE ERROR so you can see it in your terminal
        console.error("Auth Callback Error:", error.message);
    }
  }

  // FAILURE: Redirect to error page
  // We explicitly add the error details to the URL so the user sees them
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=Invalid Code`);
}