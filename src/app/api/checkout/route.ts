import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use SERVICE ROLE key to check auth safely
);

export async function POST(req: Request) {
  try {
    const { priceId, userId, email } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // You will create this Price ID in Stripe Dashboard
          quantity: 1,
        },
      ],
      mode: 'subscription', // or 'payment' for one-time
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      customer_email: email,
      metadata: {
        userId: userId, // CRITICAL: We pass the Supabase User ID to Stripe so we know who paid!
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}