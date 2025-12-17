"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Search, Database, Building2, CheckCircle, ArrowRight, Lock, FileCheck, ArrowDown } from 'lucide-react';

export default function VerificationPortal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [part1, setPart1] = useState('');
  const [part2, setPart2] = useState('');
  const [part3, setPart3] = useState('');

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fullCode = `${part1}-${part2}-${part3}`.trim();
    
    // Updated validation length check (4+4+4+2 hyphens = 14)
    if (fullCode.length < 10) {
        alert("Please enter a valid code.");
        setLoading(false);
        return;
    }

    router.push(`/verify/${fullCode}`);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '');
    
    if (!pastedData) return;

    // Updated: Slicing chunks of 4
    const p1 = pastedData.substring(0, 4);
    const p2 = pastedData.substring(4, 8);
    const p3 = pastedData.substring(8, 12);

    setPart1(p1);
    if (p2) setPart2(p2);
    if (p3) setPart3(p3);

    // Updated focus logic checks
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
    const val = e.target.value;
    setter(val);

    // Updated: Trigger auto-focus at 4 chars
    if (val.length >= 4 && nextRef?.current) {
        nextRef.current.focus();
    }
    if (val.length === 0 && prevRef?.current) {
        prevRef.current.focus();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-600">
      
      {/* === HERO SECTION (Compact) === */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                <ShieldCheck size={10} /> Official Validation
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Verify a Certificate
            </h1>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-snug">
                Enter the 12-digit verification code found on the document to validate its authenticity.
            </p>

            {/* INPUT FORM */}
            <form onSubmit={handleVerify} className="max-w-lg mx-auto bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-1.5">
                
                <div className="flex-1 w-full grid grid-cols-3 gap-1.5 p-1">
                    <input 
                        ref={input1Ref}
                        value={part1}
                        onChange={(e) => handleInput(e, setPart1, input2Ref, null)}
                        onPaste={handlePaste}
                        maxLength={4} // Changed to 4
                        placeholder="XXXX"
                        className="w-full h-10 text-center text-base font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase placeholder:text-slate-300"
                    />
                    <div className="relative">
                        <input 
                            ref={input2Ref}
                            value={part2}
                            onChange={(e) => handleInput(e, setPart2, input3Ref, input1Ref)}
                            maxLength={4} // Changed to 4
                            placeholder="XXXX"
                            className="w-full h-10 text-center text-base font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase placeholder:text-slate-300"
                        />
                        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 text-slate-300 font-bold hidden sm:block">-</div>
                    </div>
                    <div className="relative">
                        <input 
                            ref={input3Ref}
                            value={part3}
                            onChange={(e) => handleInput(e, setPart3, null, input2Ref)}
                            maxLength={4} // Changed to 4
                            placeholder="XXXX"
                            className="w-full h-10 text-center text-base font-mono font-bold text-slate-800 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none uppercase placeholder:text-slate-300"
                        />
                         <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 text-slate-300 font-bold hidden sm:block">-</div>
                    </div>
                </div>

                <button 
                    ref={submitBtnRef}
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-md transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70 text-sm"
                >
                    {loading ? '...' : (
                        <>
                            <Search size={14} /> Verify
                        </>
                    )}
                </button>
            </form>
        </div>
      </div>

      {/* === EXPLANATION SECTION (Compact) === */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        
        {/* Why Verify? Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            
            {/* Left Text Block */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">What does "Verified" mean?</h2>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Tamper-Proof Integrity</h3>
                            <p className="text-slate-600 leading-snug text-sm">
                                Unlike a PDF edited in Photoshop, a verified record is pulled directly from our secure database. The details you see are exactly what was issued.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Issuer Identity Check</h3>
                            <p className="text-slate-600 leading-snug text-sm">
                                Verification validates <em>who</em> issued the award. We confirm the organization exists, preventing "fake degree" scams.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Diagram Block (New & Visual) */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Top: Issuer */}
                <div className="flex flex-col items-center z-10">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><Building2 size={18} /></div>
                    <p className="text-[10px] font-bold mt-1 uppercase tracking-wider text-blue-700">Issuer</p>
                </div>
                {/* Arrow */}
                <ArrowDown size={16} className="text-slate-300 my-1 z-10" />

                {/* Middle: The Secure Vault */}
                <div className="bg-slate-800 text-white p-3 rounded-lg shadow-md w-48 text-center relative overflow-hidden z-20 ring-2 ring-slate-100">
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-blue-500 via-blue-400 to-emerald-400"></div>
                     <ShieldCheck size={20} className="mx-auto mb-1 text-blue-200" />
                     <p className="font-bold text-xs relative z-10">Secure Cloud Ledger</p>
                     <p className="text-[9px] text-slate-300 relative z-10 leading-none">(Immutable Record)</p>
                </div>

                {/* Arrow */}
                 <ArrowDown size={16} className="text-slate-300 my-1 z-10" />

                {/* Bottom: Verifier */}
                <div className="flex flex-col items-center z-10">
                     <div className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-100"><Search size={18} /></div>
                     <p className="text-[10px] font-bold mt-1 uppercase tracking-wider text-green-700">Verifier (You)</p>
                </div>
                <p className="text-center text-[10px] text-slate-500 italic mt-3 z-10 leading-tight">
                    The code instantly fetches the original, untampered record.
                </p>
            </div>
        </div>

        {/* === FEATURES / BENEFITS (Compact) === */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
            {/* 1. Permanent Storage */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                <Database className="w-8 h-8 text-slate-400 mb-3" />
                <h3 className="font-bold text-slate-900 mb-1 text-sm">Permanent Storage</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Paper gets lost. Digital records are stored permanently in the cloud, accessible 24/7.
                </p>
            </div>

            {/* 2. Convenience */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                <FileCheck className="w-8 h-8 text-slate-400 mb-3" />
                <h3 className="font-bold text-slate-900 mb-1 text-sm">Instant Validation</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Verification happens in milliseconds, speeding up background checks.
                </p>
            </div>

            {/* 3. Verified Org Status */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl shadow-md text-white relative overflow-hidden">
                {/* Subtle background shine */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
                
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-8 h-8 text-blue-400" />
                    <span className="bg-blue-600/30 border border-blue-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Pro Feature</span>
                </div>
                <h3 className="font-bold text-white mb-1 text-sm relative z-10">Verified Organization</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 relative z-10">
                    Issuers who upgrade to Pro get a "Verified Organization" badge for massive credibility.
                </p>
                <Link href="/pricing" className="inline-flex items-center text-xs font-bold text-blue-300 hover:text-white transition-colors relative z-10">
                    View Pricing <ArrowRight size={14} className="ml-1" />
                </Link>
            </div>
        </div>
      </div>
    </main>
  );
}