import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { MagicLinkSender } from "./MagicLinkSender";
import { CheckCircle, AlertTriangle } from "lucide-react"; 
import { revalidatePath } from "next/cache";

// 1. Init Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any, 
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
     return <div className="p-10 text-red-500">Error: No session_id found.</div>;
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

  // 4. DETERMINE ENVIRONMENT
  const isProduction = process.env.NODE_ENV === 'production';
  const siteUrl = isProduction 
    ? 'https://onlinecertificate.org' 
    : 'http://localhost:3000';

  // 5. GENERATE MAGIC LINK
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: customerEmail,
    options: {
        redirectTo: `${siteUrl}/auth/redeem?locale=${locale}`
    }
  });

  if (linkError || !linkData.user) {
    console.error("Auth Error:", linkError);
  }

  // ============================================================
  // 6. THE "DELAYED" FIX (WINS THE TRIGGER WAR)
  // ============================================================
  const userId = linkData.user?.id;

  if (userId) {
      console.log(`[Success] User ID: ${userId}. Waiting for triggers...`);
      
      // WAIT 2 SECONDS
      // This allows any automated Database Triggers (which set "Free") to finish.
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log(`[Success] Overwriting with Pro status now...`);

      // NOW we write "Pro". Since we are last, we stay Pro.
      const { error: upsertError } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
            id: userId,
            email: customerEmail,
            subscription_tier: 'pro', // <--- This will overwrite "free"
            subscription_id: subscriptionId,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (upsertError) {
          console.error("CRITICAL DB ERROR:", upsertError);
      } else {
          console.log(`[Success] Profile is officially PRO.`);
      }
  }
  // ============================================================

  // 7. CLEAR CACHE & REDIRECT
  revalidatePath('/', 'layout'); 
  revalidatePath(`/${locale}/dashboard`);

  const lastSignIn = linkData.user?.last_sign_in_at;
  const createdAt = new Date(linkData.user?.created_at || new Date()).getTime();
  const now = new Date().getTime();
  const isBrandNew = (now - createdAt) < 5 * 60 * 1000; 

  const shouldAutoLogin = !lastSignIn || isBrandNew;

  if (shouldAutoLogin && linkData?.properties?.action_link) {
      redirect(linkData.properties.action_link);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-slate-600 mt-2">Check your email <strong>{customerEmail}</strong> to login.</p>
        <div className="mt-6">
           <MagicLinkSender email={customerEmail} />
        </div>
      </div>
    </div>
  );
}