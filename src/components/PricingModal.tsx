"use client";

import { Check, X, Zap, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: "guest_limit" | "free_limit"; // Why are we showing this?
}

export function PricingModal({ isOpen, onClose, reason }: PricingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>

        <div className="text-center p-8 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {reason === "guest_limit" ? "Create an Account to Continue" : "Unlock Unlimited Power"}
          </h2>
          <p className="text-slate-500">
            {reason === "guest_limit" 
              ? "Guests are limited to 5 certificates per batch. Sign up to increase your limit."
              : "You've reached the free tier limit. Upgrade to Pro for unlimited bulk generation."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-8 pt-4">
          
          {/* FREE PLAN */}
          <div className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-all relative">
            <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                Current
            </div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" /> Free Starter
            </h3>
            <p className="text-3xl font-bold text-slate-900 mt-4">$0 <span className="text-sm font-normal text-slate-400">/ forever</span></p>
            <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500"/> 50 Saved Certificates</li>
                <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500"/> 10 Names per Bulk CSV</li>
                <li className="flex items-center gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500"/> Standard Quality PDF</li>
            </ul>
            <Link href="/signup" className="mt-8 block w-full bg-slate-100 text-slate-700 font-bold py-2.5 rounded-lg text-center hover:bg-slate-200 transition-colors">
                {reason === "guest_limit" ? "Create Free Account" : "Your Current Plan"}
            </Link>
          </div>

          {/* PRO PLAN */}
          <div className="border-2 border-blue-600 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Recommended
            </div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" /> Pro Power
            </h3>
            <p className="text-3xl font-bold text-slate-900 mt-4">$29 <span className="text-sm font-normal text-slate-400">/ month</span></p>
            <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-900 font-medium"><Check className="w-4 h-4 text-blue-600"/> Unlimited Storage</li>
                <li className="flex items-center gap-2 text-sm text-slate-900 font-medium"><Check className="w-4 h-4 text-blue-600"/> 500+ Names per Bulk CSV</li>
                <li className="flex items-center gap-2 text-sm text-slate-900 font-medium"><Check className="w-4 h-4 text-blue-600"/> Verified Organization Badge</li>
            </ul>
            
            {/* UPDATED: Link to Pricing Page */}
            <Link 
                href="/pricing"
                className="mt-8 block w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
                See Benefits & Pricing <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}