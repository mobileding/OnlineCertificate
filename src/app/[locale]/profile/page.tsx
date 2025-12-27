import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, Building2, CreditCard, ShieldCheck, Lock, ExternalLink } from "lucide-react"; 
import { PasswordUpdateForm } from './PasswordUpdateForm'; 
import { getTranslations } from 'next-intl/server'; 
import { OrgProfileForm } from '@/components/OrgProfileForm'; 
import { LogoUpload } from "@/components/LogoUpload"; // <--- Ensure this is imported

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Profile' });

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  // Check Authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // THE GATEKEEPER
  const isPaid = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';
  if (!isPaid) redirect("/pricing?error=upgrade_required");

  // Construct Mailto Link for Verification
  const verificationSubject = encodeURIComponent(`Verification Request: ${profile?.organization_name || user.email}`);
  const verificationBody = encodeURIComponent(
    `Hello Support,\n\nI would like to verify my organization: "${profile?.organization_name || "My Organization"}".\n\nMy User ID is: ${user.id}\n\nPlease let me know what documents you need (e.g., Business License, Website link).\n\nThanks!`
  );
  const mailtoLink = `mailto:support@onlinecertificate.org?subject=${verificationSubject}&body=${verificationBody}`;

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
          <p className="text-slate-500 mt-1">{t('subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* === LEFT SIDEBAR: User & Account Settings === */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Identity Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-xs uppercase tracking-wider">
                    <User size={14} className="text-slate-400"/> {t('sec_identity')}
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('label_email')}</label>
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="font-medium text-sm text-slate-900 truncate">{user.email}</span>
                            <ShieldCheck size={14} className="text-green-500 flex-shrink-0" title={t('badge_verified')} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t('label_uid')}</label>
                        <code className="block text-[10px] text-slate-400 font-mono break-all leading-tight">
                            {user.id}
                        </code>
                    </div>
                </div>
            </div>

            {/* 2. Subscription Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
                        <CreditCard size={14} className="text-slate-400"/> {t('sec_plan')}
                    </h2>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {t('status_active')}
                    </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4 text-center">
                    <span className="block font-bold text-slate-900 capitalize text-lg mb-1">{profile.subscription_tier}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                        {profile.subscription_tier === 'elite' ? "Institutional Tier" : "Standard Tier"}
                    </span>
                </div>

                <a href="/api/stripe/portal" className="block w-full text-center bg-white border border-slate-300 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
                    {t('btn_manage')} <ExternalLink size={12} />
                </a>
            </div>

            {/* 3. Security Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-xs uppercase tracking-wider">
                    <Lock size={14} className="text-slate-400"/> Security
                </h2>
                <PasswordUpdateForm />
            </div>
          </div>


          {/* === RIGHT MAIN: Organization Workspace === */}
          <div className="lg:col-span-8">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* Header Section */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                            <Building2 size={20} className="text-indigo-600"/> {t('sec_org')}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">{t('header_desc')}</p>
                    </div>

                    {/* Verification Status Badge */}
                    {profile?.is_org_verified ? (
                        <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
                            <ShieldCheck size={16} />
                            <span className="text-sm font-bold">{t('badge_biz_verified')}</span>
                        </div>
                    ) : (
                        <a href={mailtoLink} className="flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-black transition-colors shadow-md">
                            <ShieldCheck size={14} /> {t('btn_verify_req')}
                        </a>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8">
                    
                    {/* Unverified Warning Banner */}
                    {!profile?.is_org_verified && (
                        <div className="mb-8 bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                            <div className="bg-amber-100 p-1.5 rounded-full text-amber-600 flex-shrink-0 mt-0.5">
                                <ShieldCheck size={16} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-900">{t('status_unverified')}</h4>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed max-w-md">
                                    {t('warning_unverified')}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-8">
                        
                        {/* === COMBINED SECTION: LOGO + NAME === */}
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            
                            {/* 1. Logo Uploader (Left) */}
                            <div className="flex-shrink-0">
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-wide">
                                    {t('label_logo')}
                                </label>
                                <LogoUpload userId={user.id} currentLogoUrl={profile?.logo_url} />
                            </div>

                            {/* 2. Org Name (Right - Fills remaining space) */}
                            <div className="flex-grow w-full">
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-wide">
                                    {t('label_org_name')}
                                </label>
                                
                                {/* h-[6.5rem] ensures it aligns perfectly with the logo height */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl h-[6.5rem]"> 
                                    <div className="flex flex-col justify-center">
                                        <span className="font-bold text-slate-900 text-lg">
                                            {profile?.organization_name || t('val_not_set')}
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-tight">
                                            {t('lock_msg')}
                                        </p>
                                    </div>
                                    <Lock size={16} className="text-slate-300 mb-auto" title="Locked" />
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* === DIGITAL PRESENCE FORM === */}
                        <div>
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-slate-900">{t('digital_title')}</h3>
                                <p className="text-xs text-slate-500">{t('digital_desc')}</p>
                            </div>
                            <OrgProfileForm profile={profile} />
                        </div>
                    </div>

                </div>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}