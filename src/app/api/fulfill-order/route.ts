import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";

// Init Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any, 
});

// Init Supabase Admin (Bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: Request) {
  try {
    const { sessionId, locale } = await req.json();

    if (!sessionId) return NextResponse.json({ error: "No session ID" }, { status: 400 });

    // 1. Verify Stripe Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customerEmail = session.customer_details?.email || session.customer_email;
    const subscriptionId = session.subscription as string;

    if (!customerEmail) return NextResponse.json({ error: "No email found" }, { status: 400 });

    // 2. Find User ID
    const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customerEmail,
        options: { redirectTo: 'http://placeholder' } 
    });

    const userId = linkData.user?.id;
    if (!userId) throw new Error("Could not generate user ID");

    // ============================================================
    // 3. THE "FIGHT BACK" LOOP (Ensures Pro Status Sticks)
    // ============================================================
    let attempts = 0;
    let confirmedPro = false;

    while (attempts < 5 && !confirmedPro) {
        attempts++;
        console.log(`[Fulfill] Attempt ${attempts}: Forcing Pro status for ${userId}`);

        // A. Force Write "Pro"
        await supabaseAdmin.from('profiles').upsert({ 
            id: userId,
            email: customerEmail,
            subscription_tier: 'pro',
            subscription_id: subscriptionId,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        // B. Wait a tiny bit (allow Triggers to run)
        await new Promise(r => setTimeout(r, 800)); 

        // C. Check what the DB actually says
        const { data: check } = await supabaseAdmin
            .from('profiles')
            .select('subscription_tier')
            .eq('id', userId)
            .single();

        if (check?.subscription_tier === 'pro' || check?.subscription_tier === 'elite') {
            confirmedPro = true;
            console.log(`[Fulfill] Success! User is confirmed Pro.`);
        } else {
            console.log(`[Fulfill] Warning: DB reverted to '${check?.subscription_tier}'. Retrying...`);
        }
    }
    // ============================================================

    // 4. Return Redirect URL
    const isProduction = process.env.NODE_ENV === 'production';
    const siteUrl = isProduction ? 'https://onlinecertificate.org' : 'http://localhost:3000';
    
    // Ensure we pass the locale correctly so the Redeem page knows where to send them
    const targetLocale = locale || 'en';
    
    const { data: finalLink } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customerEmail,
        options: { 
            // We direct them to the redeem page, passing the locale
            redirectTo: `${siteUrl}/auth/redeem?locale=${targetLocale}` 
        }
    });

    return NextResponse.json({ 
        success: true, 
        redirectUrl: finalLink.properties?.action_link 
    });

  } catch (error: any) {
    console.error("Fulfillment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}