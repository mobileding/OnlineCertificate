import { stripe } from "../../../lib/stripe"; 
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 0. Parse the Plan from the Frontend Request
    const { plan, locale } = await req.json().catch(() => ({ plan: 'pro', locale: 'en' })); // <--- ADDED LOCALE SUPPORT (Optional)

    // 1. Setup Supabase & Get User
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) { },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 2. Define Price IDs
    const PRICE_IDS = {
        pro: process.env.STRIPE_PRICE_ID!, 
        elite: process.env.STRIPE_ELITE_PRICE_ID! 
    };

    const targetPriceId = PRICE_IDS[plan as keyof typeof PRICE_IDS] || PRICE_IDS.pro;

    // ============================================================
    // 3. THE INTERCEPTION: HANDLE UPGRADES
    // ============================================================
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier, subscription_id')
            .eq('id', user.id)
            .single();

        if (profile?.subscription_tier === 'pro' && plan === 'elite' && profile.subscription_id) {
            
            console.log(`[Upgrade] Upgrading user ${user.id} to Elite`);
            
            const subscription = await stripe.subscriptions.retrieve(profile.subscription_id);
            const itemId = subscription.items.data[0].id;

            await stripe.subscriptions.update(profile.subscription_id, {
                items: [{
                    id: itemId,
                    price: targetPriceId, 
                }],
                billing_cycle_anchor: 'now',
                proration_behavior: 'none', 
            });

            await supabase
                .from('profiles')
                .update({ subscription_tier: 'elite' })
                .eq('id', user.id);

            return NextResponse.json({ success: true, message: "Upgraded to Elite" });
        }
    }

    // ============================================================
    // 4. THE FIX: ROBUST DOMAIN DETECTION
    // ============================================================
    
    // Logic: If on Vercel (production), use the Real URL. Otherwise, Localhost.
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction 
        ? (process.env.NEXT_PUBLIC_SITE_URL || 'https://onlinecertificate.org') // Fallback safety
        : 'http://localhost:3000';

    // Optional: Handle Locale (e.g. /es/checkout/success vs /checkout/success)
    // If you passed 'locale' from the frontend, we insert it here.
    const localePath = locale && locale !== 'en' ? `/${locale}` : '';

    let sessionConfig: any = {
      payment_method_types: ["card"],
      line_items: [{ price: targetPriceId, quantity: 1 }], 
      mode: "subscription",
      // FIX IS HERE: Use 'domain' variable instead of 'origin'
      success_url: `${domain}${localePath}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}${localePath}/pricing?canceled=true`,
      allow_promotion_codes: true,
    };

    if (user) {
      console.log(`[Checkout] Creating session for User: ${user.id}`);
      sessionConfig.customer_email = user.email;
      sessionConfig.metadata = { 
        userId: user.id,
        tier: plan 
      };
    } else {
      console.log(`[Checkout] Creating session for Guest`);
      sessionConfig.metadata = { 
        createAccount: "true", 
        tier: plan
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("[Checkout Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}