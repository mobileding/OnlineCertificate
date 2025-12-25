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

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    // 1. Verify Stripe Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customerEmail = session.customer_details?.email || session.customer_email;
    const subscriptionId = session.subscription as string;

    if (!customerEmail) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    // 2. Generate Link (Find or Create User)
    // We do this to get the User ID safely
    const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customerEmail,
        options: { redirectTo: 'http://placeholder' } // We don't use this link, just need the User ID
    });

    const userId = linkData.user?.id;
    if (!userId) throw new Error("Could not generate user ID");

    // 3. THE NUCLEAR UPSERT (Force Pro)
    // We wait for this to finish before telling the frontend "OK"
    const { error: upsertError } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
            id: userId,
            email: customerEmail,
            subscription_tier: 'pro', // Force Pro
            subscription_id: subscriptionId,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

    if (upsertError) {
        console.error("Upsert Error:", upsertError);
        throw new Error("Database update failed");
    }

    // 4. Return the Magic Link URL so the frontend can redirect
    // Construct the correct redeem URL
    const isProduction = process.env.NODE_ENV === 'production';
    const siteUrl = isProduction ? 'https://onlinecertificate.org' : 'http://localhost:3000';
    
    // Generate the REAL login link now
    const { data: finalLink } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customerEmail,
        options: { 
            redirectTo: `${siteUrl}/auth/redeem?locale=${locale}` 
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