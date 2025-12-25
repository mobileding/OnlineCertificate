"use client";

import Link from "next/link";
import { CheckCircle, Upload, FileSpreadsheet, ArrowRight, BrainCircuit, FileText, Database, ShieldCheck } from "lucide-react";
import { useTranslations } from 'next-intl';

// HELPER: High-Fidelity Mini Certificate
// We pass the translation function 't' down to this component so it can translate its labels
const RealMiniCert = ({ name, org, desc, index, t }: { name: string, org: string, desc: string, index: number, t: any }) => (
  <div className="relative group perspective-1000">
      <div className="bg-white border-4 border-double border-slate-200 p-6 rounded-lg shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        
        {/* Background Texture Effect */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Badge Watermark */}
        <div className="absolute -bottom-4 -right-4 text-slate-100 rotate-12">
            <ShieldCheck size={80} />
        </div>

        <div className="relative z-10 text-center space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                {t('cert_title')}
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-slate-900 leading-none">
                {name}
            </h3>
            
            <div className="w-16 h-px bg-slate-300 mx-auto my-2"></div>
            
            <p className="text-xs text-slate-500 italic leading-relaxed px-2">
                "{desc}"
            </p>
            
            <div className="pt-3 mt-1">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('cert_issued_by')} {org}
                </div>
            </div>
        </div>
      </div>

      {/* Status Pill */}
      <div className="absolute -top-2 -right-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-emerald-200 flex items-center gap-1">
        <CheckCircle size={10} /> {t('cert_record_badge')} #{index}
      </div>
  </div>
);

export default function SmartBulkPage() {
  const t = useTranslations('SmartBulk');

  return (
    <main className="min-h-screen bg-white">
      
      {/* HERO SECTION */}
      <section className="py-20 bg-slate-900 text-white text-center px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wide mb-6">
            <BrainCircuit size={14} className="text-blue-400" /> {t('hero_badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight">
            {t('hero_title_1')} <br/>
            <span className="text-blue-400">
              {t('hero_title_2')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero_desc')}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/pricing" className="px-8 py-4 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 text-sm">
              {t('cta_upgrade')}
            </Link>
            <Link href="/dashboard" className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-lg font-bold hover:bg-slate-700 transition-all text-sm">
              {t('cta_demo')}
            </Link>
          </div>
        </div>
      </section>

      {/* THE PROBLEM / SOLUTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left: The Pain */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900">{t('legacy_title')}</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {t('legacy_desc')}
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-500">
                <FileSpreadsheet className="text-red-400" size={20} /> <span className="text-sm">{t('pain_syntax')}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <FileSpreadsheet className="text-red-400" size={20} /> <span className="text-sm">{t('pain_typos')}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <FileSpreadsheet className="text-red-400" size={20} /> <span className="text-sm">{t('pain_static')}</span>
              </li>
            </ul>
          </div>

          {/* Right: The Solution (Institutional) */}
          <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
              <Database size={200} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('solution_title')}</h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
               {/* Use t.rich to render HTML inside the translation */}
               {t.rich('solution_desc', {
                  strong: (chunks) => <strong className='font-bold text-slate-900'>{chunks}</strong>
               })}
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-medium text-slate-800">
                <CheckCircle className="text-emerald-600" size={20} /> 
                <span className="text-sm">
                    {t.rich('benefit_mapping', {
                        strong: (chunks) => <strong>{chunks}</strong>
                    })}
                </span>
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-800">
                <CheckCircle className="text-emerald-600" size={20} /> 
                <span className="text-sm">
                    {t.rich('benefit_dynamic', {
                        strong: (chunks) => <strong>{chunks}</strong>
                    })}
                </span>
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-800">
                <CheckCircle className="text-emerald-600" size={20} /> 
                <span className="text-sm">
                    {t.rich('benefit_multi', {
                        strong: (chunks) => <strong>{chunks}</strong>
                    })}
                </span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* --- COMBINED VISUALIZER --- */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('vis_title')}</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              {t('vis_desc')}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* 1. LEFT: RAW DATA INPUT */}
            <div className="w-full lg:w-5/12 sticky top-8">
                <div className="bg-slate-800 rounded-lg p-1 shadow-xl">
                    <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <FileText size={14} /> {t('vis_source_label')}
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                            </div>
                        </div>

                        {/* Raw Data Display (Kept hardcoded as it's a technical demo) */}
                        <div className="font-mono text-xs md:text-sm leading-8 text-slate-300 overflow-x-auto">
                            
                            {/* Row 1 */}
                            <div className="flex gap-4 hover:bg-slate-800/50 rounded px-1 transition-colors group/line cursor-default border-b border-slate-800/50">
                                <span className="text-slate-600 select-none w-4 text-right">1</span> 
                                <span className="group-hover/line:text-white transition-colors">
                                    <span className="text-blue-300">sarah smith</span>, <span className="text-orange-300">a1 real estate</span>, <span className="text-emerald-300">for closing $1m in sales in Q3</span>
                                </span>
                            </div>

                            {/* Row 2 */}
                            <div className="flex gap-4 hover:bg-slate-800/50 rounded px-1 transition-colors group/line cursor-default border-b border-slate-800/50">
                                <span className="text-slate-600 select-none w-4 text-right">2</span> 
                                <span className="group-hover/line:text-white transition-colors">
                                    <span className="text-blue-300">mike jones</span>, <span className="text-orange-300">big shipbuilder</span>, <span className="text-emerald-300">for 10 years of loyal service</span>
                                </span>
                            </div>

                            {/* Row 3 */}
                            <div className="flex gap-4 hover:bg-slate-800/50 rounded px-1 transition-colors group/line cursor-default">
                                <span className="text-slate-600 select-none w-4 text-right">3</span> 
                                <span className="group-hover/line:text-white transition-colors">
                                    <span className="text-blue-300">peter williams</span>, <span className="text-orange-300">pain free clinic</span>, <span className="text-emerald-300">being very attentive to the patient</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Connection Line (Desktop Only) */}
                    <div className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 text-slate-300 z-10">
                        <ArrowRight size={40} className="animate-pulse opacity-50" />
                    </div>
                </div>
            </div>

            {/* 2. RIGHT: GENERATED CERTIFICATES GRID */}
            <div className="w-full lg:w-7/12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    <RealMiniCert 
                        index={1}
                        name="Sarah Smith"
                        org="A1 Real Estate"
                        desc="For closing $1m in sales in Q3"
                        t={t}
                    />

                    <RealMiniCert 
                        index={2}
                        name="Mike Jones"
                        org="Big Shipbuilder"
                        desc="For 10 years of loyal service"
                        t={t}
                    />

                    <RealMiniCert 
                        index={3}
                        name="Peter Williams"
                        org="Pain Free Clinic"
                        desc="Being very attentive to the patient"
                        t={t}
                    />

                    {/* Upsell Card */}
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer group">
                        <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">{t('vis_upload_cta')}</span>
                        <span className="text-xs mt-1">{t('vis_upload_sub')}</span>
                    </div>

                </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">{t('faq_title')}</h2>
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">{t('faq_1_q')}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('faq_1_a')}
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">{t('faq_2_q')}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('faq_2_a')}
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}