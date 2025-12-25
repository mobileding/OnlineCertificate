import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { MagicLinkSender } from "./MagicLinkSender";
import { CheckCircle } from "lucide-react";

// 1. Init Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // Use your actual version
});

// 2. Init Supabase Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
  params: Promise<{ locale: string }>; // <--- ADDED LOCALE HERE
}

export default async function CheckoutSuccessPage({ searchParams, params }: PageProps) {
  const { session_id } = await searchParams;
  const { locale } = await params; // <--- GET CURRENT LOCALE (e.g., 'en')

  if (!session_id) {
     return <div className="p-8 text-center text-red-500">Error: No payment session found.</div>;
  }

  // 3. Verify Payment
  let customerEmail = "";
  let subscriptionId = "";
  
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    customerEmail = session.customer_details?.email || session.customer_email || "";
    subscriptionId = session.subscription as string;
  } catch (e) {
    console.error("Stripe Error:", e);
    return <div>Error verifying payment.</div>;
  }

  if (!customerEmail) return <div>No email found in payment details.</div>;

  // 4. FIND USER & FORCE UPDATE (CRITICAL FIX)
  // We update the DB *now* so the Dashboard doesn't kick them out
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  const existingUser = users.find(u => u.email === customerEmail);

  if (existingUser) {
      // Force the DB to mark them as PRO immediately
      await supabaseAdmin
        .from('profiles')
        .update({ 
            subscription_tier: 'pro',
            subscription_id: subscriptionId,
            updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id);
  }

  // 5. AUTO-LOGIN LOGIC
  let shouldAutoLogin = false;

  if (!existingUser) {
      shouldAutoLogin = true;
  } else {
      const lastSignIn = existingUser.last_sign_in_at;
      const createdAt = new Date(existingUser.created_at).getTime();
      const now = new Date().getTime();
      const isBrandNew = (now - createdAt) < 5 * 60 * 1000; 

      if (!lastSignIn || isBrandNew) {
          shouldAutoLogin = true;
      }
  }

  // 6. EXECUTE REDIRECT (LOCALE AWARE)
  if (shouldAutoLogin) {
      // Determines the base URL dynamically
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
      const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customerEmail,
        options: {
            // FIX: Include ${locale} in the redirect URL
            // This ensures they go to /en/dashboard instead of just /dashboard
            redirectTo: `${siteUrl}/${locale}/dashboard?new_pro=true`
        }
      });

      if (linkData?.properties?.action_link) {
          redirect(linkData.properties.action_link);
      }
  }

  // 7. EXISTING USER FALLBACK
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-green-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
          <p className="text-green-100 text-sm mt-2">Your upgrade was successful.</p>
        </div>

        <div className="p-8">
            <div className="text-center mb-6">
                <p className="text-slate-600 text-sm">
                    Since you already have an account, please verify your identity to access your Pro features.
                </p>
            </div>
            {/* Show the sender we built earlier */}
            <MagicLinkSender email={customerEmail} />
        </div>

      </div>
    </div>
  );
}