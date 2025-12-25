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

  if (!session_id) return <div>Error: No session ID</div>;

  // 1. Get Payment Details
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const customerEmail = session.customer_details?.email || session.customer_email;
  const subscriptionId = session.subscription as string;

  if (!customerEmail) return <div>Error: No email found</div>;

  // 2. Determine Site URL
  const isProduction = process.env.NODE_ENV === 'production';
  const siteUrl = isProduction ? 'https://onlinecertificate.org' : 'http://localhost:3000';

  // 3. Generate Link (Also Creates User if needed)
  const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: customerEmail,
    options: {
        // Send them to redeem, passing the locale
        redirectTo: `${siteUrl}/auth/redeem?locale=${locale}`
    }
  });

  const userId = linkData.user?.id;

  // 4. ATTEMPT UPDATE (Best Effort)
  // We try to set Pro. Even if the DB overwrites it with Free, 
  // the Dashboard VIP Pass (Step 1) will let them in anyway.
  if (userId) {
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

  return <div>Redirecting...</div>;
}