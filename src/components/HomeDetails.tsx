import { ShieldCheck, Zap, Globe, Lock, Award, FileCheck, ChevronDown, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export function HomeDetails() {
  const t = useTranslations('HomeDetails');

  // Define FAQs using translations
  const faqs = [
    { q: t('faq_1_q'), a: t('faq_1_a') },
    { q: t('faq_2_q'), a: t('faq_2_a') },
    { q: t('faq_3_q'), a: t('faq_3_a') }
  ];

  return (
    <div className="bg-white font-sans text-slate-900">
      
      {/* 2. HOW IT WORKS */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-slate-900">{t('how_title')}</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-300 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">{t('step_1_title')}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t('step_1_desc')}
            </p>
          </div>

          {/* Step 2 - Clickable */}
          <Link 
            href="/verify" 
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-indigo-300 transition-all hover:-translate-y-1 block cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {t('step_2_title')}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t('step_2_desc')}
            </p>
          </Link>

          {/* Step 3 */}
          <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-green-300 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-green-200">
              <Globe size={24} />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">{t('step_3_title')}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t('step_3_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. SUSTAINABILITY / PLANS SECTION */}
      <section className="py-16 px-4 max-w-5xl mx-auto border-t border-slate-200">
        <div className="text-center mb-12">
            <h2 className="text-2xl font-serif font-bold text-slate-900">{t('sus_title')}</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-lg">
                {t('sus_desc')}
            </p>
        </div>
      </section>

      {/* 4. REGISTRY STANDARDS */}
      <section className="py-16 px-4 bg-slate-100 border-y border-slate-200">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-16 gap-y-10">
              
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center max-w-xs">
                  <div className="mb-4 text-slate-700">
                      <Award size={32} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 text-xl">{t('std_open_title')}</h4>
                  <p className="text-base text-slate-600 mt-2 leading-relaxed">
                      {t('std_open_desc')}
                  </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center max-w-xs">
                  <div className="mb-4 text-slate-700">
                      <ShieldCheck size={32} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 text-xl">{t('std_ledger_title')}</h4>
                  <p className="text-base text-slate-600 mt-2 leading-relaxed">
                      {t('std_ledger_desc')}
                  </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center max-w-xs">
                  <div className="mb-4 text-slate-700">
                      <FileCheck size={32} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 text-xl">{t('std_privacy_title')}</h4>
                  <p className="text-base text-slate-600 mt-2 leading-relaxed">
                      {t('std_privacy_desc')}
                  </p>
              </div>
          </div>
      </section>

      {/* 5. FAQ */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 text-center">{t('faq_title')}</h2>
        
        <div className="space-y-4">
          {faqs.map((item, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-xl open:border-blue-300 open:ring-1 open:ring-blue-100 transition-all shadow-sm">
                <summary className="flex justify-between items-center p-4 text-lg font-semibold text-slate-900 cursor-pointer list-none select-none">
                  {item.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                
                <div className="px-4 pb-4 text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3 mt-1 mx-2">
                  {item.a}
                </div>
              </details>
          ))}
        </div>
      </section>

      {/* 6. CTA Footer */}
      <section className="bg-slate-900 text-white py-12 px-4 text-center">
         <div className="max-w-xl mx-auto">
             <h2 className="text-2xl font-serif font-bold mb-4">{t('cta_title')}</h2>
             <div className="flex justify-center gap-4">
                 <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2">
                    {t('cta_btn')} <ArrowRight size={16} />
                 </Link>
             </div>
             <p className="text-slate-500 text-xs mt-4">{t('cta_sub')}</p>
         </div>
      </section>

    </div>
  );
}