import { createClient } from '@supabase/supabase-js';
import { 
  CheckCircle, User, FileText, ShieldCheck, 
  Globe, Mail, Crown, Award, AlertTriangle, Briefcase, 
  Linkedin, MapPin, Building2 
} from 'lucide-react'; // Added Building2 for fallback icon
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- HELPER LOGIC ---
function isBusinessEmail(email: string) {
    if (!email) return false;
    const genericDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    const domain = email.split('@')[1];
    return !genericDomains.includes(domain);
}

function getIssuerLevel(count: number) {
  if (count > 500) return { title: "Authority", color: "bg-purple-100 text-purple-700", icon: Crown };
  if (count > 50) return { title: "Established", color: "bg-blue-100 text-blue-700", icon: Award };
  return { title: "Issuer", color: "bg-slate-100 text-slate-600", icon: User };
}

async function getCertificateData(code: string) {
  const { data: cert, error } = await supabase
    .from('certificates')
    .select(`
      *,
      profiles:issuer_id (
        email,
        logo_url,  
        website_url, is_website_verified,
        linkedin_url, is_linkedin_verified,
        google_business_url, is_google_verified,
        is_email_verified,
        organization_name,
        is_org_verified,
        account_status,
        subscription_tier,
        created_at
      )
    `)
    .eq('verification_code', code)
    .single();
    
  if (error || !cert) return null;

  const { count } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .eq('issuer_id', cert.issuer_id);

  return { ...cert, issuer_stats: { total_issued: count || 1 } };
}

export default async function VerifyPage({ params }: { params: Promise<{ locale: string; code: string }> }) {
  const { code, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VerifyResult' });

  const data = await getCertificateData(code);
  if (!data) notFound(); 

  const issuer = data.profiles as any; 
  const isGuest = !issuer;
  
  // Logic
  const issuerLevel = getIssuerLevel(data.issuer_stats?.total_issued || 0);
  const isBusinessDomain = !isGuest && isBusinessEmail(issuer.email);
  const isElite = !isGuest && issuer.subscription_tier === 'elite';
  const isPro = !isGuest && (issuer.subscription_tier === 'pro' || isElite);

  // 1. Resolve Logo URL
  let logoPublicUrl = null;
  if (issuer?.logo_url) {
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(issuer.logo_url);
      logoPublicUrl = urlData.publicUrl;
  }

  const issueDate = new Date(data.issue_date || data.created_at).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* === LEFT COLUMN: THE VISUAL PROOF === */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* The Certificate Preview Card */}
            <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="relative w-full aspect-[1.414] bg-white border-8 border-double border-slate-100 flex flex-col items-center justify-center p-8 text-center">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <Award size={300} />
                    </div>
                    <div className="relative z-10">
                        {/* 2. Optional: Show Logo on Certificate Preview too */}
                        {logoPublicUrl && (
			<div className="h-16 w-auto mx-auto mb-6 max-w-[200px] flex items-center justify-center">
                                <img src={logoPublicUrl} alt="Logo" className="w-full h-full object-contain grayscale opacity-80" />
                            </div>
                        )}
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900 mb-8">{data.organization_name}</h2>
                        <p className="text-sm text-slate-500 italic mb-2">This certifies that</p>
                        <h1 className="text-4xl font-serif font-bold text-slate-800 mb-2">{data.recipient_name}</h1>
                        <p className="text-sm text-slate-500 italic mb-4">has successfully completed</p>
                        <h3 className="text-xl font-bold text-slate-700 max-w-md mx-auto">{data.course_title}</h3>
                        <div className="mt-12 pt-8 border-t border-slate-200 w-full flex justify-between items-end text-xs text-slate-400 font-mono">
                            <div><p>DATE: {issueDate}</p></div>
                            <div className="text-right"><p>ID: {data.verification_code}</p></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meta Data Row */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-wrap gap-8 items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <CheckCircle size={16} /> <span className="font-bold text-sm">Valid & Active</span>
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Format</p>
                    <p className="font-medium text-slate-900 flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" /> Digital Verifiable
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Security</p>
                    <p className="font-medium text-slate-900 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-slate-400" /> Standard
                    </p>
                </div>
            </div>
        </div>

        {/* === RIGHT COLUMN: THE TRUST DOSSIER === */}
        <div className="lg:col-span-5 space-y-6">
            
            {/* ISSUER IDENTITY CARD */}
            <div className={`bg-white rounded-xl shadow-md border overflow-hidden relative ${isElite ? 'border-amber-200' : 'border-slate-200'}`}>
                
                <div className={`h-2 bg-gradient-to-r ${isElite ? 'from-amber-400 to-yellow-500' : 'from-slate-700 to-slate-900'}`}></div>
                
                <div className="p-6">
                    {/* 3. NEW: Header with Logo */}
                    <div className="flex items-start gap-4 mb-6">
                        {logoPublicUrl ? (
			<div className="h-16 w-auto min-w-[64px] max-w-[120px] rounded-lg border border-slate-100 bg-white p-2 shadow-sm flex-shrink-0 flex items-center justify-center">
                                <img 
                                    src={logoPublicUrl} 
                                    alt="Organization Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                                <Building2 size={24} />
                            </div>
                        )}

                        <div className="flex-grow">
                             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Issued By</h3>
                             <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                 {!isGuest ? issuer.organization_name : "Guest User"}
                             </h2>
                             {!isGuest && (
                                 <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <Globe size={10} /> Member since {new Date(issuer.created_at).getFullYear()}
                                 </p>
                             )}
                        </div>

                        {/* Badges */}
                        {isElite ? (
                            <div className="bg-amber-50 text-amber-700 p-2 rounded-lg border border-amber-200 shadow-sm" title="Elite Verified Partner">
                                <Crown size={24} fill="currentColor" className="text-amber-400" />
                            </div>
                        ) : isPro ? (
                            <div className="bg-slate-50 text-slate-700 p-2 rounded-lg border border-slate-200" title="Pro Member">
                                <Award size={24} />
                            </div>
                        ) : null}
                    </div>

                    {/* === DIGITAL FOOTPRINT ICONS === */}
                    <div className="mb-8">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Verified Presence</h3>
                        
                        <div className="grid grid-cols-3 gap-3">
                            
                            {/* 1. Website */}
                            {issuer.is_website_verified && issuer.website_url ? (
                                <a 
                                    href={issuer.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-3 rounded-lg border bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-colors relative"
                                >
                                    <Globe size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Website</span>
                                    <div className="absolute top-1 right-1"><CheckCircle size={10} className="text-indigo-500"/></div>
                                </a>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-slate-50 border-slate-100 text-slate-300">
                                    <Globe size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">{issuer.website_url ? 'Pending' : 'No Site'}</span>
                                </div>
                            )}

                            {/* 2. LinkedIn */}
                            {issuer.is_linkedin_verified && issuer.linkedin_url ? (
                                <a 
                                    href={issuer.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-3 rounded-lg border bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors relative"
                                >
                                    <Linkedin size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Linked</span>
                                    <div className="absolute top-1 right-1"><CheckCircle size={10} className="text-blue-500"/></div>
                                </a>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-slate-50 border-slate-100 text-slate-300">
                                    <Linkedin size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">{issuer.linkedin_url ? 'Pending' : 'No Profile'}</span>
                                </div>
                            )}

                            {/* 3. Google Business */}
                            {issuer.is_google_verified && issuer.google_business_url ? (
                                <a 
                                    href={issuer.google_business_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-3 rounded-lg border bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-colors relative group"
                                >
                                    <MapPin size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Google</span>
                                    <div className="absolute top-1 right-1"><CheckCircle size={10} className="text-emerald-600"/></div>
                                </a>
                            ) : (
                                <div className={`flex flex-col items-center justify-center p-3 rounded-lg border bg-slate-50 border-slate-100 text-slate-300`}>
                                    <MapPin size={20} className="mb-1" />
                                    <span className="text-[10px] font-bold uppercase">{issuer.google_business_url ? 'Pending' : 'No Listing'}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Verification Checklist */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Identity Checks</h3>
                        
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all"><User size={14}/></div>
                                <span className="text-sm font-medium text-slate-700">Account Status</span>
                            </div>
                            {isGuest ? (
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Guest</span>
                            ) : (
                                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded flex items-center gap-1"><CheckCircle size={10}/> Active</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all"><Mail size={14}/></div>
                                <span className="text-sm font-medium text-slate-700">Email Identity</span>
                            </div>
                            {!isGuest && issuer.is_email_verified ? (
                                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded flex items-center gap-1"><CheckCircle size={10}/> Verified</span>
                            ) : (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded flex items-center gap-1"><AlertTriangle size={10}/> Unverified</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all"><Briefcase size={14}/></div>
                                <span className="text-sm font-medium text-slate-700">Domain Type</span>
                            </div>
                            {isBusinessDomain ? (
                                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded flex items-center gap-1"><ShieldCheck size={10}/> Corporate</span>
                            ) : (
                                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Generic</span>
                            )}
                        </div>
                    </div>

                </div>
                
                <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Platform Verification</p>
                    <div className="flex justify-center items-center gap-1 opacity-50 grayscale hover:grayscale-0 transition-all cursor-help" title="Cryptographically secured record">
                        <ShieldCheck size={16} className="text-slate-600"/>
                        <span className="font-bold text-slate-700 text-xs">Secured by OnlineCertificate.org</span>
                    </div>
                </div>
            </div>

            <div className="text-center pt-4">
                 <Link href="/" className="block w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-black transition shadow-lg text-sm">
                    Issue Your Own Credentials
                </Link>
                <div className="mt-4 flex justify-center gap-4 text-xs text-slate-400">
                    <Link href="/report" className="hover:text-slate-600">Report Abuse</Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
                </div>
            </div>

        </div>

      </div>
    </main>
  );
}