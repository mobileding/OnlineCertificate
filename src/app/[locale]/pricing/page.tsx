"use client";

import { Check, ShieldCheck, Zap, X, Mail, UploadCloud, LayoutDashboard, Image as ImageIcon, Loader2, Rocket, Lock, AlertCircle, PartyPopper } from 'lucide-react';
import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';

function PricingContent() {
  const t = useTranslations('Pricing');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Logic: Show success modal if URL has ?success=true
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [loading, setLoading] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string>('guest'); 
  const [showUpgradeModal, setShowUpgradeModal] = useState(false); 

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccessModal(true);
      // Clean URL without refresh
      window.history.replaceState({}, '', window.location.pathname);
    }

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
  }, [searchParams]);

  const handleCheckoutClick = (plan: 'pro' | 'elite') => {
    if (userTier === 'pro' && plan === 'elite') {
        setShowUpgradeModal(true);
        return;
    }
    processPayment(plan, false);
  };

  const processPayment = async (plan: 'pro' | 'elite', isUpgrade: boolean) => {
    setLoading(plan);
    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, isUpgrade }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            alert(`Payment failed: ${errorText}`);
            setLoading(null);
            setShowUpgradeModal(false);
            return;
        }

        const data = await res.json();
        
        if (data.success) {
            // Internal Upgrade Success (API handled it)
            setShowUpgradeModal(false);
            setShowSuccessModal(true);
            setLoading(null);
            // Refresh logic handled by user seeing the success modal
            return;
        }

        if (data.url) {
            window.location.href = data.url;
        } else {
            setLoading(null);
            setShowUpgradeModal(false);
            alert(t('modal_upgrade.alert_error'));
        }

    } catch (error) {
        console.error(error);
        setLoading(null);
        setShowUpgradeModal(false);
        alert(t('modal_upgrade.alert_connection'));
    }
  };

  // === DYNAMIC STYLING HELPERS ===
  // 1. Who gets the "Blue Border/Shadow" (Hero status)?
  //    - If Elite: The Elite Card
  //    - If Pro: The Pro Card
  //    - If Guest: The Pro Card (Upsell)
  const isProHero = userTier === 'guest' || userTier === 'pro';
  const isEliteHero = userTier === 'elite';

  return (
    <div className="bg-slate-50 pt-20 pb-32 px-4 min-h-screen font-sans relative">

      {/* === 1. SUCCESS CELEBRATION MODAL === */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
           <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PartyPopper className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('success_modal.title')}</h2>
              <p className="text-slate-600 mb-8">{t('success_modal.message')}</p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {t('success_modal.btn_text')}
              </button>
           </div>
        </div>
      )}

      {/* === 2. UPGRADE CONFIRMATION MODAL === */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !loading && setShowUpgradeModal(false)} />
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-blue-600 p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">{t('modal_upgrade.title')}</h3>
                    <p className="text-blue-100 text-sm mt-1">{t('modal_upgrade.subtitle')}</p>
                </div>
                <div className="p-6 md:p-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-900">
                            <p className="font-bold mb-1">{t('modal_upgrade.warning_title')}</p>
                            <p>{t('modal_upgrade.warning_desc')}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => processPayment('elite', true)}
                            disabled={loading === 'elite'}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            {loading === 'elite' ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> {t('modal_upgrade.btn_processing')}</>
                            ) : t('modal_upgrade.btn_confirm')}
                        </button>
                        <button
                            onClick={() => setShowUpgradeModal(false)}
                            disabled={loading !== null}
                            className="w-full bg-white hover:bg-slate-50 text-slate-500 font-medium py-3 rounded-lg transition-colors"
                        >
                            {t('modal_upgrade.btn_cancel')}
                        </button>
                    </div>
                </div>
            </div>
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
        
        {/* === TIER 1: VISITOR (Basic) === */}
        <div className="bg-white p-8 rounded-lg border border-slate-200 flex flex-col relative h-full hover:border-slate-300 transition-colors">
          <div className="mb-6 border-b border-slate-100 pb-6">
            <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2 mb-2">{t('tier_guest.name')}</h3>
            <p className="text-4xl font-bold text-slate-900">{t('tier_guest.price')}</p>
            <p className="text-sm text-slate-500 mt-2">{t('tier_guest.desc')}</p>
          </div>
          <div className="flex-grow">
            <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-600 mt-0.5" /> <span>{t('tier_guest.feat_1')}</span></li>
                <li className="flex gap-3 text-sm text-slate-700"><Check className="w-4 h-4 text-emerald-600 mt-0.5" /> <span>{t('tier_guest.feat_2')}</span></li>
                <li className="flex gap-3 text-sm text-slate-400"><X className="w-4 h-4 text-slate-300 mt-0.5" /> <span>{t('tier_guest.feat_3')}</span></li>
                <li className="flex gap-3 text-sm text-slate-400"><X className="w-4 h-4 text-slate-300 mt-0.5" /> <span>{t('tier_guest.feat_4')}</span></li>
            </ul>
          </div>
          <Link href="/" className="w-full py-3 rounded border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 text-center block text-sm">
            {t('tier_guest.cta')}
          </Link>
        </div>

{/* === TIER 2: PROFESSIONAL (Hero if Guest or Pro) === */}
        <div className={`
             rounded-lg flex flex-col h-full transform transition-all duration-300 relative
             ${isProHero 
                ? 'bg-white border-2 border-blue-600 shadow-xl md:-translate-y-4 z-10'  // HIGHLIGHTED
                : 'bg-white border border-slate-200 md:translate-y-0 opacity-100' // NORMAL (if Elite)
             }
        `}>
           {/* Badge logic: Yellow/Thunderbolt for Trial, Blue for Current */}
           {isProHero && (
                userTier === 'pro' ? (
                    // Case A: User is ALREADY Pro -> Blue Badge
                    <div className="bg-blue-600 text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider rounded-t-sm">
                        {t('tier_pro.cta_current')}
                    </div>
                ) : (
                    // Case B: User is Guest -> Yellow Thunderbolt Badge
                    <div className="bg-amber-400 text-slate-900 text-xs font-bold text-center py-1.5 uppercase tracking-wider rounded-t-sm flex items-center justify-center gap-2">
                        <Zap size={14} fill="currentColor" /> 
                        {t('tier_pro.trial_badge')}
                    </div>
                )
           )}

           <div className="p-8 flex flex-col h-full">
              <div className="mb-6 border-b border-slate-100 pb-6">
                <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2 mb-2">{t('tier_pro.name')}</h3>
                <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-bold text-slate-900">{t('tier_pro.price')}</p>
                    <span className="text-slate-500 font-normal">{t('tier_pro.period')}</span>
                </div>
                {userTier === 'guest' && (
                    <p className="text-sm font-bold text-emerald-600 mt-2">{t('tier_pro.trial_text')}</p>
                )}
              </div>

              <div className="flex-grow">
                 <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-sm text-slate-800 font-medium"><LayoutDashboard className="w-4 h-4 text-blue-600 mt-0.5" /> <span>{t('tier_pro.feat_1')}</span></li>
                    <li className="flex gap-3 text-sm text-slate-800 font-medium"><ImageIcon className="w-4 h-4 text-blue-600 mt-0.5" /> <span>{t('tier_pro.feat_2')}</span></li>
                    <li className="flex gap-3 text-sm text-slate-800 font-medium"><ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5" /> <span>{t('tier_pro.feat_3')}</span></li>
                 </ul>
              </div>
              
              <button 
                onClick={() => handleCheckoutClick('pro')}
                disabled={loading !== null || userTier === 'pro' || userTier === 'elite'}
                className={`w-full py-3 rounded font-bold transition-all flex items-center justify-center gap-2
                    ${(userTier === 'pro' || userTier === 'elite') 
                        ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                    }`}
              >
                {loading === 'pro' ? <Loader2 className="animate-spin" /> : 
                   userTier === 'pro' ? t('tier_pro.cta_current') : 
                   userTier === 'elite' ? t('tier_pro.cta_included') : 
                   t('tier_pro.cta_trial')
                }
              </button>
           </div>
        </div>

  {/* === TIER 3: INSTITUTIONAL (Elite) === */}
        <div className={`
            p-8 rounded-lg border flex flex-col relative h-full transition-all duration-300
            ${isEliteHero
                ? 'bg-white border-2 border-blue-600 shadow-xl md:-translate-y-4 z-10' // HIGHLIGHTED (if Elite)
                : 'bg-slate-50 border-slate-200 opacity-90' // NORMAL (if Guest/Pro)
            }
        `}>
           
           {/* Badge if Elite is Active */}
           {isEliteHero && (
                <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider rounded-t-lg transform -translate-y-full">
                    {t('tier_elite.cta_current')}
                </div>
           )}

           {/* LOCK OVERLAY (Only if Guest) */}
           {userTier !== 'pro' && userTier !== 'elite' && (
            <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center text-center p-6 rounded-lg">
              <div className="bg-white p-3 rounded-full border border-slate-200 shadow-sm mb-3">
                  <Lock className="w-5 h-5 text-slate-400" />
              </div>
              <h4 className="font-serif font-bold text-slate-800 mb-1">{t('tier_elite.lock_title')}</h4>
              <p className="text-xs text-slate-500 mb-4 max-w-[200px] leading-relaxed">{t('tier_elite.lock_desc')}</p>
              <button 
                  onClick={() => handleCheckoutClick('pro')}
                  className="text-xs font-bold text-blue-700 hover:underline border border-blue-200 bg-blue-50 px-3 py-1.5 rounded"
              >
                  {t('tier_elite.lock_btn')}
              </button>
            </div>
          )}

          <div className="mb-6 border-b border-slate-200 pb-6">
            <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2 mb-2">{t('tier_elite.name')}</h3>
            <div className="flex items-baseline gap-1">
                <p className="text-4xl font-bold text-slate-900">{t('tier_elite.price')}</p>
                <span className="text-slate-500 font-normal">{t('tier_elite.period')}</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">{t('tier_elite.desc')}</p>
          </div>

          <div className="flex-grow">
            <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-700 font-bold"><Check className="w-4 h-4 text-slate-900 mt-0.5" /> <span>{t('tier_elite.feat_1')}</span></li>
                <li className="flex gap-3 text-sm text-slate-700"><Mail className="w-4 h-4 text-slate-500 mt-0.5" /> <span>{t('tier_elite.feat_2')}</span></li>
                <li className="flex gap-3 text-sm text-slate-700"><UploadCloud className="w-4 h-4 text-slate-500 mt-0.5" /> <span>{t('tier_elite.feat_3')}</span></li>
                <li className="flex gap-3 text-sm text-slate-700"><Check className="w-4 h-4 text-slate-500 mt-0.5" /> <span>{t('tier_elite.feat_4')}</span></li>
            </ul>
          </div>
            
          <button 
            onClick={() => handleCheckoutClick('elite')}
            disabled={userTier !== 'pro' || loading !== null} 
            className={`w-full py-3 rounded font-bold text-center block text-sm transition-all
                ${userTier === 'elite'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 cursor-default' // Current Active Style (Light Blue)
                    : userTier === 'pro' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer' // Upgrade Style (Solid Blue) <--- CHANGED THIS
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed' // Locked (Gray)
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>}>
      <PricingContent />
    </Suspense>
  );
}