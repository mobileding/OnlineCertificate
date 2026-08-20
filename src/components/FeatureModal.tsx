"use client";

import { useState } from "react";
import { X, ChevronDown, LucideIcon } from "lucide-react";

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  faqs?: FaqItem[];
  children?: React.ReactNode;
}

export function FeatureModal({ isOpen, onClose, icon: Icon, title, description, faqs, children }: FeatureModalProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const hasFaqs = faqs && faqs.length > 0;
  const isWide = hasFaqs || !!children;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`bg-white rounded-2xl shadow-2xl w-full relative z-10 p-8 animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto
          ${isWide ? 'max-w-md text-left' : 'max-w-sm text-center'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className={isWide ? '' : 'flex flex-col items-center'}>
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-5">
            <Icon size={26} />
          </div>

          <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>

        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}

        {hasFaqs && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
            {faqs!.map((faq, i) => {
              const isOpenItem = openFaq === i;
              return (
                <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpenItem ? null : i)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-800">{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 text-slate-400 transition-transform ${isOpenItem ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpenItem && (
                    <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
