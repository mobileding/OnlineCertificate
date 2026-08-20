"use client";

import { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from 'next-intl';
import { CertificateTemplate } from "./CertificateTemplate";

interface ExampleCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExampleCertificateModal({ isOpen, onClose }: ExampleCertificateModalProps) {
  // Reuses the same sample certificates shown in the TemplateGallery section,
  // so the example data only needs to be maintained/translated in one place.
  const t = useTranslations('TemplateGallery');
  const [index, setIndex] = useState(0);

  const templates = useMemo(() => [
    {
      label: t('tpl_1_label'),
      color: "#2563eb",
      badge: t('tpl_1_badge'),
      data: {
        recipient_name_placeholder: t('tpl_1_recipient'),
        certificate_title: t('tpl_1_cert_title'),
        organization_name: t('tpl_1_org'),
        action_text: t('tpl_1_desc'),
        signature_text: t('tpl_1_sign'),
        verification_code: "EMP-882-991",
      },
      frame: "Default",
      texture: "None",
      theme: "Modern"
    },
    {
      label: t('tpl_2_label'),
      color: "#d97706",
      badge: t('tpl_2_badge'),
      data: {
        recipient_name_placeholder: t('tpl_2_recipient'),
        certificate_title: t('tpl_2_cert_title'),
        organization_name: t('tpl_2_org'),
        action_text: t('tpl_2_desc'),
        signature_text: t('tpl_2_sign'),
        verification_code: "EDU-229-X77",
      },
      frame: "Double",
      texture: "Parchment",
      theme: "Classic"
    },
    {
      label: t('tpl_3_label'),
      color: "#dc2626",
      badge: t('tpl_3_badge'),
      data: {
        recipient_name_placeholder: t('tpl_3_recipient'),
        certificate_title: t('tpl_3_cert_title'),
        organization_name: t('tpl_3_org'),
        action_text: t('tpl_3_desc'),
        signature_text: t('tpl_3_sign'),
      },
      frame: "Thick",
      texture: "None",
      theme: "Bold"
    },
    {
      label: t('tpl_4_label'),
      color: "#10b981",
      badge: t('tpl_4_badge'),
      data: {
        recipient_name_placeholder: t('tpl_4_recipient'),
        certificate_title: t('tpl_4_cert_title'),
        organization_name: t('tpl_4_org'),
        action_text: t('tpl_4_desc'),
        signature_text: t('tpl_4_sign'),
      },
      frame: "Nest",
      texture: "None",
      theme: "Tech"
    },
    {
      label: t('tpl_5_label'),
      color: "#4f46e5",
      badge: t('tpl_5_badge'),
      data: {
        recipient_name_placeholder: t('tpl_5_recipient'),
        certificate_title: t('tpl_5_cert_title'),
        organization_name: t('tpl_5_org'),
        action_text: t('tpl_5_desc'),
        signature_text: t('tpl_5_sign'),
      },
      frame: "Elegant",
      texture: "Guilloche",
      theme: "Elegant"
    },
    {
      label: t('tpl_6_label'),
      color: "#ec4899",
      badge: t('tpl_6_badge'),
      data: {
        recipient_name_placeholder: t('tpl_6_recipient'),
        certificate_title: t('tpl_6_cert_title'),
        organization_name: t('tpl_6_org'),
        action_text: t('tpl_6_desc'),
        signature_text: t('tpl_6_sign'),
      },
      frame: "Dashed",
      texture: "None",
      theme: "Playful"
    }
  ], [t]);

  if (!isOpen) return null;

  const current = templates[index];
  const goPrev = () => setIndex((i) => (i === 0 ? templates.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === templates.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl animate-in zoom-in-95 duration-200">

        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X size={28} />
        </button>

        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Certificate preview */}
          <div className="relative w-full aspect-[1.414/1] bg-slate-100 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1123px] h-[794px] origin-center transform scale-[0.42] sm:scale-[0.55] md:scale-[0.75] pointer-events-none select-none shadow-lg">
              <CertificateTemplate
                data={current.data}
                customColor={current.color}
                frameStyle={current.frame}
                designTheme={current.theme as any}
                textureStyle={current.texture}
              />
            </div>
          </div>

          {/* Footer / label */}
          <div className="p-5 flex items-center justify-between border-t border-slate-100">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{current.badge}</div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">{current.label}</h3>
            </div>
            <div className="text-xs font-bold text-slate-400">{index + 1} / {templates.length}</div>
          </div>
        </div>

        {/* Nav arrows */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-14 bg-white border border-slate-200 p-3 rounded-full shadow-lg text-slate-700 hover:text-blue-600 hover:scale-110 transition-all"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-14 bg-white border border-slate-200 p-3 rounded-full shadow-lg text-slate-700 hover:text-blue-600 hover:scale-110 transition-all"
        >
          <ChevronRight size={22} />
        </button>

      </div>
    </div>
  );
}
