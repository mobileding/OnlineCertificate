import { ShieldCheck, Zap, Globe, Lock, Award, FileCheck, ChevronDown, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function HomeContent() {
  return (
    // 1. Removed 'border-t' to reduce visual separation
    <div className="bg-white font-sans text-slate-900">
      
      {/* 2. REDUCED PADDING: Changed py-20 to pt-12 pb-32 
          - pt-12: Pulls the text UP closer to the Generator
          - pb-32: Adds extra space at bottom for the "Cards" to overlap
      */}
      <section className="pt-12 pb-32 px-4 bg-slate-900 text-white overflow-hidden relative">
         
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4f46e5 0%, transparent 50%)' }}>
         </div>

         <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">

            {/* Link to Pricing Page */}
            <Link href="/pricing" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-blue-200 mb-2 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer group">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Store verifiable Certificates
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
               The Standard for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Digital Credentials</span>
            </h2>
            
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
               Stop sending static PDFs. Issue certificates that are verifiable, secure, and impossible to fake. Join schools, NGOs, and companies upgrading their trust.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" /> Free Forever
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" /> No Credit Card
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" /> Instant Verify
                </div>
            </div>
         </div>
      </section>

      {/* 3. HOW IT WORKS (Increased negative margin to -mt-20 to pull cards up into the dark area) */}
      <section className="py-16 px-4 max-w-6xl mx-auto -mt-20 relative z-20">
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

{/* Step 2 - NOW CLICKABLE */}
<Link 
  href="/verify" 
  className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-indigo-300 transition-all hover:-translate-y-1 block cursor-pointer"
>
  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
    <Lock size={24} />
  </div>
  
  {/* Added 'group-hover:text-indigo-600' so the title lights up on hover */}
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

      {/* 3. FEATURE STRIP (Compact) */}
      <section className="py-12 px-4 border-y border-slate-100 bg-slate-50/50">
         <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-8">
             <div className="flex items-center gap-4 max-w-xs">
                 <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-600"><Award /></div>
                 <div>
                     <h4 className="font-bold text-slate-900 text-sm">Bulk CSV Processing</h4>
                     <p className="text-xs text-slate-500 mt-0.5">Generate 100s of certs in one click.</p>
                 </div>
             </div>
             <div className="flex items-center gap-4 max-w-xs">
                 <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-indigo-600"><ShieldCheck /></div>
                 <div>
                     <h4 className="font-bold text-slate-900 text-sm">Organization Seal</h4>
                     <p className="text-xs text-slate-500 mt-0.5">Get verified to remove "Individual" label.</p>
                 </div>
             </div>
             <div className="flex items-center gap-4 max-w-xs">
                 <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-green-600"><FileCheck /></div>
                 <div>
                     <h4 className="font-bold text-slate-900 text-sm">Permanent Storage</h4>
                     <p className="text-xs text-slate-500 mt-0.5">We host your records forever. Free.</p>
                 </div>
             </div>
         </div>
      </section>

      {/* 4. FAQ (Ultra Compact) */}
      <section className="py-16 px-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Common Questions</h2>
        
        <div className="space-y-3">
          {[
            { q: "Is this really free?", a: "Yes. You can design, generate, and verify certificates for free forever. We only charge for Organization Status." },
            { q: "How does verification work?", a: "Scan the QR code or enter the ID on our Verify page. It checks our secure database instantly." },
            { q: "Can I upload my logo?", a: "Yes! Use the 'Design' tab in the generator to add your custom branding." }
          ].map((item, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-lg open:border-blue-200 open:ring-1 open:ring-blue-100 transition-all">
                <summary className="flex justify-between items-center p-3 text-sm font-semibold text-slate-700 cursor-pointer list-none select-none">
                  {item.q}
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-3 pb-3 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2 mt-1 mx-3">
                  {item.a}
                </div>
              </details>
          ))}
        </div>
      </section>

      {/* 5. CTA Footer */}
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