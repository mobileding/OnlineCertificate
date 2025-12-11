import { ShieldCheck, Zap, Globe, Lock, Award, FileCheck } from "lucide-react";
import Link from "next/link";

export function HomeContent() {
  return (
    <div className="bg-white border-t border-slate-100">
      
      {/* 1. HOW IT WORKS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Professional Verification in 3 Steps
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Stop sending unverified PDF attachments. Issue credentials that are secure, trackable, and instantly verifiable on the blockchain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="text-center space-y-4 relative">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">1. AI-Powered Design</h3>
            <p className="text-slate-500 leading-relaxed">
              Don't struggle with templates. Just describe your award (e.g. "Employee of the Month") and our AI generates the perfect layout and text instantly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4 relative">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">2. Secure Verification</h3>
            <p className="text-slate-500 leading-relaxed">
              Every certificate gets a unique 12-digit ID and QR code. This creates a permanent digital record that cannot be faked or Photoshopped.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4 relative">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto text-green-600 mb-6">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">3. Instant Distribution</h3>
            <p className="text-slate-500 leading-relaxed">
              Download high-res PDFs or send bulk email links. Recipients can share their "Verified Page" on LinkedIn with one click.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FEATURES GRID */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <Award className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Bulk Generation</h4>
              <p className="text-sm text-slate-500">Upload a CSV with 100 names and generate them all in seconds. Perfect for schools and events.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <ShieldCheck className="w-8 h-8 text-indigo-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Organization Status</h4>
              <p className="text-sm text-slate-500">Get your business verified so every certificate you issue carries your official "Blue Checkmark" seal.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <FileCheck className="w-8 h-8 text-green-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Permanent Storage</h4>
              <p className="text-sm text-slate-500">Access your dashboard to view, revoke, or re-download any certificate you have ever issued.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <details className="group bg-white p-6 rounded-xl border border-slate-200 cursor-pointer">
            <summary className="font-bold text-slate-800 list-none flex justify-between items-center">
              <span>Is this really free?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Yes. You can design, generate, and verify certificates for free. In the future, we may introduce premium features for high-volume power users, but the core tools will remain free.
            </p>
          </details>

          <details className="group bg-white p-6 rounded-xl border border-slate-200 cursor-pointer">
            <summary className="font-bold text-slate-800 list-none flex justify-between items-center">
              <span>How do I verify a certificate?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Simply scan the QR code on the PDF, or visit our Verification Page and enter the unique 12-digit ID found on the bottom of the document.
            </p>
          </details>

          <details className="group bg-white p-6 rounded-xl border border-slate-200 cursor-pointer">
            <summary className="font-bold text-slate-800 list-none flex justify-between items-center">
              <span>Can I upload my own logo?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Absolutely. In the "Edit" panel, click the "Design" tab to upload your school, company, or event logo (PNG/JPG supported).
            </p>
          </details>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-slate-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to issue credentials?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join thousands of organizations using OnlineCertificate.org to build trust.</p>
        <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-blue-500/25">
          Get Started for Free
        </Link>
      </section>

    </div>
  );
}