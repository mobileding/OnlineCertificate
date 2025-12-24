import { ShieldCheck, Zap, Globe, Lock, Award, FileCheck, ChevronDown, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function HomeDetails() {
  return (
    <div className="bg-white font-sans text-slate-900">
      
      {/* 1. OLD HERO REMOVED 
         We deleted the top section. Now this component starts 
         directly with the "How it Works" section.
      */}

      {/* 2. HOW IT WORKS 
          Note: I removed the negative margin (-mt-20) from the previous version 
          so this sits cleanly below your New Hero. 
      */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Process</h2>
            <h3 className="text-3xl font-bold text-slate-900">How it works</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-300 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Design with AI</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Describe your award ("Best Dad", "Employee of Month") and our AI generates a professional layout instantly.
            </p>
          </div>

        {/* Step 2 - Clickable */}
        <Link 
          href="/verify" 
          className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-indigo-300 transition-all hover:-translate-y-1 block cursor-pointer"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
            <Lock size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
            2. Secure & Verify
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            We assign a unique 12-digit blockchain-style ID to every document. It's tamper-proof and instantly checkable.
          </p>
        </Link>

          {/* Step 3 */}
          <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-green-300 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-green-200">
              <Globe size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Distribute</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Send via email or download high-res PDF. Recipients get a dedicated "Verified Page" to share on LinkedIn.
            </p>
          </div>
        </div>
      </section>

      {/* 3. NEW PRICING SNAPSHOT (Inserted Here) */}
 <section className="py-12 px-4 max-w-5xl mx-auto border-t border-slate-100">
  <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Left: Text */}
      <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Professional Tools.<br/>Community Price.</h2>
          <p className="text-slate-500 text-lg">
              Generate single certificates for free. Upgrade to automate the busy work and add your brand.
          </p>
          <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span><strong>Visitor (Free):</strong> Single downloads & Standard templates</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span><strong>Pro ($6):</strong> Custom Logo, Dashboard & Bulk CSV</span>
              </div>
          </div>
          <div className="pt-4">
              <Link href="/pricing" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                  View Full Feature Comparison <ArrowRight size={16} />
              </Link>
          </div>
      </div>

      {/* Right: Visual Card (Highlighting the Pro Tier) */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">Pro Account</h3>
                <span className="bg-blue-600 text-xs px-2 py-1 rounded text-white font-bold">MOST POPULAR</span>
              </div>
              <div className="text-3xl font-bold mb-4">$6<span className="text-sm font-normal text-slate-400">/mo</span></div>
              
              <ul className="text-sm text-slate-300 space-y-2 mb-6">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-400"/> Upload Custom Logo</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-400"/> Bulk CSV Upload</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-400"/> Dashboard History</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-400"/> Verified Business Badge</li>
              </ul>

              <Link href="/register" className="block w-full bg-blue-600 hover:bg-blue-500 text-center py-2 rounded-lg font-bold transition-colors">
                  Get Pro
              </Link>
          </div>
      </div>
  </div>
</section>

      {/* 4. FEATURE STRIP (Compact) */}
      <section className="py-12 px-4 bg-slate-50/50">
<div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-10">
    {/* Feature 1 */}
    <div className="flex items-start gap-4 max-w-sm">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-blue-600">
            <Award size={28} />
        </div>
        <div>
            <h4 className="font-bold text-slate-900 text-lg">Bulk CSV Processing</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Generate 100s of certs in one click.
            </p>
        </div>
    </div>

    {/* Feature 2 */}
    <div className="flex items-start gap-4 max-w-sm">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-indigo-600">
            <ShieldCheck size={28} />
        </div>
        <div>
            <h4 className="font-bold text-slate-900 text-lg">Organization Seal</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Get verified to remove "Individual" label.
            </p>
        </div>
    </div>

    {/* Feature 3 */}
    <div className="flex items-start gap-4 max-w-sm">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-green-600">
            <FileCheck size={28} />
        </div>
        <div>
            <h4 className="font-bold text-slate-900 text-lg">Permanent Storage</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                We host your records forever. Free.
            </p>
        </div>
    </div>
</div>
      </section>

      {/* 5. FAQ (Ultra Compact) */}
<section className="py-16 px-4 max-w-3xl mx-auto">
  <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Common Questions</h2>
  
  <div className="space-y-4">
    {[
      { 
        q: "Is this really free?", 
        a: "Yes! You can design and download unlimited single certificates for free. We only charge for advanced features like uploading your own logo, bulk CSV generation, and dashboard storage." 
      },
      { 
        q: "How does verification work?", 
        a: "Every certificate gets a unique ID. Anyone can scan the QR code or enter the ID on our Verify page to confirm it matches our records." 
      },
      { 
        q: "What is the difference between Pro and Elite?", 
        a: "Pro ($6) is great for businesses needing logos and bulk creation. Elite ($22) adds Manual Verification (LinkedIn/Google) and the ability to email certificates directly to recipients." 
      }
    ].map((item, i) => (
        <details key={i} className="group bg-white border border-slate-200 rounded-xl open:border-blue-300 open:ring-1 open:ring-blue-100 transition-all shadow-sm">
          {/* QUESTION: Increased to text-lg (18px) and added p-4 padding */}
          <summary className="flex justify-between items-center p-4 text-lg font-semibold text-slate-900 cursor-pointer list-none select-none">
            {item.q}
            <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
          </summary>
          
          {/* ANSWER: Increased to text-base (16px) and text-slate-600 for better contrast */}
          <div className="px-4 pb-4 text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3 mt-1 mx-2">
            {item.a}
          </div>
        </details>
    ))}
  </div>
</section>

      {/* 6. CTA Footer */}
      <section className="bg-slate-900 text-white py-12 px-4 text-center">
         <div className="max-w-xl mx-auto">
             <h2 className="text-2xl font-bold mb-4">Start Issuing Credentials</h2>
             <div className="flex justify-center gap-4">
                 <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2">
                    Create Free Account <ArrowRight size={16} />
                 </Link>
             </div>
             <p className="text-slate-500 text-xs mt-4">No credit card required • Cancel anytime</p>
         </div>
      </section>

    </div>
  );
}