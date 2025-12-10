import { supabase } from '../../../lib/supabase';
import { CheckCircle2, XCircle } from "lucide-react";
import Link from 'next/link';

// Database Lookup
async function getCertificate(code: string) {
  const { data } = await supabase
    .from('certificates')
    .select('*')
    .eq('verification_code', code)
    .single();
  
  return data;
}

// FIX: Type 'params' as a Promise and await it inside
export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = await params; // <--- The Fix
  const code = resolvedParams.code;

  console.log("Searching for certificate code:", code); // Check your terminal!

  const certificate = await getCertificate(code);

  // 1. Scenario: Certificate NOT FOUND
  if (!certificate) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <XCircle className="text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Invalid Certificate</h1>
        <p className="text-gray-600 mt-2">We could not find a record with code: {code}</p>
        <Link href="/" className="mt-8 text-blue-600 hover:underline">Return Home</Link>
      </main>
    );
  }

  // 2. Scenario: VALID CERTIFICATE
  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      
      {/* The Trust Badge */}
      <div className="bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-full flex items-center gap-2 mb-10 shadow-sm">
        <CheckCircle2 size={20} />
        <span className="font-semibold">Officially Verified by OnlineCertificate.org</span>
      </div>

      {/* The Certificate Card */}
      <div className="bg-white p-12 rounded-xl shadow-xl max-w-3xl w-full border-t-8 text-center"
           style={{ borderTopColor: certificate.theme_color || '#000' }}>
        
        <p className="text-gray-500 uppercase tracking-widest text-sm mb-4">
          {certificate.organization_name || "Organization"}
        </p>
        
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
          {certificate.course_title || "Certificate of Completion"}
        </h1>
        
        <p className="text-gray-400 my-6">is hereby awarded to</p>
        
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
          {certificate.recipient_name}
        </h2>
        
        <div className="border-t border-gray-100 pt-8 flex justify-between text-left text-sm text-gray-500">
          <div>
            <p className="uppercase text-xs font-bold">Issue Date</p>
            <p>{new Date(certificate.issue_date).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="uppercase text-xs font-bold">Verification ID</p>
            <p className="font-mono text-gray-900">{certificate.verification_code}</p>
          </div>
        </div>
      </div>

      {/* Footer / Upsell */}
      <div className="mt-12 text-center text-gray-400 text-sm">
        <p>Want to issue certificates like this?</p>
        <Link href="/" className="text-blue-600 hover:underline">Get started for free</Link>
      </div>

    </main>
  );
}