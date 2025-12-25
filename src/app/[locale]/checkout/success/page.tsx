import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { MagicLinkSender } from "./MagicLinkSender";
import { CheckCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

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
  const { session_id } = await searchParams;
  const { locale } = await params;

  if (!session_id) return <div className="p-4 text-red-500">Error: No session ID</div>;

  // 1. Verify Payment
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const customerEmail = session.customer_details?.email || session.customer_email;
  const subscriptionId = session.subscription as string;

  if (!customerEmail) return <div className="p-4 text-red-500">Error: No email found</div>;

  // 2. Determine Site URL
  const isProduction = process.env.NODE_ENV === 'production';
  const siteUrl = isProduction ? 'https://onlinecertificate.org' : 'http://localhost:3000';

  // 3. Generate Link (Passing Locale)
  const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: customerEmail,
    options: {
        redirectTo: `${siteUrl}/auth/redeem?locale=${locale}`
    }
  });

  const userId = linkData.user?.id;

  // 4. FORCE DB UPDATE (Upsert)
  if (userId) {
      console.log(`[Success] Force upgrading ${userId}`);
      await supabaseAdmin.from('profiles').upsert({ 
          id: userId,
          email: customerEmail,
          subscription_tier: 'pro',
          subscription_id: subscriptionId,
          updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
  }

  // 5. Clear Cache
  revalidatePath('/', 'layout'); 
  revalidatePath(`/${locale}/dashboard`);

  // 6. Redirect
  if (linkData?.properties?.action_link) {
      redirect(linkData.properties.action_link);
  }

  return <div className="p-10 text-center">Redirecting securely...</div>;
}