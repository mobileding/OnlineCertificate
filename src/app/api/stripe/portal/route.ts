import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js"; // Using basic client for admin access if needed, or your server client

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // Use your specific version
});

export async function GET(request: Request) {
  try {
    // 1. Initialize Supabase to get the current logged-in user
    // Note: We use the standard approach to get the cookie-based user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // We need to parse cookies from the request headers to verify the user
    // (This is a simplified way to check auth in an API route without the full SSR helper overhead if you just need the ID)
    // However, for robustness, let's assume you have a helper or use the standard auth header approach.
    // simpler approach for API routes:
    
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    
    const { createServerClient } = await import("@supabase/ssr");
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
             // We don't need to set cookies in this route, just read them
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // 2. Get the Stripe Customer ID from the profiles table
    // We need this ID to tell Stripe *which* customer portal to open
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
        return NextResponse.json({ error: "No billing history found." }, { status: 404 });
    }

    // 3. Create the Portal Session
    // This generates a secure, one-time link to the Stripe-hosted portal
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile`, // Where to send them after they click "Back"
    });

    // 4. Redirect the user to that URL
    return NextResponse.redirect(session.url);

  } catch (err: any) {
    console.error("Stripe Portal Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}