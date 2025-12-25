import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { MagicLinkSender } from "./MagicLinkSender";
import { CheckCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

// 1. Init Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia", 
});

// 2. Init Supabase Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
  params: Promise<{ locale: string }>;
}

export default async function CheckoutSuccessPage({ searchParams, params }: PageProps) {
  const { session_id } = await searchParams;
  const { locale } = await params;

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

  // 4. DETERMINE ENVIRONMENT
  const isProduction = process.env.NODE_ENV === 'production';
  const siteUrl = isProduction 
    ? 'https://onlinecertificate.org' 
    : 'http://localhost:3000';

  // 5. GENERATE MAGIC LINK (Get the User ID)
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: customerEmail,
    options: {
        // PASS LOCALE TO REDEEM PAGE
        redirectTo: `${siteUrl}/auth/redeem?locale=${locale}`
    }
  });

  if (linkError || !linkData.user) {
    console.error("Auth Error:", linkError);
  }

  // ============================================================
  // 6. THE FIX: RETRY LOOP FOR PROFILE UPDATE
  // ============================================================
  const userId = linkData.user?.id;

  if (userId) {
      console.log(`[Success] Processing User ${userId}`);
      
      let attempts = 0;
      let updated = false;

      // Try up to 3 times (waiting 1s each time)
      while (attempts < 3 && !updated) {
          const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({ 
                subscription_tier: 'pro',
                subscription_id: subscriptionId,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select(); // <--- Important: Returns the updated rows so we can check length

          if (data && data.length > 0) {
              updated = true;
              console.log(`[Success] Upgraded User to Pro on attempt ${attempts + 1}`);
          } else {
              console.log(`[Retry] Profile not found yet. Waiting... (${attempts + 1}/3)`);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
              attempts++;
          }
      }

      // FALLBACK: If the trigger failed completely, force INSERT (Upsert)
      if (!updated) {
           console.log(`[Fallback] Force creating profile for ${userId}`);
           await supabaseAdmin.from('profiles').upsert({
                id: userId,
                subscription_tier: 'pro',
                subscription_id: subscriptionId,
                email: customerEmail, // If your profile has an email column
                updated_at: new Date().toISOString()
           });
      }
  }
  // ============================================================


  // 7. CLEAR CACHE
  revalidatePath('/', 'layout'); 
  revalidatePath(`/${locale}/dashboard`);

  // 8. EXECUTE REDIRECT
  const lastSignIn = linkData.user?.last_sign_in_at;
  const createdAt = new Date(linkData.user?.created_at || new Date()).getTime();
  const now = new Date().getTime();
  const isBrandNew = (now - createdAt) < 5 * 60 * 1000; 

  const shouldAutoLogin = !lastSignIn || isBrandNew;

  if (shouldAutoLogin && linkData?.properties?.action_link) {
      redirect(linkData.properties.action_link);
  }

  // 9. MANUAL FALLBACK
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-green-600 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
          <p className="text-green-100 text-sm mt-2">Your account has been upgraded.</p>
        </div>
        <div className="p-8">
            <p className="text-slate-600 text-sm text-center mb-6">
                Please check your email <strong>{customerEmail}</strong> for a secure login link.
            </p>
            <MagicLinkSender email={customerEmail} />
        </div>
      </div>
    </div>
  );
}