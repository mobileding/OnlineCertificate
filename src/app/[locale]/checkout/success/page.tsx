import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
// REMOVED: revalidatePath (This was causing the crash)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any, 
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
  params: Promise<{ locale: string }>;
}

export default async function CheckoutSuccessPage({ searchParams, params }: PageProps) {
  // 1. Unwrap Params (Next.js 15 Standard)
  const { session_id } = await searchParams;
  const { locale } = await params;

  if (!session_id) return <div className="p-10 text-red-500">Error: No session ID</div>;

  // 2. Retrieve Stripe Session
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const customerEmail = session.customer_details?.email || session.customer_email;
  const subscriptionId = session.subscription as string;
  
  // FIX: Capture the Customer ID so it isn't NULL in your database
  const stripeCustomerId = typeof session.customer === 'string' 
      ? session.customer 
      : session.customer?.id;

  if (!customerEmail) return <div className="p-10 text-red-500">Error: No email found</div>;

  // 3. Generate Auth Link
  const isProduction = process.env.NODE_ENV === 'production';
  const siteUrl = isProduction ? 'https://onlinecertificate.org' : 'http://localhost:3000';

  const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: customerEmail,
    options: {
redirectTo: `${siteUrl}/${locale}/auth/redeem?locale=${locale}`
    }
  });

  const userId = linkData.user?.id;

  // 4. THE UPSERT (Safe & Complete)
  if (userId) {
      console.log(`[Success] Processing User ${userId}`);
      
      await supabaseAdmin.from('profiles').upsert({ 
          id: userId,
          email: customerEmail,
          subscription_tier: 'pro',
          subscription_id: subscriptionId,
          stripe_customer_id: stripeCustomerId, // <--- Now saving the Customer ID!
          updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
  }

  // 5. REDIRECT (No revalidatePath)
  // We go straight to the login link.
  if (linkData?.properties?.action_link) {
      redirect(linkData.properties.action_link);
  }

  // Fallback UI (Only seen if redirect is slow)
  return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <h1 className="text-xl font-semibold text-slate-800">Finalizing your account...</h1>
          <p className="text-slate-500 mt-2">Redirecting you to the dashboard.</p>
      </div>
  );
}