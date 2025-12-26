"use client";

import { Check, ShieldCheck, Zap, X, Mail, UploadCloud, LayoutDashboard, Image as ImageIcon, Loader2, Crown, Rocket, MousePointerClick, BadgeCheck, Lock, AlertCircle } from 'lucide-react';
import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

function PricingContent() {
  const t = useTranslations('Pricing');
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
    
  const [loading, setLoading] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string>('guest'); 
  const [showUpgradeModal, setShowUpgradeModal] = useState(false); // State for Modal
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

  // 1. SPLIT LOGIC: Just opens the modal or proceeds to Stripe URL
  const handleCheckoutClick = (plan: 'pro' | 'elite') => {
    // If upgrading to Elite, show our nice modal instead of window.confirm
    if (userTier === 'pro' && plan === 'elite') {
        setShowUpgradeModal(true);
        return;
    }

    // Otherwise, proceed to normal checkout (redirects to Stripe)
    processPayment(plan, false);
  };

  // 2. THE ACTUAL API CALL
  const processPayment = async (plan: 'pro' | 'elite', isUpgrade: boolean) => {
    setLoading(plan);

    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plan: plan,
                isUpgrade: isUpgrade
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            alert(`Payment failed: ${errorText}`);
            setLoading(null);
            setShowUpgradeModal(false);
            return;
        }

        const data = await res.json();
        
        // Handle Instant Upgrade (Success: true)
        if (data.success) {
            // Optional: Add a small delay so user sees the spinner finish
            setTimeout(() => {
                alert("Upgrade Successful! You are now Elite.");
                window.location.reload(); 
            }, 500);
            return;
        }

        // Handle Standard Checkout (Redirect URL)
        if (data.url) {
            window.location.href = data.url;
        } else {
            setLoading(null);
            setShowUpgradeModal(false);
            alert("Something went wrong. Please try again.");
        }

    } catch (error) {
        console.error(error);
        setLoading(null);
        setShowUpgradeModal(false);
        alert("Connection error. Please try again.");
    }
  };

  return (
    <div className="bg-slate-50 pt-20 pb-32 px-4 min-h-screen font-sans relative">

      {/* === CUSTOM UPGRADE MODAL === */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => !loading && setShowUpgradeModal(false)}
            />

            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header with Icon */}
                <div className="bg-blue-600 p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">Confirm Upgrade</h3>
                    <p className="text-blue-100 text-sm mt-1">Move to the Elite Plan</p>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-slate-600">
                                <p className="font-semibold text-slate-800 mb-1">Immediate Prorated Charge</p>
                                <p>We will calculate the difference between Pro and Elite and charge your card on file immediately.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => processPayment('elite', true)}
                            disabled={loading === 'elite'}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            {loading === 'elite' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Confirm & Upgrade"
                            )}
                        </button>
                        
                        <button
                            onClick={() => setShowUpgradeModal(false)}
                            disabled={loading !== null}
                            className="w-full bg-white hover:bg-slate-50 text-slate-500 font-medium py-3 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* SUCCESS BANNER */}
      {isSuccess && (
        <div className="max-w-3xl mx-auto mb-10 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-lg relative text-center shadow-sm" role="alert">
          <strong className="font-bold">{t('success_banner')} </strong>
          <Link href="/" className="underline font-bold ml-2">{t('success_link')} &rarr;</Link>
        </div>
      )}
        
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
            {t('title')}
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('subtitle')}
        </p>
      </div>

      {/* === PRICING GRID === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
        
        {/* === TIER 1: PUBLIC ACCESS (Visitor) === */}
        <div className="bg-white p-8 rounded-lg border border-slate-200 flex flex-col relative h-full">
          <div className="mb-6 border-b border-slate-100 pb-6">
            <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2 mb-2">
                {t('tier_guest.name')}
            </h3>
            <p className="text-4xl font-bold text-slate-900">{t('tier_guest.price')}</p>
            <p className="text-sm text-slate-500 mt-2">{t('tier_guest.desc')}</p>
          </div>

          <div className="flex-grow">
            <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> 
                    <span>{t('tier_guest.feat_1')}</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> 
                    <span>{t('tier_guest.feat_2')}</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400">
                    <X className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" /> 
                    <span>{t('tier_guest.feat_3')}</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-400">
                    <X className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" /> 
                    <span>{t('tier_guest.feat_4')}</span>
                </li>
            </ul>
          </div>
          
          <Link href="/" className="w-full py-3 rounded border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-all text-center block text-sm">
            {t('tier_guest.cta')}
          </Link>
        </div>

        {/* === TIER 2: PROFESSIONAL (Pro) === */}
        <div className="bg-white p-0 rounded-lg border-2 border-blue-600 shadow-md relative flex flex-col h-full transform md:-translate-y-2">
           
           <div className="bg-blue-600 text-white text-xs font-bold text-center py-1 uppercase tracking-wider">
             {t('tier_pro.badge')}
           </div>

           <div className="p-8 flex flex-col h-full">
              <div className="mb-6 border-b border-slate-100 pb-6">
                <h3 className="text-xl font-serif font-bold text-blue-900 flex items-center gap-2 mb-2">
                    {t('tier_pro.name')}
                </h3>
                <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-bold text-slate-900">{t('tier_pro.price')}</p>
                    <span className="text-slate-500 font-normal">{t('tier_pro.period')}</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">{t('tier_pro.desc')}</p>
              </div>

              <div className="flex-grow">
                 <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-sm text-slate-800 font-medium">
                        <LayoutDashboard className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /> 
                        <span><strong>{t('tier_pro.feat_1')}</strong></span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-800 font-medium">
                        <ImageIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /> 
                        <span><strong>{t('tier_pro.feat_2')}</strong></span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-800 font-medium">
                        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /> 
                        <span><strong>{t('tier_pro.feat_3')}</strong></span>
                    </li>
                 </ul>
              </div>
               
              <button 
                onClick={() => handleCheckoutClick('pro')}
                disabled={loading !== null || userTier === 'pro' || userTier === 'elite'}
                className={`w-full py-3 rounded font-bold transition-all flex items-center justify-center gap-2
                   ${(userTier === 'pro' || userTier === 'elite') 
                       ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default' 
                       : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                   }`}
              >
                {loading === 'pro' ? <Loader2 className="animate-spin" /> : 
                   userTier === 'pro' ? t('tier_pro.cta_current') : 
                   userTier === 'elite' ? t('tier_pro.cta_included') : t('tier_pro.cta_select')
                }
              </button>
           </div>
        </div>

        {/* === TIER 3: INSTITUTIONAL (Elite) === */}
        <div className={`p-8 rounded-lg border flex flex-col relative h-full
            ${(userTier === 'pro' || userTier === 'elite')
                ? 'bg-slate-50 border-slate-300' 
                : 'bg-slate-50/50 border-slate-200' 
            }`}>
           
           {/* THE LOCK OVERLAY */}
           {userTier !== 'pro' && userTier !== 'elite' && (
            <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center text-center p-6">
              <div className="bg-white p-3 rounded-full border border-slate-200 shadow-sm mb-3">
                  <Lock className="w-5 h-5 text-slate-400" />
              </div>
              <h4 className="font-serif font-bold text-slate-800 mb-1">{t('tier_elite.lock_title')}</h4>
              <p className="text-xs text-slate-500 mb-4 max-w-[200px] leading-relaxed">
                  {t('tier_elite.lock_desc')}
              </p>
              <button 
                  onClick={() => handleCheckoutClick('pro')}
                  className="text-xs font-bold text-blue-700 hover:underline border border-blue-200 bg-blue-50 px-3 py-1.5 rounded"
              >
                  {t('tier_elite.lock_btn')}
              </button>
            </div>
          )}

          <div className="mb-6 border-b border-slate-200 pb-6 opacity-80">
            <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2 mb-2">
                {t('tier_elite.name')}
            </h3>
            <div className="flex items-baseline gap-1">
                <p className="text-4xl font-bold text-slate-900">{t('tier_elite.price')}</p>
                <span className="text-slate-500 font-normal">{t('tier_elite.period')}</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">{t('tier_elite.desc')}</p>
          </div>

          <div className="flex-grow opacity-80">
            <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-700 font-bold">
                    <Check className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5" /> 
                    <span>{t('tier_elite.feat_1')}</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                    <Mail className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" /> 
                    <span><strong>{t('tier_elite.feat_2')}</strong></span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700">
                    <UploadCloud className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" /> 
                    <span><strong>{t('tier_elite.feat_3')}</strong></span>
                </li>
                 <li className="flex gap-3 text-sm text-slate-700">
                    <BadgeCheck className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" /> 
                    <span><strong>{t('tier_elite.feat_4')}</strong></span>
                </li>
            </ul>
          </div>
           
          <button 
            onClick={() => handleCheckoutClick('elite')}
            disabled={userTier !== 'pro' || loading !== null} 
            className={`w-full py-3 rounded font-bold text-center block text-sm transition-all
                ${userTier === 'elite'
                    ? 'bg-slate-200 text-slate-600 cursor-default' // Current
                    : userTier === 'pro' 
                        ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer' // Upgrade
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed' // Locked
                }`}
          >
            {loading === 'elite' ? <Loader2 className="animate-spin mx-auto" /> : 
               userTier === 'elite' ? t('tier_elite.cta_current') : 
               userTier === 'pro' ? t('tier_elite.cta_upgrade') : t('tier_elite.cta_locked')
            }
          </button>
        </div>

      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Pricing...</div>}>
      <PricingContent />
    </Suspense>
  );
}