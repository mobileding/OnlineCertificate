import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { revalidatePath } from "next/cache";
// We temporarily comment out MagicLinkSender to rule it out as the cause of the crash
// import { MagicLinkSender } from "./MagicLinkSender"; 

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
  params: Promise<{ locale: string }>;
}

export default async function CheckoutSuccessPage({ searchParams, params }: PageProps) {
  // 1. SAFELY RESOLVE PARAMS (Next.js 15 Requirement)
  let session_id = "";
  let locale = "en";

  try {
      const resolvedParams = await params;
      const resolvedSearchParams = await searchParams;
      locale = resolvedParams.locale;
      session_id = resolvedSearchParams.session_id || "";
  } catch (e) {
      return <div className="p-10 text-red-500">Error resolving parameters.</div>;
  }

  // 2. THE SAFETY WRAPPER
  try {
    if (!session_id) throw new Error("Missing session_id in URL");

    // --- CHECK KEYS ---
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

    // --- INIT CLIENTS ---
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia" as any, 
    });

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // --- VERIFY STRIPE ---
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const customerEmail = session.customer_details?.email || session.customer_email;
    const subscriptionId = session.subscription as string;

    if (!customerEmail) throw new Error("No email found in Stripe Session");

    // --- GENERATE MAGIC LINK ---
    const isProduction = process.env.NODE_ENV === 'production';
    const siteUrl = isProduction ? 'https://onlinecertificate.org' : 'http://localhost:3000';

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customerEmail,
        options: {
            redirectTo: `${siteUrl}/auth/redeem?locale=${locale}`
        }
    });

    if (linkError) throw new Error(`Auth Error: ${linkError.message}`);
    if (!linkData.user) throw new Error("Auth Error: No user returned");

    // --- FORCE UPDATE ---
    const userId = linkData.user.id;
    console.log(`[Success] Upgrading User ${userId}...`);

    const { error: upsertError } = await supabaseAdmin.from('profiles').upsert({ 
        id: userId,
        email: customerEmail,
        subscription_tier: 'pro',
        subscription_id: subscriptionId,
        updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (upsertError) throw new Error(`DB Error: ${upsertError.message}`);

    // --- SUCCESS: REDIRECT ---
    revalidatePath('/', 'layout'); 
    revalidatePath(`/${locale}/dashboard`);

    if (linkData?.properties?.action_link) {
        redirect(linkData.properties.action_link);
    }

    return <div>Redirecting...</div>;

  } catch (err: any) {
    // 3. ERROR SCREEN (THIS WILL TELL US WHAT IS WRONG)
    console.error("Success Page Crash:", err);
    return (
        <div className="min-h-screen bg-white p-10 flex flex-col items-center justify-center">
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl max-w-lg w-full">
                <h1 className="text-xl font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6"/> 
                    Server Error Detected
                </h1>
                <p className="text-red-600 mt-2 font-mono text-sm break-all">
                    {err.message || "Unknown Error"}
                </p>
                <div className="mt-4 bg-white p-3 rounded border border-red-100 text-xs text-slate-500 font-mono">
                    Session ID: {session_id.slice(0, 10)}...
                </div>
            </div>
        </div>
    );
  }
}