import { createClient } from '@supabase/supabase-js';
import { CheckCircle, Calendar, User, FileText, Hash, Stamp, ShieldCheck, Building2, Quote } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper to ensure valid accent color
function getAccentColor(color: string | null) {
  if (!color || color.length < 4 || color.includes('bg-')) return '#2563eb'; 
  return color.trim();
}

async function getCertificateData(code: string) {
  const { data: cert, error } = await supabase
    .from('certificates')
    .select(`
      *,
      profiles:issuer_id (
        email,
        is_email_verified,
        organization_name,
        is_org_verified,
        account_status
      )
    `)
    .eq('verification_code', code)
    .single();
    
  if (error || !cert) return null;
  return cert;
}

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getCertificateData(code);

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 font-mono">
        <div className="bg-white p-8 border-2 border-stone-300 border-dashed text-center max-w-md w-full">
           <div className="w-16 h-16 bg-stone-200 mx-auto mb-4 flex items-center justify-center text-stone-400">?</div>
           <h1 className="text-xl font-bold text-stone-800 uppercase">Record Not Found</h1>
           <p className="text-stone-500 mt-2 text-sm">ID: {code} does not exist.</p>
        </div>
      </div>
    );
  }

  const issuer = data.profiles as any; 
  const isGuest = !issuer;
  
  const issueDate = new Date(data.issue_date || data.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const accentColor = getAccentColor(data.theme_color);

  return (
    <main className="min-h-screen bg-stone-100 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* === THE CERTIFICATE CONTAINER === */}
        <div className="bg-[#fdfbf7] shadow-xl border border-stone-300 relative overflow-hidden">
            
            {/* Top "Binding" Strip */}
            <div className="h-4 w-full bg-stone-800 border-b-2 border-stone-300"></div>

            {/* Header Section */}
            <div className="p-8 border-b-2 border-stone-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        {/* Label */}
                        <div className="flex items-center gap-2 text-stone-400 mb-2">
                            <Building2 size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Organization Name</span>
                        </div>
                        {/* The Actual Org Name */}
                        <h1 className="text-3xl font-bold text-stone-900 uppercase tracking-tight leading-none">
                            {data.organization_name}
                        </h1>
                    </div>
                    
                    <div className="text-right">
                         <div className="inline-block border-2 border-stone-800 px-3 py-1 -rotate-2 opacity-80">
                            <span className="font-black text-stone-800 uppercase text-xs tracking-widest flex items-center gap-2">
                                <CheckCircle size={12} /> Verified Copy
                            </span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-stone-200 divide-y md:divide-y-0 md:divide-x divide-stone-200 bg-stone-50/50">
                <div className="p-6">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <User size={10} /> Award To
                    </p>
                    <p className="font-bold text-stone-800 text-lg">{data.recipient_name}</p>
                </div>
                <div className="p-6">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Hash size={10} /> Verification Code
                    </p>
                    <p className="font-mono text-stone-600">{data.verification_code}</p>
                </div>
                <div className="p-6">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar size={10} /> Date Issued
                    </p>
                    <p className="font-mono text-stone-600">{issueDate}</p>
                </div>
            </div>

            {/* Course Title Section (A+ Removed) */}
            <div className="p-8">
                <div className="w-full border border-stone-300 bg-white shadow-sm p-10 text-center">
                     <p className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
                        {data.course_title}
                    </p>
                </div>
            </div>

            {/* Comments Section (Renamed to "Official Remarks") */}
            {data.action_text && (
                <div className="px-8 pb-8">
                    <div className="bg-[#fffdf5] border border-stone-200 p-6 relative">
                        {/* Lined Paper Effect */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10" 
                             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2rem' }}>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <Quote size={12} className="text-stone-400" />
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                                Official Remarks
                            </p>
                        </div>
                        
                        <p className="text-stone-700 font-serif italic text-lg leading-loose relative z-10">
                            "{data.action_text}"
                        </p>
                    </div>
                </div>
            )}

            {/* Footer / Signature Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-10 mt-4">
                 <div className="flex flex-col justify-end">
                     <div className="flex items-center gap-2 mb-2">
                        <Stamp size={16} className="text-stone-300" />
                        <span className="text-xs text-stone-400 font-mono">AUTHTOKEN: {data.verification_code.substring(0,8)}...</span>
                     </div>
                 </div>

                 <div className="text-center md:text-right">
                     <div className="inline-block text-center min-w-[200px]">
                        <p className="text-2xl text-stone-800 mb-1" style={{ fontFamily: 'cursive' }}>
                            {data.signature_text || "Authorized Signature"}
                        </p>
                        <div className="h-0.5 bg-stone-800 w-full mb-1"></div>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                            Authorized Signature
                        </p>
                     </div>
                 </div>
            </div>

            {/* Bottom Color Strip */}
            <div className="h-2 w-full" style={{ backgroundColor: accentColor }}></div>
        </div>

        {/* === ISSUER TRUST CARD === */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">Issuer Verification</h3>
                    <p className="text-xs text-slate-500">Source of this credential</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${!isGuest && issuer.is_email_verified ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <User size={16} className={!isGuest && issuer.is_email_verified ? 'text-green-600' : 'text-slate-400'} />
                        <span className={`text-xs font-bold uppercase ${!isGuest && issuer.is_email_verified ? 'text-green-700' : 'text-slate-500'}`}>Identity</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                        {!isGuest && issuer.is_email_verified ? issuer.email : 'Unverified User'}
                    </p>
                </div>

                <div className={`p-4 rounded-lg border ${!isGuest && issuer.is_org_verified ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <Building2 size={16} className={!isGuest && issuer.is_org_verified ? 'text-blue-600' : 'text-slate-400'} />
                        <span className={`text-xs font-bold uppercase ${!isGuest && issuer.is_org_verified ? 'text-blue-700' : 'text-slate-500'}`}>Organization</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                        {!isGuest && issuer.is_org_verified ? issuer.organization_name : 'Unverified Org'}
                    </p>
                </div>
            </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-4 pb-12">
             <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors">
                <FileText size={16} />
                <span className="font-medium text-sm">Generate Report Card</span>
             </Link>
        </div>

      </div>
    </main>
  );
}