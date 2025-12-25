"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { 
  ShieldCheck, 
  Search, 
  Database, 
  Building2, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  FileCheck, 
  ArrowDown, 
  AlertCircle 
} from 'lucide-react';

export default function VerificationPortal() {
  const t = useTranslations('Verify'); // Initialize Translations
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // New states for error handling
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  
  const [part1, setPart1] = useState('');
  const [part2, setPart2] = useState('');
  const [part3, setPart3] = useState('');

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    
    const fullCode = `${part1}-${part2}-${part3}`.trim();
    const cleanCode = `${part1}${part2}${part3}`.trim(); 

    // 1. Check if empty
    if (cleanCode.length === 0) {
        triggerError(t('error_empty')); // Translated Error
        input1Ref.current?.focus();
        return;
    }

    // 2. Check length (Must be exactly 12 characters)
    if (cleanCode.length < 12) {
        triggerError(t('error_length')); // Translated Error
        return;
    }

    setLoading(true);

    // Optional: You could fetch an API here to check existence BEFORE redirecting
    // For now, we redirect safely
    router.push(`/verify/${fullCode}`);
  };

  // Helper to trigger shake animation and error text
  const triggerError = (msg: string) => {
    setError(msg);
    setIsShaking(true);
    setLoading(false);
    setTimeout(() => setIsShaking(false), 500); 
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setError(''); 
    const pastedData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '');
    
    if (!pastedData) return;

    const p1 = pastedData.substring(0, 4);
    const p2 = pastedData.substring(4, 8);
    const p3 = pastedData.substring(8, 12);

    setPart1(p1);
    if (p2) setPart2(p2);
    if (p3) setPart3(p3);

    if (p3.length > 0) {
        submitBtnRef.current?.focus();
    } else if (p2.length > 0) {
        input3Ref.current?.focus();
    } else if (p1.length === 4) {
        input2Ref.current?.focus();
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setter: (v: string) => void, 
    nextRef: React.RefObject<HTMLInputElement | null> | null,
    prevRef: React.RefObject<HTMLInputElement | null> | null
  ) => {
    setError(''); 
    const val = e.target.value.toUpperCase(); 
    setter(val);

    if (val.length >= 4 && nextRef?.current) {
        nextRef.current.focus();
    }
    if (val.length === 0 && prevRef?.current) {
        prevRef.current.focus();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-600">
      
      {/* === HERO SECTION === */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <ShieldCheck size={12} /> {t('hero_badge')}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
                {t('hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                {t('hero_desc')}
            </p>

            {/* INPUT FORM */}
            <form onSubmit={handleVerify} className="max-w-xl mx-auto flex flex-col items-center">
                
                {/* Inputs Container */}
                <div className={`
                    bg-slate-50 p-2 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-center gap-2 transition-all w-full
                    ${isShaking ? 'translate-x-[-5px] border-red-300 ring-2 ring-red-100' : 'border-slate-200'}
                `}>
                    <div className="flex-1 w-full grid grid-cols-3 gap-2 p-1">
                        <input 
                            ref={input1Ref}
                            value={part1}
                            onChange={(e) => handleInput(e, setPart1, input2Ref, null)}
                            onPaste={handlePaste}
                            maxLength={4}
                            placeholder="XXXX"
                            className={`w-full h-14 text-center text-xl font-mono font-bold text-slate-800 bg-white border rounded-xl focus:ring-4 outline-none uppercase placeholder:text-slate-200 transition-all
                                ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-300 focus:ring-blue-500/10 focus:border-blue-500'}
                            `}
                        />
                        <div className="relative">
                            <input 
                                ref={input2Ref}
                                value={part2}
                                onChange={(e) => handleInput(e, setPart2, input3Ref, input1Ref)}
                                maxLength={4}
                                placeholder="XXXX"
                                className={`w-full h-14 text-center text-xl font-mono font-bold text-slate-800 bg-white border rounded-xl focus:ring-4 outline-none uppercase placeholder:text-slate-200 transition-all
                                    ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-300 focus:ring-blue-500/10 focus:border-blue-500'}
                                `}
                            />
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold hidden sm:block text-lg">-</div>
                        </div>
                        <div className="relative">
                            <input 
                                ref={input3Ref}
                                value={part3}
                                onChange={(e) => handleInput(e, setPart3, null, input2Ref)}
                                maxLength={4}
                                placeholder="XXXX"
                                className={`w-full h-14 text-center text-xl font-mono font-bold text-slate-800 bg-white border rounded-xl focus:ring-4 outline-none uppercase placeholder:text-slate-200 transition-all
                                    ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-300 focus:ring-blue-500/10 focus:border-blue-500'}
                                `}
                            />
                             <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold hidden sm:block text-lg">-</div>
                        </div>
                    </div>

                    <button 
                        ref={submitBtnRef}
                        type="submit" 
                        disabled={loading}
                        className="w-full sm:w-auto h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 text-base whitespace-nowrap active:scale-95"
                    >
                        {loading ? t('btn_loading') : (
                            <>
                                <Search size={18} /> {t('btn_verify')}
                            </>
                        )}
                    </button>
                </div>

                {/* Nice Error Message */}
                {error && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl shadow-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    </div>
                )}

            </form>
        </div>
      </div>

      {/* === EXPLANATION SECTION === */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Why Verify? Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            
            {/* Left Text Block */}
            <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">{t('exp_title')}</h2>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-slate-900 text-xl mb-1">{t('integrity_title')}</h3>
                            <p className="text-slate-600 leading-relaxed text-base">
                                {t('integrity_desc')}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-slate-900 text-xl mb-1">{t('identity_title')}</h3>
                            <p className="text-slate-600 leading-relaxed text-base">
                                {/* Rich text translation to preserve the italics */}
                                {t.rich('identity_desc', {
                                  italic: (chunks) => <em>{chunks}</em>
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Diagram Block */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Top: Issuer */}
                <div className="flex flex-col items-center z-10">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100"><Building2 size={24} /></div>
                    <p className="text-xs font-bold mt-2 uppercase tracking-wider text-blue-700">{t('diag_issuer')}</p>
                </div>
                {/* Arrow */}
                <ArrowDown size={20} className="text-slate-300 my-2 z-10" />

                {/* Middle: The Secure Vault */}
                <div className="bg-slate-800 text-white p-4 rounded-xl shadow-lg w-56 text-center relative overflow-hidden z-20 ring-4 ring-slate-100">
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-blue-500 via-blue-400 to-emerald-400"></div>
                      <ShieldCheck size={28} className="mx-auto mb-2 text-blue-200" />
                      <p className="font-bold text-sm relative z-10">{t('diag_ledger')}</p>
                      <p className="text-[10px] text-slate-300 relative z-10 leading-none">{t('diag_ledger_sub')}</p>
                </div>

                {/* Arrow */}
                 <ArrowDown size={20} className="text-slate-300 my-2 z-10" />

                {/* Bottom: Verifier */}
                <div className="flex flex-col items-center z-10">
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl border border-green-100"><Search size={24} /></div>
                      <p className="text-xs font-bold mt-2 uppercase tracking-wider text-green-700">{t('diag_verifier')}</p>
                </div>
                <p className="text-center text-xs text-slate-500 italic mt-4 z-10 leading-tight">
                    {t('diag_caption')}
                </p>
            </div>
        </div>

        {/* === FEATURES / BENEFITS === */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
            {/* 1. Permanent Storage */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group">
                <Database className="w-10 h-10 text-slate-400 mb-4 group-hover:text-blue-500 transition-colors" />
                <h3 className="font-serif font-bold text-slate-900 mb-2 text-lg">{t('feat_perm_title')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    {t('feat_perm_desc')}
                </p>
            </div>

            {/* 2. Convenience */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group">
                <FileCheck className="w-10 h-10 text-slate-400 mb-4 group-hover:text-blue-500 transition-colors" />
                <h3 className="font-serif font-bold text-slate-900 mb-2 text-lg">{t('feat_inst_title')}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    {t('feat_inst_desc')}
                </p>
            </div>

            {/* 3. Verified Org Status */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-md text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-xl"></div>
                
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-10 h-10 text-blue-400" />
                    <span className="bg-blue-600/30 border border-blue-500/30 text-[10px] font-bold px-2 py-1 rounded uppercase">{t('feat_org_badge')}</span>
                </div>
                <h3 className="font-serif font-bold text-white mb-2 text-lg relative z-10">{t('feat_org_title')}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 relative z-10">
                    {t('feat_org_desc')}
                </p>
                <Link href="/pricing" className="inline-flex items-center text-sm font-bold text-blue-300 hover:text-white transition-colors relative z-10">
                    {t('link_plans')} <ArrowRight size={16} className="ml-1" />
                </Link>
            </div>
        </div>
      </div>
    </main>
  );
}