import { createClient } from '@supabase/supabase-js';
import { CheckCircle, ShieldCheck, Calendar, Clock, AlertTriangle, Building2, User, XCircle } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getCertificateData(code: string) {
  // 1. Get the Certificate
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        {/* ... (Keep your existing Not Found UI here) ... */}
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100">
           <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
           <h1 className="text-2xl font-bold text-slate-900">Certificate Not Found</h1>
           <p className="text-slate-500 mt-2">The verification ID provided is invalid.</p>
        </div>
      </div>
    );
  }

  // Extract Profile (Issuer) Data safely
  // If issuer_id is null (Guest User), profile will be null
  const issuer = data.profiles as any; 
  const isGuest = !issuer;
  const issueDate = new Date(data.issue_date || data.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-green-200 shadow-sm">
            <CheckCircle size={16} /> Verified Authentic
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Certificate of Verification</h1>
        </div>

        {/* Certificate Card (Existing Code) */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
             <div className="relative z-10">
              <h2 className="text-xl font-medium opacity-80 uppercase tracking-widest text-xs mb-3">Recipient</h2>
              <p className="text-3xl md:text-5xl font-bold tracking-tight">{data.recipient_name}</p>
            </div>
          </div>
          
          <div className="p-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Certificate Title</p>
              <p className="text-lg font-semibold text-slate-800 leading-tight">{data.course_title}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Issuing Organization</p>
              <p className="text-lg font-semibold text-slate-800 leading-tight">{data.organization_name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Issue Date</p>
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar size={18} className="text-slate-400" />
                <span className="font-medium">{issueDate}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Verification ID</p>
              <p className="font-mono text-xs text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded border border-slate-200 break-all">
                {data.verification_code}
              </p>
            </div>
          </div>
        </div>

        {/* === NEW: ISSUER TRUST SCORECARD === */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" /> Issuer Reputation
            </h3>
          </div>
          
          <div className="p-6 grid gap-6 md:grid-cols-3">
            
            {/* 1. Email Verification */}
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${!isGuest && issuer.is_email_verified ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Issuer Identity</p>
                {!isGuest && issuer.is_email_verified ? (
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    <CheckCircle size={14} /> Email Verified
                  </p>
                ) : (
                   <p className="text-sm font-semibold text-slate-500 flex items-center gap-1">
                    Unverified Guest
                  </p>
                )}
              </div>
            </div>

            {/* 2. Organization Verification */}
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${!isGuest && issuer.is_org_verified ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Organization</p>
                {!isGuest && issuer.is_org_verified ? (
                  <div className="text-sm">
                    <p className="font-semibold text-blue-700 flex items-center gap-1">
                       <CheckCircle size={14} /> Verified Business
                    </p>
                    <p className="text-xs text-slate-500">{issuer.organization_name}</p>
                  </div>
                ) : (
                   <p className="text-sm font-semibold text-slate-500">
                    Self-Declared
                  </p>
                )}
              </div>
            </div>

            {/* 3. Account Status */}
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${!isGuest && issuer.account_status === 'active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Account Status</p>
                {!isGuest && issuer.account_status === 'active' ? (
                  <p className="text-sm font-semibold text-green-700">Active & Good Standing</p>
                ) : (
                  <p className="text-sm font-semibold text-slate-500">Guest / Inactive</p>
                )}
              </div>
            </div>

          </div>
        </div>
        {/* === END TRUST SCORECARD === */}

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg">
            Create Your Own Certificate
          </Link>
        </div>

      </div>
    </main>
  );
}