import Link from "next/link";
import { ShieldCheck, BadgeCheck, Lock, Search, CheckCircle2, QrCode, FileCheck } from "lucide-react";
import { useTranslations } from 'next-intl';

export function VerificationSection() {
  const t = useTranslations('VerificationSection');

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
        
        {/* Left: Text Content */}
        <div>
            {/* Serif Headline */}
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                {t('title_1')} <br/>
                {t('title_2')}
            </h2>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                {t('desc')}
            </p>
            
            <ul className="space-y-6 mb-10">
                <li className="flex gap-4 items-start">
                    <div className="mt-1 bg-slate-50 p-2 rounded border border-slate-200 text-slate-700">
                        <BadgeCheck size={20} />
                    </div>
                    <div>
                        <h4 className="font-serif font-bold text-slate-900 text-lg">{t('feat_id_title')}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mt-1">
                            {t('feat_id_desc')}
                        </p>
                    </div>
                </li>
                <li className="flex gap-4 items-start">
                    <div className="mt-1 bg-slate-50 p-2 rounded border border-slate-200 text-slate-700">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h4 className="font-serif font-bold text-slate-900 text-lg">{t('feat_crypto_title')}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed mt-1">
                            {t('feat_crypto_desc')}
                        </p>
                    </div>
                </li>
            </ul>

            <Link href="/verify" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md">
                <Search size={18} /> {t('cta')}
            </Link>
        </div>

        {/* Right: Visual (Database Record Look) */}
        <div className="relative">
            {/* Background blob for depth */}
            <div className="absolute top-10 right-10 w-full h-full bg-slate-100 rounded-2xl -z-10 transform translate-x-4 translate-y-4"></div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden max-w-md mx-auto">
                
                {/* Header of the "Card" */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <FileCheck size={14} /> {t('card_record')} #882-991
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        {t('card_active')}
                    </div>
                </div>

                <div className="p-8 text-center space-y-6">
                      {/* QR Code Container */}
                      <div className="w-40 h-40 bg-white mx-auto p-2 border-2 border-slate-100 rounded-lg">
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded overflow-hidden relative group">
                             {/* Fallback Icon */}
                             <QrCode className="text-white opacity-20 absolute" size={80} />
                             
                             {/* Image */}
                             <img 
                                src="/qr-code.png" 
                                alt="Verification QR" 
                                className="w-full h-full object-cover relative z-10"
                             />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-2xl text-slate-900">{t('card_valid')}</h3>
                        <p className="text-slate-500 text-sm mt-2">
                           {t('card_issued')} <span className="font-mono text-slate-700">Dec 23, 2025</span>
                        </p>
                      </div>

                      <div className="border-t border-slate-100 pt-6">
                         <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold">
                            <CheckCircle2 size={20} />
                            <span>{t('card_match')}</span>
                         </div>
                         <p className="text-xs text-slate-400 mt-2">
                            {t('card_source')}
                         </p>
                      </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}