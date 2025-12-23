import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe"; // Your existing stripe instance
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Service Role Key is required to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // === EVENT 1: CHECKOUT COMPLETED (New Purchase) ===
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 1. Get the email and metadata
    const email = session.customer_details?.email;
    const isGuest = session.metadata?.createAccount === "true";
    let userId = session.metadata?.userId;

    // === GUEST ACCOUNT LOGIC ===
    if (isGuest && email) {
        console.log(`[Webhook] Guest payment detected for ${email}.`);
        
        // Check if user exists
        const { data: existingUser } = await supabaseAdmin
            .from('profiles') 
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            userId = existingUser.id;
        } else {
            // Create New User
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                email_confirm: true,
                user_metadata: { full_name: session.customer_details?.name }
            });

            if (createError) {
                console.error("[Webhook] User creation failed:", createError);
                return new NextResponse("User Creation Failed", { status: 500 });
            }
            userId = newUser.user.id;
        }

        // Send Magic Link (Optional - you handled this via UI already, but good backup)
        // await supabaseAdmin.auth.signInWithOtp({ ... }); 
    }

    // === FULFILLMENT LOGIC (Grant Access) ===
    if (userId) {
        let tier = 'pro'; 
        
        // Detect Tier (Elite vs Pro)
        if (session.amount_total === 2200 || session.metadata?.tier === 'elite') {
            tier = 'elite';
        }

        await supabaseAdmin
            .from("profiles")
            .update({
                subscription_tier: tier, 
                subscription_id: session.subscription as string,
                stripe_customer_id: session.customer as string,
                subscription_status: 'active' // Important for UI logic
            })
            .eq("id", userId);
            
        console.log(`[Webhook] User ${userId} updated to tier: ${tier}`);
    }
  }

  // === EVENT 2: CANCELLATION (The "Doom" Date) ===
  // This fires when the subscription actually ends (e.g. at end of month)
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId = subscription.customer as string;

    console.log(`[Webhook] Subscription deleted for customer: ${stripeCustomerId}`);

    // Downgrade the user to free
    await supabaseAdmin
        .from("profiles")
        .update({
            subscription_tier: "free",
            subscription_status: "canceled",
            subscription_id: null
        })
        .eq("stripe_customer_id", stripeCustomerId);
  }

// === EVENT 3: UPDATES (Renewals, Cancellations, AND UPGRADES) ===
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId = subscription.customer as string;

    // 1. Determine Status (Active vs Canceling)
    const status = subscription.cancel_at_period_end ? 'canceling' : 'active';

    // 2. Determine Tier (NEW LOGIC)
    // We look at the plan amount to figure out which tier they are on now
    const planAmount = subscription.items.data[0].plan.amount;
    let tier = 'free'; // Default safe fallback

    // Adjust these amounts to match your Stripe dashboard exactly (in cents)
    if (planAmount === 1000) tier = 'pro';      // $10.00
    if (planAmount === 2200) tier = 'elite';    // $22.00

    console.log(`[Webhook] Subscription Update: Customer ${stripeCustomerId} is now ${tier} (${status})`);

    // 3. Update Database
    await supabaseAdmin
        .from("profiles")
        .update({
            subscription_status: status,
            subscription_tier: tier // <--- CRITICAL: Update the tier!
        })
        .eq("stripe_customer_id", stripeCustomerId);
  }
  return new NextResponse(null, { status: 200 });
}