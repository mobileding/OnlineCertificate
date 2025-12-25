import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { MagicLinkSender } from "./MagicLinkSender";
import { CheckCircle } from "lucide-react";

// 1. Init Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // Use your version
});

// 2. Init Supabase Admin (Bypasses security to create tokens)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  // If no session, kick them out
  if (!sessionId) {
     return (
        <div className="p-8 text-center text-red-500">
            Error: No payment session found.
        </div>
     );
  }

  // 3. Verify Payment with Stripe
  let customerEmail = "";
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    customerEmail = session.customer_details?.email || session.customer_email || "";
  } catch (e) {
    console.error("Stripe Error:", e);
    return <div>Error verifying payment.</div>;
  }

  if (!customerEmail) return <div>No email found in payment details.</div>;

  // 4. CHECK IF USER EXISTS
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  const existingUser = users.find(u => u.email === customerEmail);

  // === UPDATED LOGIC: DETERMINE IF WE SHOULD AUTO-LOGIN ===
  let shouldAutoLogin = false;

  if (!existingUser) {
      // Case 1: Brand new user (Doesn't exist yet)
      shouldAutoLogin = true;
  } else {
      // Case 2: User exists, BUT lets check if we can trust them
      const lastSignIn = existingUser.last_sign_in_at;
      const createdAt = new Date(existingUser.created_at).getTime();
      const now = new Date().getTime();
      
      // Is this account "Fresh"? (Created in the last 5 mins by webhook?)
      const isBrandNew = (now - createdAt) < 5 * 60 * 1000; 

      // If they NEVER logged in OR account is brand new (<5 mins), let them in.
      if (!lastSignIn || isBrandNew) {
          shouldAutoLogin = true;
      }
  }

  // === 5. EXECUTE AUTO-LOGIN ===
if (shouldAutoLogin) {
      const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: customerEmail,
        options: {
            // OLD (Broken):
            // redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?new_pro=true`

// NEW: Send to the client-side redeemer page
redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/redeem`
        }
      });

      if (linkData?.properties?.action_link) {
          redirect(linkData.properties.action_link);
      }
  }

  // === 6. EXISTING USER FALLBACK ===
  // If we reach here, it means they are an older, established user.
  // We show the success page and ask for verification (Safety First).
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