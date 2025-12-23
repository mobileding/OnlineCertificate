import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, Building2, CreditCard, ShieldCheck, Settings } from "lucide-react";
import { PasswordUpdateForm } from './PasswordUpdateForm'; 

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  // 1. Check Authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // === 3. THE GATEKEEPER (New Logic) ===
  // If they are not Pro or Elite, kick them out.
  const isPaid = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';
  
  if (!isPaid) {
    // Redirect them to pricing with a message (optional query param)
    redirect("/pricing?error=upgrade_required");
  }
  // ======================================

  const verificationSubject = encodeURIComponent(`Verification Request: ${profile?.organization_name || user.email}`);
  const verificationBody = encodeURIComponent(
    `Hello Support,\n\nI would like to verify my organization: "${profile?.organization_name || "My Organization"}".\n\nMy User ID is: ${user.id}\n\nPlease let me know what documents you need (e.g., Business License, Website link).\n\nThanks!`
  );
  const mailtoLink = `mailto:support@onlinecertificate.org?subject=${verificationSubject}&body=${verificationBody}`;

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your profile and subscription.</p>
        </div>

        {/* TOP ROW: Identity & Security */}
        <div className="grid gap-6 md:grid-cols-2">
          
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

          <PasswordUpdateForm />
        </div>

        {/* MIDDLE ROW: Organization */}
        <div className="grid gap-6 md:grid-cols-1">
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
                        <a 
                        href={mailtoLink}
                        className="inline-flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                        Request Manual Verification
                        </a>
                    </div>
                    )}
                </div>
                </div>
            </div>
        </div>

        {/* BOTTOM ROW: Subscription (Cleaned up for Paid Users Only) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-start">
             <div>
                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <CreditCard size={20} className="text-green-600"/> Current Plan
                </h2>
                <p className="text-slate-500 text-sm capitalize">
                    {profile.subscription_tier} Plan
                </p>
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
               <div className={`p-4 rounded-lg ${profile?.subscription_tier === 'elite' ? 'bg-purple-50 text-purple-900' : 'bg-slate-50'}`}>
                 <p className="text-2xl font-bold">
                    {profile?.subscription_tier === 'elite' ? 'Included' : 'Add-on'}
                 </p>
                 <p className="text-xs opacity-70 uppercase font-bold">Automation</p>
               </div>
               <div className="p-4 rounded-lg bg-blue-50 text-blue-900">
                 <p className="text-2xl font-bold">Unlocked</p>
                 <p className="text-xs opacity-70 uppercase font-bold">Custom Logo</p>
               </div>
             </div>
             
             <div className="mt-6">
                <a 
                    href="/api/stripe/portal" 
                    className="block text-center w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-lg font-bold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                    <Settings size={18} /> Manage Subscription
                </a>
             </div>
           </div>
        </div>

      </div>
    </main>
  );
}