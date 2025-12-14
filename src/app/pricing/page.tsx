"use client";

import { Check, X, Crown, Zap, ShieldCheck, Mail, History, Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* CORRECTED COMPONENT NAME */}

      <main className="py-20 px-4 sm:px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                Simple Pricing, <span className="text-blue-600">Professional Trust</span>
            </h1>
            <p className="text-xl text-slate-500">
                Start for free as an individual, or upgrade to issue Verified Organization certificates with unlimited scale.
            </p>
            
            {/* Toggle */}
            <div className="mt-8 inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    Monthly
                </button>
                <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    Yearly <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-1">-20%</span>
                </button>
            </div>
        </div>

        {/* PRICING GRID */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
            
            {/* PLAN 1: FREE / STARTER */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={18} /> Individual
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-900">$0</span>
                        <span className="text-slate-500 font-medium">/ forever</span>
                    </div>
                    <p className="mt-4 text-slate-500 text-sm">
                        Perfect for teachers, freelancers, and individuals issuing occasional awards.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <FeatureItem text="5 Certificates per Batch" />
                    <FeatureItem text="Verified Email Badge" highlight />
                    <FeatureItem text="Certificate History Dashboard" />
                    <FeatureItem text="Download PDF & ZIP" />
                    <FeatureItem text="Standard Quality (150 DPI)" />
                    <FeatureItem text="Organization Name on Certs" negative />
                    <FeatureItem text="Verified Organization Seal" negative />
                    <FeatureItem text="Bulk Email Sending" negative />
                </div>

                <Link href="/dashboard" className="block w-full py-4 rounded-xl font-bold text-center border-2 border-slate-100 bg-slate-50 text-slate-900 hover:bg-slate-100 hover:border-slate-200 transition-all">
                    Get Started for Free
                </Link>
            </div>

            {/* PLAN 2: PRO / ORGANIZATION */}
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-white transform md:-translate-y-4">
                {/* Popular Badge */}
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Most Popular
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Crown size={18} /> Organization
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-white">
                            {billingCycle === 'monthly' ? '$29' : '$24'}
                        </span>
                        <span className="text-slate-400 font-medium">/ month</span>
                    </div>
                    <p className="mt-4 text-slate-300 text-sm">
                        For businesses, schools, and NGOs requiring official verification and bulk power.
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <FeatureItem text="Unlimited Certificates" light />
                    <FeatureItem text="Verified Organization Seal" light highlight />
                    <FeatureItem text="Lifetime Storage & Hosting" light />
                    <FeatureItem text="High-Res Print Quality (300 DPI)" light />
                    <FeatureItem text="Priority Batch Processing" light />
                    <FeatureItem text="Custom Organization Profile" light />
                    <FeatureItem text="Remove 'Individual' Branding" light />
                    <div className="opacity-60 pt-2 border-t border-slate-700 mt-2">
                        <p className="text-xs font-bold text-blue-400 uppercase mb-2">Coming Soon</p>
                        <FeatureItem text="Mass Email Sending" light />
                        <FeatureItem text="Automated Renewals" light />
                    </div>
                </div>

                <button 
                    onClick={() => alert("Stripe Integration Coming in Next Session!")}
                    className="block w-full py-4 rounded-xl font-bold text-center bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-900/20 transition-all"
                >
                    Upgrade to Pro
                </button>
                <p className="text-center text-xs text-slate-500 mt-3">Secure payment via Stripe</p>
            </div>

        </div>

        {/* FAQ SECTION */}
        <div className="max-w-3xl mx-auto mt-24">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid gap-6">
                <FaqItem 
                    q="What is the 'Verified Organization Seal'?" 
                    a="Free users get a 'Verified Individual' badge (linked to email). Pro users get a 'Verified Organization' badge with a blue checkmark, linking to your official business name. This builds significantly more trust with recipients." 
                />
                <FaqItem 
                    q="Can I cancel anytime?" 
                    a="Yes. There are no contracts. You can downgrade to the Free plan whenever you like. Your existing certificates will remain safe." 
                />
                <FaqItem 
                    q="What happens to my certificates if I stop paying?" 
                    a="Pro certificates are stored for life. Even if you downgrade, previously issued certificates remain verifiable forever." 
                />
            </div>
        </div>

      </main>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function FeatureItem({ text, negative = false, highlight = false, light = false }: { text: string, negative?: boolean, highlight?: boolean, light?: boolean }) {
    return (
        <div className={`flex items-center gap-3 ${negative ? "opacity-50" : ""}`}>
            <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                negative ? "bg-slate-100 text-slate-400" : 
                highlight ? (light ? "bg-blue-500 text-white" : "bg-green-100 text-green-600") :
                (light ? "bg-slate-800 text-slate-300" : "bg-blue-50 text-blue-600")
            }`}>
                {negative ? <X size={12} /> : <Check size={12} />}
            </div>
            <span className={`text-sm font-medium ${
                highlight ? (light ? "text-white" : "text-slate-900") : 
                (light ? "text-slate-300" : "text-slate-600")
            }`}>
                {text}
            </span>
            {highlight && !negative && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${light ? "bg-blue-900 text-blue-200" : "bg-green-100 text-green-700"}`}>
                    Key
                </span>
            )}
        </div>
    );
}

function FaqItem({ q, a }: { q: string, a: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-2">{q}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
        </div>
    );
}