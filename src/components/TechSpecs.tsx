import { UploadCloud, BrainCircuit, Database } from "lucide-react";
import { useTranslations } from 'next-intl';

export function TechSpecs() {
  const t = useTranslations('TechSpecs');

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-extrabold mb-6">{t('title')}</h2>
            <p className="text-slate-400 text-lg">
                {t('subtitle')}
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1: Smart Bulk */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors group">
                <div className="bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <UploadCloud className="text-blue-400 group-hover:text-white" size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 flex items-center gap-2">
                    {t('feat_1_title')} <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white uppercase tracking-wide font-sans">{t('feat_1_badge')}</span>
                </h3>
                <p className="text-slate-400 leading-relaxed">
                    {t('feat_1_desc')}
                </p>
            </div>

            {/* Feature 2: AI Composition */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-colors group">
                <div className="bg-purple-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                    <BrainCircuit className="text-purple-400 group-hover:text-white" size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{t('feat_2_title')}</h3>
                <p className="text-slate-400 leading-relaxed">
                    {t('feat_2_desc')}
                </p>
            </div>

            {/* Feature 3: Cloud Storage */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors group">
                <div className="bg-emerald-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                    <Database className="text-emerald-400 group-hover:text-white" size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{t('feat_3_title')}</h3>
                <p className="text-slate-400 leading-relaxed">
                    {t('feat_3_desc')}
                </p>
            </div>

        </div>
      </div>
    </section>
  );
}