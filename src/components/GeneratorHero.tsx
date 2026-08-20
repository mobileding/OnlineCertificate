import { Wand2, Loader2, GraduationCap, Award, Briefcase, ArrowRight, Sparkles, ShieldCheck, QrCode, CheckCircle2, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { FeatureModal } from "./FeatureModal";
import { ExampleCertificateModal } from "./ExampleCertificateModal";

interface GeneratorHeroProps {
  input: string;
  setInput: (value: string) => void;
  onGenerate: (override?: string) => void;
  loading: boolean;
  errorMessage: string;
}

export function GeneratorHero({ input, setInput, onGenerate, loading, errorMessage }: GeneratorHeroProps) {
  const t = useTranslations('GeneratorHero');
  const tv = useTranslations('VerificationSection');
  const [activeModal, setActiveModal] = useState<'free' | 'qr' | null>(null);
  const [showExampleModal, setShowExampleModal] = useState(false);
  
  // Define presets using translations so they update when language changes
  const presets = [
    {
      icon: <Briefcase size={14} />,
      label: t('preset_corp_label'),
      prompt: t('preset_corp_prompt')
    },
    {
      icon: <GraduationCap size={14} />,
      label: t('preset_course_label'),
      prompt: t('preset_course_prompt')
    },
    {
      icon: <Award size={14} />,
      label: t('preset_civic_label'),
      prompt: t('preset_civic_prompt')
    }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100 flex flex-col items-center justify-center p-4">
      
      <div className="max-w-3xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* 1. HEADLINE */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight">
            {t('title_1')} <span className="text-blue-600">{t('title_2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {/* Rich text translation — each key phrase is a clickable link to its modal */}
            {t.rich('subtitle', {
                free_tag: (chunks) => (
                  <button
                    onClick={() => setActiveModal('free')}
                    className="font-bold text-slate-900 underline decoration-blue-300 decoration-2 underline-offset-2 hover:text-blue-600 transition-colors"
                  >
                    {chunks}
                  </button>
                ),
                verifiable_tag: (chunks) => (
                  <button
                    onClick={() => setShowExampleModal(true)}
                    className="font-bold text-slate-900 underline decoration-blue-300 decoration-2 underline-offset-2 hover:text-blue-600 transition-colors"
                  >
                    {chunks}
                  </button>
                ),
                qr_tag: (chunks) => (
                  <button
                    onClick={() => setActiveModal('qr')}
                    className="font-bold text-slate-900 underline decoration-blue-300 decoration-2 underline-offset-2 hover:text-blue-600 transition-colors"
                  >
                    {chunks}
                  </button>
                ),
            })}
          </p>
        </div>

        {/* 2. MAIN INPUT INTERFACE */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-300/50 border border-slate-200 relative overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-400 transition-all flex flex-col min-h-[400px]">
          
          {/* TEXTAREA */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={t('placeholder')}
            className="w-full flex-grow p-6 text-lg text-slate-800 placeholder:text-slate-300 resize-none outline-none bg-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                onGenerate();
              }
            }}
          />

          {/* PRESETS */}
          <div className="px-6 pb-6 pt-2 bg-gradient-to-t from-white via-white to-transparent">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 pl-1">
                 {input.length > 0 ? t('label_switch') : t('label_try')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {presets.map((p, i) => (
                  <button
                      key={i}
                      onClick={() => setInput(p.prompt)}
                      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all text-left group cursor-pointer"
                  >
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                          {p.icon}
                      </div>
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 line-clamp-1">
                          {p.label}
                      </span>
                  </button>
                  ))}
              </div>
          </div>
          
          {/* FOOTER BAR */}
          <div className="bg-slate-50 border-t border-slate-100 p-3 flex justify-between items-center relative z-30 h-16">
            <span className="text-xs text-slate-400 font-medium pl-3 hidden sm:block">
              <span className="font-bold">{t('tip_label')}</span> {t('tip_text')}
            </span>
            
            <button
              onClick={() => onGenerate()}
              disabled={loading || !input.trim()}
              className="ml-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> {t('btn_loading')}
                </>
              ) : (
                <>
                  <Wand2 size={16} /> {t('btn_generate')} <ArrowRight size={14} className="opacity-50"/>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
             <span className="font-bold">{t('error_label')}</span> {errorMessage}
          </div>
        )}

        {/* 3. FOOTER INFO — clickable feature badges */}
        <div className="pt-4 flex justify-center flex-wrap gap-3 text-sm">
          <button
            onClick={() => setActiveModal('free')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all font-medium"
          >
            <Sparkles size={14} className="text-blue-500" />
            {t('badge_free')}
          </button>

          <button
            onClick={() => setShowExampleModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all font-medium"
          >
            <ShieldCheck size={14} className="text-blue-500" />
            {t('badge_verifiable')}
          </button>

          <button
            onClick={() => setActiveModal('qr')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all font-medium"
          >
            <QrCode size={14} className="text-blue-500" />
            {t('badge_qr')}
          </button>
        </div>

      </div>

      <FeatureModal
        isOpen={activeModal === 'free'}
        onClose={() => setActiveModal(null)}
        icon={Sparkles}
        title={t('modal_free.title')}
        description={t('modal_free.desc')}
        faqs={[
          { question: t('modal_free.faq_1_q'), answer: t('modal_free.faq_1_a') },
          { question: t('modal_free.faq_2_q'), answer: t('modal_free.faq_2_a') },
          { question: t('modal_free.faq_3_q'), answer: t('modal_free.faq_3_a') },
        ]}
      />
      <FeatureModal
        isOpen={activeModal === 'qr'}
        onClose={() => setActiveModal(null)}
        icon={QrCode}
        title={t('modal_qr.title')}
        description={t('modal_qr.desc')}
      >
        {/* Example verification card, reused from the site's verification section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{tv('card_record')} #882-991</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {tv('card_active')}
            </div>
          </div>

          <div className="p-6 text-center space-y-4">
            <div className="w-28 h-28 bg-white mx-auto p-2 border-2 border-slate-100 rounded-lg">
              <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded overflow-hidden relative">
                <QrCode className="text-white opacity-20 absolute" size={56} />
                <img
                  src="/qr-code.png"
                  alt="Verification QR"
                  className="w-full h-full object-cover relative z-10"
                />
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg text-slate-900">{tv('card_valid')}</h4>
              <p className="text-slate-500 text-xs mt-1">
                {tv('card_issued')} <span className="font-mono text-slate-700">Dec 23, 2025</span>
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 size={16} />
                <span>{tv('card_match')}</span>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/verify"
          onClick={() => setActiveModal(null)}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md text-sm"
        >
          <Search size={16} /> {tv('cta')}
        </Link>
      </FeatureModal>
      <ExampleCertificateModal
        isOpen={showExampleModal}
        onClose={() => setShowExampleModal(false)}
      />
    </div>
  );
}