import { stripe } from "../../../lib/stripe"; 
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 0. Parse the Plan from the Frontend Request
    // We default to 'pro' if nothing is sent
    const { plan } = await req.json().catch(() => ({ plan: 'pro' }));

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
    // You need to add STRIPE_ELITE_PRICE_ID to your .env file
    const PRICE_IDS = {
        pro: process.env.STRIPE_PRICE_ID!, 
        elite: process.env.STRIPE_ELITE_PRICE_ID! 
    };

    const targetPriceId = PRICE_IDS[plan as keyof typeof PRICE_IDS] || PRICE_IDS.pro;

    // ============================================================
    // 3. THE INTERCEPTION: HANDLE UPGRADES (No Checkout Session)
    // ============================================================
    if (user) {
        // Fetch the user's profile to see their current status
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier, subscription_id')
            .eq('id', user.id)
            .single();

        // IF user is already Pro AND they want Elite...
        if (profile?.subscription_tier === 'pro' && plan === 'elite' && profile.subscription_id) {
            
            console.log(`[Upgrade] Upgrading user ${user.id} to Elite`);
            
            // 1. Find the Subscription Item ID (needed for update)
            const subscription = await stripe.subscriptions.retrieve(profile.subscription_id);
            const itemId = subscription.items.data[0].id;

            // 2. Perform the Update
            await stripe.subscriptions.update(profile.subscription_id, {
                items: [{
                    id: itemId,
                    price: targetPriceId, // The Elite Price ($22)
                }],
                billing_cycle_anchor: 'now', // Reset billing to today
                proration_behavior: 'none',  // Charge full $22 immediately
            });

            // 3. Update Supabase
            await supabase
                .from('profiles')
                .update({ subscription_tier: 'elite' })
                .eq('id', user.id);

            // 4. Return "Success" (Frontend will reload page)
            return NextResponse.json({ success: true, message: "Upgraded to Elite" });
        }
    }
    // ============================================================
    // END INTERCEPTION
    // ============================================================


    // 4. THE NORMAL PATH (New Purchases / Guests)
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    let sessionConfig: any = {
      payment_method_types: ["card"],
      line_items: [{ price: targetPriceId, quantity: 1 }], // Uses dynamic price now
      mode: "subscription",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      allow_promotion_codes: true,
    };

    if (user) {
      // Existing User Buying for First Time
      console.log(`[Checkout] Creating session for User: ${user.id}`);
      sessionConfig.customer_email = user.email;
      sessionConfig.metadata = { 
        userId: user.id,
        tier: plan // store which tier they bought
      };
    } else {
      // Guest User
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