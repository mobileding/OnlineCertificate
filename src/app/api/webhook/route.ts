import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Updated to use cleaner '@' alias
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

  // ====================================================
  // EVENT 1: CHECKOUT COMPLETED (New Purchase)
  // ====================================================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 1. Get the email and metadata
    const email = session.customer_details?.email;
    const isGuest = session.metadata?.createAccount === "true";
    let userId = session.metadata?.userId;

    // --- GUEST ACCOUNT LOGIC ---
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
    }

    // --- FULFILLMENT LOGIC (Grant Access) ---
    if (userId) {
        let tier = 'pro'; 
        
        // Detect Tier (Elite vs Pro)
        // We check metadata first (most reliable), then amount
        if (session.metadata?.tier === 'elite' || session.amount_total === 2200) {
            tier = 'elite';
        }

        await supabaseAdmin
            .from("profiles")
            .update({
                subscription_tier: tier, 
                subscription_id: session.subscription as string,
                stripe_customer_id: session.customer as string,
                subscription_status: 'active'
            })
            .eq("id", userId);
            
        console.log(`[Webhook] User ${userId} updated to tier: ${tier}`);
    }
  }

  // ====================================================
  // EVENT 2: CANCELLATION (The "Doom" Date)
  // ====================================================
  // This fires when the subscription is fully deleted (e.g. forced cancel)
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
            subscription_id: null,
            is_org_verified: false // Remove verified badge on cancel
        })
        .eq("stripe_customer_id", stripeCustomerId);
  }

  // ====================================================
  // EVENT 3: UPDATES (Renewals, Upgrades, Trial End)
  // ====================================================
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId = subscription.customer as string;

    // 1. Determine Status
    // 'active' = Paid/Trialing
    // 'past_due' = Payment failed but retrying
    // 'unpaid' = Payment failed multiple times
    const status = subscription.status;

    // 2. Determine Tier (NEW LOGIC)
    const planAmount = subscription.items.data[0].price.unit_amount;
    let tier = 'free'; 

    if (planAmount === 500) tier = 'pro';    // $5.00 (Updated from 1000)
    if (planAmount === 2200) tier = 'elite'; // $22.00

    console.log(`[Webhook] Update: Customer ${stripeCustomerId} is ${tier} (${status})`);

    // 3. Update Database
    await supabaseAdmin
        .from("profiles")
        .update({
            subscription_status: status,
            subscription_tier: tier 
        })
        .eq("stripe_customer_id", stripeCustomerId);
  }

  // ====================================================
  // EVENT 4: BAD PAYMENT (Optional but Recommended)
  // ====================================================
  if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`⚠️ Payment failed for Customer: ${invoice.customer}`);
      // Stripe will retry automatically. 
      // You could send an email here if you had an email service.
  }

  // ====================================================
  // EVENT 5: DISPUTE CREATED (Fraud / Chargeback)
  // ====================================================
  if (event.type === "charge.dispute.created") {
      const dispute = event.data.object as Stripe.Dispute;
      // Depending on your Stripe version, you might need to fetch the transaction to get the customer
      // But usually, we can find the user via the payment intent or charge ID if we stored it.
      
      console.log(`🚨 DISPUTE DETECTED! Dispute ID: ${dispute.id}`);
      
      // LOGIC: If you want to auto-ban, you would look up the user by stripe_customer_id
      // and set account_status = 'banned'.
      // For now, we just log it so you can check your Stripe Dashboard.
  }

  return new NextResponse(null, { status: 200 });
}