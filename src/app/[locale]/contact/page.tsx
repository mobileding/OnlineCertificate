"use client";

import { useState } from "react";
import { Mail, MessageSquare, ChevronDown, BookOpen } from "lucide-react";

export default function ContactPage() {
  const [showEmail, setShowEmail] = useState(false);
  
  // 1. Break the email into parts so it doesn't appear in the source code
  const user = "support";
  const domain = "onlinecertificate.org";
  const email = `${user}@${domain}`;

  return (
    <main className="min-h-screen bg-white font-sans text-slate-600">
      
      {/* HERO SECTION */}
      <section className="py-20 bg-slate-900 text-white text-center px-4 border-b border-slate-800">
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
           Have questions about your certificates? Our support team is available to assist with verification and account inquiries.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        
        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Email Support */}
          <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 text-center hover:border-blue-300 transition-colors group">
            <div className="bg-white border border-slate-200 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
              <Mail className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Email Support</h3>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              For general inquiries, account issues, or institutional partnership opportunities.
            </p>
            
            {/* Logic: Reveal Email */}
            {!showEmail ? (
                <button 
                    onClick={() => setShowEmail(true)}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                    Reveal Email Address
                </button>
            ) : (
                <a 
                    href={`mailto:${email}`} 
                    className="text-blue-600 font-bold hover:underline text-lg block animate-in fade-in"
                >
                    {email}
                </a>
            )}
          </div>

          {/* Quick FAQ / Help */}
          <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 text-center hover:border-green-300 transition-colors group">
            <div className="bg-white border border-slate-200 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
              <MessageSquare className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Live Chat</h3>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Real-time assistance for verification issues. Available Mon-Fri, 9am - 5pm EST.
            </p>
            <span className="inline-flex items-center gap-2 bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center pb-2">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
                { q: "Are the certificates free?", a: "Yes. You can generate and download unlimited PDF certificates for free. Verification features require a free account." },
                { q: "How long do verification links last?", a: "Verification links are permanent as long as the issuing account remains active and in good standing with our terms of service." },
                { q: "How can I get a Verified Business badge?", a: "We automatically verify accounts that sign up with a custom institutional domain (e.g., registrar@university.edu). Gmail/Yahoo accounts require manual review." }
            ].map((item, i) => (
                <details key={i} className="group bg-white border border-slate-200 rounded-lg open:border-slate-300 open:ring-1 open:ring-slate-100 transition-all">
                    <summary className="flex justify-between items-center p-4 text-base font-bold text-slate-800 cursor-pointer list-none select-none">
                        {item.q}
                        <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3 mt-1">
                        {item.a}
                    </div>
                </details>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}