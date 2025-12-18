"use client";

import { useState } from 'react';
import { Check, ShieldCheck, Zap, User, X, Mail, UploadCloud, Ghost, History, Lock, HelpCircle } from 'lucide-react';
import { createBrowserClient } from "@supabase/ssr";
import Link from 'next/link';

// NOTE: We removed 'loadStripe' imports because we don't need them anymore!

const STRIPE_PRICE_ID = "price_1Q..."; // Keep your ID here

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        window.location.href = '/login'; 
        return;
    }

    try {
        // 2. Call our API
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: STRIPE_PRICE_ID,
            userId: user.id,
            email: user.email
          }),
        });

        const data = await res.json();
        
        // 3. Redirect using the URL from the server
        if (data.url) {
            window.location.href = data.url;
        } else {
            console.error("No URL returned", data);
            setLoading(false);
        }
    } catch (error) {
        console.error(error);
        setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 pt-20 pb-10 px-4">
      {/* ... (The rest of your JSX remains exactly the same) ... */}
      
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Plans for Every Stage</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Start as a guest, create an account to save your work, or upgrade to verify your organization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* TIER 1: GUEST */}
        <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 flex flex-col relative overflow-hidden">
          <div className="mb-6 opacity-75">
            <h3 className="text-lg font-bold text-slate-600 flex items-center gap-2">
                <Ghost size={20}/> Guest Visitor
            </h3>
            <p className="text-3xl font-bold mt-4 text-slate-500">Free</p>
            <p className="text-xs text-slate-400 mt-2">No sign-up required.</p>
          </div>

          <div className="flex-grow">
            <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-600">
                    <Check className="w-5 h-5 text-slate-400 flex-shrink-0" /> 
                    <span>Generate <strong>5 certificates</strong> / batch</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600">
                    <Check className="w-5 h-5 text-slate-400 flex-shrink-0" /> 
                    <span>Secure QR Code Verification</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400 pt-4 border-t border-slate-200 mt-4">
                    <X className="w-5 h-5 text-red-300 flex-shrink-0" /> 
                    <span>No Email Verification Badge</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400">
                    <X className="w-5 h-5 text-red-300 flex-shrink-0" /> 
                    <span>No <strong>History Dashboard</strong></span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400">
                    <X className="w-5 h-5 text-red-300 flex-shrink-0" /> 
                    <span>Cannot Edit/Delete Records</span>
                </li>
            </ul>
          </div>
          
          <Link href="/" className="w-full py-3 rounded-xl border border-slate-300 font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-all text-center block text-sm">
            Try as Guest
          </Link>
        </div>

        {/* TIER 2: REGISTERED */}
        <div className="bg-white p-8 rounded-2xl border-2 border-blue-100 shadow-lg shadow-blue-500/5 flex flex-col transform md:-translate-y-4">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                Recommended
            </div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User size={20} className="text-blue-500"/> Registered Account
            </h3>
            <p className="text-3xl font-bold mt-4 text-slate-900">$0 <span className="text-sm font-normal text-slate-500">/mo</span></p>
            <p className="text-xs text-slate-500 mt-2">For individuals & teachers.</p>
          </div>

          <div className="flex-grow">
            <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> 
                    <span>Limit increased to <strong>10 / batch</strong></span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> 
                    <span><strong>Verified Email</strong> Badge</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                    <History className="w-5 h-5 text-blue-500 flex-shrink-0" /> 
                    <span><strong>History Dashboard</strong> (Save Data)</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> 
                    <span>Edit & Delete Certificates</span>
                </li>
            </ul>
          </div>
          
          <Link href="/signup" className="w-full py-3 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 transition-all text-center block shadow-md shadow-blue-200">
            Create Free Account
          </Link>
          <p className="text-[10px] text-slate-400 mt-3 text-center">No credit card required</p>
        </div>

        {/* TIER 3: PRO */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden text-white flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={20}/> Verified Org
            </h3>
            <p className="text-3xl font-bold mt-4 text-white">$29 <span className="text-sm font-normal text-slate-400">/mo</span></p>
            <p className="text-xs text-slate-400 mt-2">For schools & businesses.</p>
          </div>
          
          <div className="flex-grow">
             <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" /> 
                    <span><strong>Unlimited</strong> Certificates</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" /> 
                    <span><strong>Verified Organization</strong> Seal</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-300">
                    <UploadCloud className="w-5 h-5 text-emerald-500 flex-shrink-0" /> 
                    <span><strong>Mass Upload</strong> (CSV Support)*</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-300">
                    <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" /> 
                    <span><strong>Email Sender</strong> Tool</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" /> 
                    <span>Custom Logo Upload</span>
                </li>
            </ul>
          </div>
          
          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-3 rounded-xl border border-slate-700 hover:bg-slate-800 font-bold text-white transition-all flex justify-center items-center gap-2"
          >
            {loading ? 'Processing...' : (
                <>
                    <Zap size={18} /> Upgrade to Pro
                </>
            )}
          </button>
          <p className="text-[10px] text-slate-500 mt-3 text-center">* Fair use limits apply.</p>
        </div>

      </div>
    </div>
  );
}