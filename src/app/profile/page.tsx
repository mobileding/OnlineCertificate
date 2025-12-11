import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, Building2, CreditCard, ShieldCheck } from "lucide-react";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch the Profile Data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // --- MISSING VARIABLES ADDED HERE ---
  const verificationSubject = encodeURIComponent(`Verification Request: ${profile?.organization_name || user.email}`);
  const verificationBody = encodeURIComponent(
    `Hello Support,\n\nI would like to verify my organization: "${profile?.organization_name || "My Organization"}".\n\nMy User ID is: ${user.id}\n\nPlease let me know what documents you need (e.g., Business License, Website link).\n\nThanks!`
  );
  const mailtoLink = `mailto:support@onlinecertificate.org?subject=${verificationSubject}&body=${verificationBody}`;
  // ------------------------------------

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your profile and subscription.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Identity Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <User size={20} className="text-blue-600"/> Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                <p className="font-medium text-slate-900">{user.email}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded mt-1">
                  <ShieldCheck size={12}/> Verified
                </span>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">User ID</label>
                <p className="font-mono text-xs text-slate-500 bg-slate-100 p-2 rounded break-all">
                  {user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Organization Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-indigo-600"/> Organization
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Org Name</label>
                <p className="font-medium text-slate-900">
                  {profile?.organization_name || "Not Set"}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Verification Status</label>
                {profile?.is_org_verified ? (
                  <div className="mt-1 flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <ShieldCheck size={16} />
                    <span className="text-sm font-bold">Verified Business</span>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="text-sm text-slate-500 mb-3">
                      Unverified (Generic Email Domain)
                    </p>
                    
                    {/* Working Button */}
                    <a 
                      href={mailtoLink}
                      className="inline-flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Request Manual Verification
                    </a>
                    <p className="text-[10px] text-slate-400 mt-2 leading-tight">
                      Requires proof of business (e.g., Website, License).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Subscription / Plan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-start">
             <div>
                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <CreditCard size={20} className="text-green-600"/> Current Plan
                </h2>
                <p className="text-slate-500 text-sm">Free Tier</p>
             </div>
             <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
               Active
             </span>
           </div>
           
           <div className="mt-6 border-t border-slate-100 pt-6">
             <div className="grid md:grid-cols-3 gap-4 text-center">
               <div className="p-4 bg-slate-50 rounded-lg">
                 <p className="text-2xl font-bold text-slate-900">Unlimited</p>
                 <p className="text-xs text-slate-500 uppercase font-bold">Certificates</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-lg">
                 <p className="text-2xl font-bold text-slate-900">Free</p>
                 <p className="text-xs text-slate-500 uppercase font-bold">Verification</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-lg opacity-50">
                 <p className="text-2xl font-bold text-slate-900">-</p>
                 <p className="text-xs text-slate-500 uppercase font-bold">Custom Domains</p>
               </div>
             </div>
             
             <button disabled className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-bold opacity-50 cursor-not-allowed">
                Upgrade Plan (Coming Soon)
             </button>
           </div>
        </div>

      </div>
    </main>
  );
}