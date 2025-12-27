"use client";

import { Link } from "@/i18n/routing";
import { 
  Palette, Type, FileText, Sparkles, LayoutDashboard, UserCircle, 
  ArrowRight, BookOpen 
} from "lucide-react";
import { useTranslations } from 'next-intl';

export default function GuidePage() {
  const t = useTranslations('Guide');

  return (
    <main className="min-h-screen bg-white font-sans text-slate-600">
      
      {/* 1. HERO HEADER */}
      <section className="py-20 bg-slate-900 text-white text-center px-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen size={14} className="text-blue-400" /> {t('hero_badge')}
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight">
          {t('hero_title')}
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          {t('hero_desc')}
        </p>
        <Link href="/create" className="px-8 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 transition-all text-sm shadow-lg shadow-blue-900/50">
          {t('hero_cta')}
        </Link>
      </section>

      {/* 2. THE TOOLBOX OVERVIEW */}
      <section className="py-20 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('toolbox_title')}</h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              {t('toolbox_desc')}
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                <Palette size={20} className="text-slate-600" /> 
                <span className="text-slate-700 text-sm">
                    <strong>{t('tool_design_label')}</strong> {t('tool_design_desc')}
                </span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                <Type size={20} className="text-slate-600" /> 
                <span className="text-slate-700 text-sm">
                    <strong>{t('tool_text_label')}</strong> {t('tool_text_desc')}
                </span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                <FileText size={20} className="text-slate-600" /> 
                <span className="text-slate-700 text-sm">
                    <strong>{t('tool_paper_label')}</strong> {t('tool_paper_desc')}
                </span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                <Sparkles size={20} className="text-slate-600" /> 
                <span className="text-slate-700 text-sm">
                    <strong>{t('tool_ai_label')}</strong> {t('tool_ai_desc')}
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <img 
              src="/guide-images/toolbox.png" 
              alt={t('alt_toolbox')}
              className="w-full rounded border border-slate-200 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 3. DESIGN TOOL */}
      <section className="py-20 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* IMAGE SLOT (Left on desktop) */}
          <div className="order-2 md:order-1 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <img 
              src="/guide-images/designtool.png" 
              alt={t('alt_design')}
              className="w-full rounded border border-slate-100"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-2 mb-4 text-purple-700 font-bold uppercase text-xs tracking-wider">
                <Palette size={16} /> {t('mod_1_badge')}
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('mod_1_title')}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {t('mod_1_desc')}
            </p>
            <div className="space-y-6 border-l-2 border-slate-200 pl-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('mod_1_feat_1_title')}</h3>
                <p className="text-sm text-slate-500 mt-1">{t('mod_1_feat_1_desc')}</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('mod_1_feat_2_title')}</h3>
                <p className="text-sm text-slate-500 mt-1">{t('mod_1_feat_2_desc')}</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{t('mod_1_feat_3_title')}</h3>
                <p className="text-sm text-slate-500 mt-1">{t('mod_1_feat_3_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEXT TOOL */}
      <section className="py-20 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold uppercase text-xs tracking-wider">
                <Type size={16} /> {t('mod_2_badge')}
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('mod_2_title')}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {t('mod_2_desc')}
            </p>
            <div className="grid grid-cols-1 gap-4">
               <div className="bg-slate-50 p-5 rounded border border-slate-200">
                  <span className="font-serif font-bold text-slate-900 block mb-1">{t('mod_2_feat_1_title')}</span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                      {t('mod_2_feat_1_desc')}
                  </span>
               </div>
               <div className="bg-slate-50 p-5 rounded border border-slate-200">
                  <span className="font-serif font-bold text-slate-900 block mb-1">{t('mod_2_feat_2_title')}</span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                      {t('mod_2_feat_2_desc')}
                  </span>
               </div>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <img 
              src="/guide-images/texttool.png" 
              alt={t('alt_text')}
              className="w-full rounded border border-slate-200 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 5. PAPER TOOL */}
      <section className="py-20 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
             <img 
              src="/guide-images/papertool.png" 
              alt={t('alt_paper')}
              className="w-full rounded border border-slate-100"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-2 mb-4 text-amber-700 font-bold uppercase text-xs tracking-wider">
                <FileText size={16} /> {t('mod_3_badge')}
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('mod_3_title')}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {t('mod_3_desc')}
            </p>
            <ul className="space-y-3 border-t border-slate-200 pt-4">
                <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <div className="w-3 h-3 bg-amber-400 rounded-sm border border-amber-500"></div> 
                    <span><strong>{t('mod_3_gold_label')}</strong> {t('mod_3_gold_desc')}</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <div className="w-3 h-3 bg-orange-100 rounded-sm border border-orange-200"></div> 
                    <span><strong>{t('mod_3_parchment_label')}</strong> {t('mod_3_parchment_desc')}</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <div className="w-3 h-3 bg-blue-100 rounded-sm border border-blue-200"></div> 
                    <span><strong>{t('mod_3_security_label')}</strong> {t('mod_3_security_desc')}</span>
                </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. AI WRITER */}
      <section className="py-20 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold uppercase text-xs tracking-wider">
                <Sparkles size={16} /> {t('mod_4_badge')}
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('mod_4_title')}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {t('mod_4_desc')}
            </p>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">{t('mod_4_ex_title')}</div>
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <span className="block text-xs font-bold text-slate-500 mb-1">{t('mod_4_input_label')}</span>
                        <div className="bg-white border border-slate-200 p-2 rounded text-sm text-slate-700 font-mono">{t('mod_4_input_text')}</div>
                    </div>
                    <ArrowRight className="text-slate-300 mt-6" size={16} />
                    <div className="flex-1">
                         <span className="block text-xs font-bold text-slate-500 mb-1">{t('mod_4_output_label')}</span>
                        <div className="bg-blue-50 border border-blue-100 p-2 rounded text-sm text-blue-900 font-serif leading-snug">{t('mod_4_output_text')}</div>
                    </div>
                </div>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <img 
              src="/guide-images/aiassistant.png" 
              alt={t('alt_ai')}
              className="w-full rounded border border-slate-200 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 7. DASHBOARD & PROFILE */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-serif font-bold mb-4">{t('account_title')}</h2>
                <p className="text-slate-400">{t('account_desc')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                
                {/* DASHBOARD CARD */}
                <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <LayoutDashboard className="text-blue-400" size={24} />
                        <h3 className="text-2xl font-serif font-bold">{t('dash_title')}</h3>
                    </div>
                    <p className="text-slate-400 mb-6 h-20 text-sm leading-relaxed">
                        {t('dash_desc')}
                    </p>
                    <img 
                      src="/guide-images/dashboard.png" 
                      alt={t('alt_dash')}
                      className="w-full rounded border border-slate-600 shadow-lg opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* PROFILE CARD */}
                <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <UserCircle className="text-purple-400" size={24} />
                        <h3 className="text-2xl font-serif font-bold">{t('profile_title')}</h3>
                    </div>
                    <p className="text-slate-400 mb-6 h-20 text-sm leading-relaxed">
                        {t.rich('profile_desc', {
                          strong_tag: (chunks) => <strong className="text-white">{chunks}</strong>
                        })}
                    </p>
                    <img 
                      src="/guide-images/profile.png" 
                      alt={t('alt_profile')}
                      className="w-full rounded border border-slate-600 shadow-lg opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>

            </div>
        </div>
      </section>

    </main>
  );
}