"use client";

import { useState } from "react";
import { Check, X, Zap, Crown, ArrowRight, Loader2, LayoutDashboard, BadgeCheck, UploadCloud, QrCode, Image as ImageIcon } from "lucide-react";
import { useTranslations } from 'next-intl';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: "guest_limit" | "free_limit"; 
}

export function PricingModal({ isOpen, onClose, reason }: PricingModalProps) {
  const t = useTranslations('PricingModal');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; 
      } else {
        alert(t('alert_checkout'));
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert(t('alert_connection'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
          <X size={24} />
        </button>

        <div className="text-center p-8 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {t('title')}
          </h2>
          <p className="text-slate-500">
              {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-8 pt-4">
          
          {/* VISITOR (Current) */}
          <div className="border border-slate-200 rounded-xl p-6 relative bg-slate-50 opacity-80">
            <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                {t('vis_badge')}
            </div>
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <Zap className="w-5 h-5 text-slate-400" /> {t('vis_title')}
            </h3>
            <p className="text-3xl font-bold text-slate-400 mt-4">{t('vis_price')} <span className="text-sm font-normal text-slate-400">{t('vis_period')}</span></p>
            
            <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500"/> {t('feat_pdf')}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                    <X className="w-4 h-4 text-slate-300"/> {t('feat_dash')}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                    <X className="w-4 h-4 text-slate-300"/> {t('feat_logo')}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                    <X className="w-4 h-4 text-slate-300"/> {t('feat_cloud')}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                    <X className="w-4 h-4 text-slate-300"/> {t('feat_badge')}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                    <X className="w-4 h-4 text-slate-300"/> {t('feat_bulk')}
                </li>
            </ul>
            <button onClick={onClose} className="mt-8 block w-full bg-white border border-slate-300 text-slate-500 font-bold py-2.5 rounded-lg text-center hover:bg-slate-100 transition-colors text-sm">
                {t('vis_btn')}
            </button>
          </div>

          {/* PRO PLAN ($6) */}
          <div className="border-2 border-blue-600 rounded-xl p-6 shadow-xl relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                {t('pro_badge')}
            </div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Crown className="w-5 h-5 text-blue-600" /> {t('pro_title')}
            </h3>
            <p className="text-3xl font-bold text-slate-900 mt-4">{t('pro_price')} <span className="text-sm font-normal text-slate-500">{t('pro_period')}</span></p>
            
            <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <LayoutDashboard className="w-4 h-4 text-blue-600"/> {t('feat_dash')}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <ImageIcon className="w-4 h-4 text-blue-600"/> {t('feat_logo')}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <QrCode className="w-4 h-4 text-blue-600"/> {t('feat_cloud')}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <BadgeCheck className="w-4 h-4 text-blue-600"/> {t('feat_badge')}
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <UploadCloud className="w-4 h-4 text-blue-600"/> {t('feat_bulk')}
                </li>
            </ul>
            
            {/* DIRECT TO STRIPE BUTTON */}
            <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="mt-8 w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                    <>{t('pro_btn')} <ArrowRight size={16} /></>
                )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}