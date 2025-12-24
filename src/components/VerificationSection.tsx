import Link from "next/link";
// Added CheckCircle2 to the import list below
import { ShieldCheck, BadgeCheck, Lock, Search, CheckCircle2 } from "lucide-react";

export function VerificationSection() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Text Content */}
        <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide mb-6">
                <ShieldCheck size={14} /> Official Registry
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
                Trust is good.<br/>
                Verification is better.
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                In a world of digital fakes, a certificate is only worth as much as its source. 
                Our platform provides a centralized registry where every issued credential can be instantly audited.
            </p>
            
            <ul className="space-y-4 mb-10">
                <li className="flex gap-4">
                    <div className="bg-slate-100 p-2 rounded-lg h-fit"><BadgeCheck className="text-blue-600" size={20} /></div>
                    <div>
                        <h4 className="font-bold text-slate-900">Issuer Verification</h4>
                        <p className="text-sm text-slate-500">We verify the identity of organizations (Schools, HR Depts) so you know exactly who signed the award.</p>
                    </div>
                </li>
                <li className="flex gap-4">
                    <div className="bg-slate-100 p-2 rounded-lg h-fit"><Lock className="text-emerald-600" size={20} /></div>
                    <div>
                        <h4 className="font-bold text-slate-900">Tamper-Proof Records</h4>
                        <p className="text-sm text-slate-500">Once issued, a certificate's data is frozen in our secure cloud database. It cannot be altered retroactively.</p>
                    </div>
                </li>
            </ul>

            <Link href="/verify" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                <Search size={18} /> Try Verifying a Code
            </Link>
        </div>

        {/* Right: Visual (Mockup) */}
        <div className="relative bg-slate-50 rounded-2xl border border-slate-200 p-8 shadow-xl">
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 animate-bounce delay-700">
                <BadgeCheck size={48} className="text-emerald-500" />
            </div>
            
            <div className="text-center space-y-6">
                 <div className="w-24 h-24 bg-white rounded-xl mx-auto flex items-center justify-center shadow-sm border border-slate-200">
                    {/* Mock QR Code */}

<img 
  src="/qr-code.png" 
  alt="certificate text tool" 
  className="w-full rounded-xl border border-slate-200 shadow-lg"
/>




                 </div>
                 <div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto"></div>
                 </div>
                 <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 size={16} /> Verified: Valid & Active
                 </div>
            </div>
        </div>

      </div>
    </section>
  );
}