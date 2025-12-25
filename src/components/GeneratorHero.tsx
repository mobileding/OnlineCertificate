import { Wand2, Loader2, GraduationCap, Award, Briefcase, ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';

interface GeneratorHeroProps {
  input: string;
  setInput: (value: string) => void;
  onGenerate: (override?: string) => void;
  loading: boolean;
  errorMessage: string;
}

export function GeneratorHero({ input, setInput, onGenerate, loading, errorMessage }: GeneratorHeroProps) {
  const t = useTranslations('GeneratorHero');
  
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
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center justify-center p-4">
      
      <div className="max-w-3xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* 1. HEADLINE */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight">
            {t('title_1')} <span className="text-blue-600">{t('title_2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {/* Rich text translation for bolding specific parts */}
            {t.rich('subtitle', {
                strong_tag: (chunks) => <strong className="font-bold text-slate-900">{chunks}</strong>
            })}
          </p>
        </div>

        {/* 2. MAIN INPUT INTERFACE */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 relative overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-400 transition-all flex flex-col min-h-[400px]">
          
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

        {/* 3. FOOTER INFO */}
        <div className="pt-8 flex justify-center gap-8 text-slate-400 text-sm">

        </div>

      </div>
    </div>
  );
}