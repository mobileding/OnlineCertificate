import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

// 1. Init Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any, // or "2025-12-15.clover"
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

  // --- DEBUG LOGS ---
  const logs: string[] = [];
  const log = (msg: string) => {
      console.log(msg);
      logs.push(msg);
  };

  log("1. Starting Debug Process...");

  if (!session_id) {
     return <div className="p-10 text-red-500 font-bold">Error: No session_id found in URL.</div>;
  }

  // 3. Verify Payment
  let customerEmail = "";
  let subscriptionId = "";
  let stripeStatus = "Pending";
  
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    customerEmail = session.customer_details?.email || session.customer_email || "";
    subscriptionId = session.subscription as string;
    stripeStatus = "Success";
    log(`2. Stripe Verified. Email: ${customerEmail}`);
  } catch (e: any) {
    log(`2. Stripe Error: ${e.message}`);
    stripeStatus = "Failed";
  }

  // 4. Find/Create User
  let userId = "";
  let userStatus = "Pending";

  if (customerEmail) {
      // Try to find user directly first
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      const existing = users.find(u => u.email === customerEmail);
      
      if (existing) {
          userId = existing.id;
          userStatus = "Found Existing";
          log(`3. User found: ${userId}`);
      } else {
          // Attempt to generate link to create them
          const { data } = await supabaseAdmin.auth.admin.generateLink({
              type: 'magiclink',
              email: customerEmail
          });
          if (data.user) {
              userId = data.user.id;
              userStatus = "Created New";
              log(`3. User created/linked: ${userId}`);
          } else {
              userStatus = "Failed";
              log("3. Could not find or create user.");
          }
      }
  }

  // 5. ATTEMPT DB UPDATE (The Critical Part)
  let dbStatus = "Pending";
  let dbError = "";

  if (userId) {
      log("4. Attempting DB Upsert...");
      
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
            id: userId,
            email: customerEmail,
            subscription_tier: 'pro',
            subscription_id: subscriptionId,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
          dbStatus = "Failed";
          dbError = error.message;
          log(`4. DB Error: ${error.message} (Code: ${error.code})`);
      } else {
          dbStatus = "Success";
          log("4. DB Update Successful!");
      }
  } else {
      log("4. Skipped DB Update (No User ID)");
  }

  // --- RENDER THE DEBUG UI (NO REDIRECTS) ---
  return (
    <div className="min-h-screen bg-slate-50 p-10 font-mono text-sm">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        
        <div className="bg-slate-900 text-white p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-yellow-400" /> Debug Mode
          </h1>
          <p className="text-slate-400 mt-1">Session ID: {session_id.slice(0, 15)}...</p>
        </div>

        <div className="p-6 space-y-6">
            
            {/* STEP 1: STRIPE */}
            <div className="flex items-center justify-between border-b pb-4">
                <span className="font-bold text-slate-700">1. Verify Payment</span>
                {stripeStatus === "Success" ? (
                    <span className="flex items-center text-green-600 gap-2"><CheckCircle size={16}/> OK</span>
                ) : (
                    <span className="flex items-center text-red-600 gap-2"><XCircle size={16}/> Failed</span>
                )}
            </div>

            {/* STEP 2: USER */}
            <div className="flex items-center justify-between border-b pb-4">
                <span className="font-bold text-slate-700">2. Find User</span>
                {userId ? (
                    <span className="flex items-center text-green-600 gap-2"><CheckCircle size={16}/> {userStatus}</span>
                ) : (
                    <span className="flex items-center text-red-600 gap-2"><XCircle size={16}/> Failed</span>
                )}
            </div>

            {/* STEP 3: DATABASE */}
            <div className="flex items-center justify-between border-b pb-4">
                <span className="font-bold text-slate-700">3. Update Database</span>
                {dbStatus === "Success" ? (
                    <span className="flex items-center text-green-600 gap-2"><CheckCircle size={16}/> Updated "Pro"</span>
                ) : (
                    <span className="flex items-center text-red-600 gap-2"><XCircle size={16}/> Failed</span>
                )}
            </div>
            {dbError && <div className="bg-red-50 text-red-700 p-3 rounded">{dbError}</div>}

            {/* RAW LOGS */}
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg mt-6">
                <p className="text-slate-500 mb-2 border-b border-slate-700 pb-1">Server Logs:</p>
                {logs.map((l, i) => (
                    <div key={i}>{`> ${l}`}</div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <p className="text-slate-500 mb-4">Take a screenshot of this page if errors appear.</p>
                <a href={`/${locale}/dashboard`} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Try Manual Button to Dashboard
                </a>
            </div>

        </div>
      </div>
    </div>
  );
}