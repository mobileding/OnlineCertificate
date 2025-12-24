"use client";

import { Check, ShieldCheck, Zap, X, Mail, UploadCloud, LayoutDashboard, Image as ImageIcon, Loader2, Crown, Rocket, MousePointerClick, BadgeCheck } from 'lucide-react';
import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react'; // <--- Suspense imported here
import Link from 'next/link';

// 1. Rename your main component to "PricingContent"
function PricingContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
   
  const [loading, setLoading] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string>('guest'); 
  const router = useRouter(); 

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
       
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        if (data?.subscription_tier) {
            setUserTier(data.subscription_tier); 
        }
      }
    };
    checkUser();
  }, []);

  const handleCheckout = async (plan: 'pro' | 'elite') => {
    setLoading(plan);

    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plan: plan,
                isUpgrade: userTier === 'pro' && plan === 'elite'
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            alert(`Payment failed: ${errorText}`);
            setLoading(null);
            return;
        }

        const data = await res.json();
        
        if (data.url) {
            window.location.href = data.url;
        } else {
            setLoading(null);
            alert("Something went wrong. Please try again.");
        }

    } catch (error) {
        console.error(error);
        setLoading(null);
        alert("Connection error. Please try again.");
    }
  };

  return (
    <div className="bg-slate-50 pt-20 pb-20 px-4 min-h-screen">

      {/* SUCCESS BANNER */}
      {isSuccess && (
        <div className="max-w-3xl mx-auto mb-10 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center shadow-sm" role="alert">
          <strong className="font-bold">Payment Successful! </strong>
          <span className="block sm:inline">Your plan has been updated!</span>
          <Link href="/" className="underline font-bold ml-2">Go to Dashboard &rarr;</Link>
        </div>
      )}
       
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Start for free, upgrade for branding, or go Elite for automation.
        </p>
      </div>

      {/* === PRICING GRID (3 Columns) === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto items-start">
        
        {/* === TIER 1: VISITOR (FREE) === */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4 opacity-80">
            <h3 className="text-lg font-bold text-slate-600 flex items-center gap-2">
                <MousePointerClick size={20}/> Visitor
            </h3>
            <p className="text-3xl font-bold mt-2 text-slate-400">Free</p>
            <p className="text-xs text-slate-400 mt-1">No account required.</p>
          </div>

          <div className="flex-grow">
            <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-sm text-slate-700 font-medium">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> 
                    <span>1 Certificate at a time</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700 font-medium">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> 
                    <span>Download PDF to Device</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400">
                    <X className="w-4 h-4 text-slate-300 flex-shrink-0" /> 
                    <span>Save / Dashboard</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400">
                    <X className="w-4 h-4 text-slate-300 flex-shrink-0" /> 
                    <span>Custom Logo Upload</span>
                </li>
            </ul>
          </div>
           
          <Link href="/" className="w-full py-2.5 rounded-lg border-2 border-slate-100 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all text-center block text-sm">
            Use Free Generator
          </Link>
        </div>

        {/* === TIER 2: PRO ($6) === */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden text-white flex flex-col transform md:-translate-y-4 md:scale-105 z-10">
           
          {(userTier !== 'pro' && userTier !== 'elite') && (
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Most Popular
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-blue-400" size={24}/> Pro Access
            </h3>
            <p className="text-4xl font-bold mt-4 text-white">$6 <span className="text-sm font-normal text-slate-400">/mo</span></p>
            <p className="text-xs text-slate-400 mt-2">For professionals & small biz.</p>
          </div>
           
          <div className="flex-grow">
             <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-200 font-medium">
                    <LayoutDashboard className="w-5 h-5 text-blue-500 flex-shrink-0" /> 
                    <span><strong>Dashboard</strong> & History</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-200 font-medium">
                    <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0" /> 
                    <span><strong>Custom Logo</strong> Upload</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-200 font-medium">
                    <UploadCloud className="w-5 h-5 text-blue-500 flex-shrink-0" /> 
                    <span><strong>Batch Upload</strong> (Simple)</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-200 font-medium">
                    <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0" /> 
                    <span><strong>Verified</strong> Badges</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-500 font-medium">
                    <X className="w-5 h-5 text-slate-600 flex-shrink-0" /> 
                    <span>Auto-Email Recipients</span>
                </li>
             </ul>
          </div>
           
          <button 
            onClick={() => handleCheckout('pro')}
            disabled={loading !== null || userTier === 'pro' || userTier === 'elite'}
            className={`w-full py-3 rounded-xl transition-all shadow-lg mb-2 flex items-center justify-center gap-2 font-bold
                ${(userTier === 'pro' || userTier === 'elite') 
                    ? 'bg-slate-700 text-slate-300 cursor-default' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/30'
                }`}
          >
            {loading === 'pro' ? <Loader2 className="animate-spin" /> : 
                userTier === 'pro' ? "Current Plan" : 
                userTier === 'elite' ? "Included in Elite" : "Get Pro"
            }
          </button>
        </div>

        {/* === TIER 3: ELITE ($22) === */}
        <div className={`p-6 rounded-2xl border-2 flex flex-col relative overflow-hidden shadow-lg transition-all
            ${userTier === 'elite'
                ? 'bg-purple-50 border-purple-200 shadow-purple-100' 
                : 'bg-white border-purple-100' 
            }`}>
           
          <div className="mb-4">
            <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                <Crown size={20} className="text-purple-600"/> Elite
            </h3>
            <p className="text-3xl font-bold mt-2 text-purple-900">$22 <span className="text-sm font-normal text-slate-400">/mo</span></p>
            <p className="text-xs text-slate-500 mt-1">For high-volume automation.</p>
          </div>

          <div className="flex-grow">
            <ul className="space-y-3 mb-6">
                <li className="flex gap-3 text-sm text-slate-700 font-bold">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" /> 
                    <span>Everything in Pro</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                    <Rocket className="w-4 h-4 text-purple-600 flex-shrink-0" /> 
                    <span><strong>No Limits</strong> (Fair Use)</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                    <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" /> 
                    <span><strong>Auto-Email</strong> Recipients</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                    <BadgeCheck className="w-4 h-4 text-purple-600 flex-shrink-0" /> 
                    <span><strong>Manual Verification</strong><br/>(Google/LinkedIn)</span>
                </li>
            </ul>
          </div>
           
          <button 
            onClick={() => handleCheckout('elite')}
            // Disable if it is already Elite (current)
            disabled={userTier === 'elite' || loading !== null} 
            className={`w-full py-2.5 rounded-lg font-bold text-center flex justify-center gap-2 items-center text-sm transition-all
                ${userTier === 'elite'
                    ? 'bg-purple-200 text-purple-700 cursor-default' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/30 cursor-pointer'
                }`}
          >
            {loading === 'elite' ? <Loader2 className="animate-spin" /> : 
               userTier === 'elite' ? "Current Plan" : "Get Elite"
            }
          </button>
        </div>

      </div>
    </div>
  );
}

// 2. Export the wrapper that includes Suspense
export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Pricing...</div>}>
      <PricingContent />
    </Suspense>
  );
}