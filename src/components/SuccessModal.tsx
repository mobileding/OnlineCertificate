"use client";

import { CheckCircle, X, Download, Loader2, Layers, FileText } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti"; 
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CertificateTemplate } from "./CertificateTemplate";
import { useTranslations } from 'next-intl';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id?: string;
    count?: number; 
    guest?: boolean;
    certificates?: { name: string; id: string }[]; 
    names?: string[];
    name?: string; // Single name
    design?: {
        title: string;
        org: string;
        msg: string;
        date: string;
        theme_color: string;
        frame: string;
        logo: string | null;
        theme?: "Modern" | "Classic" | "Playful" | "Minimal" | "Gothic" | "Tech" | "Bold" | "Elegant";
    }
  } | null;
}

export function SuccessModal({ isOpen, onClose, data }: SuccessModalProps) {
  const t = useTranslations('SuccessModal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0); 
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && data) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 70 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  const count = data.count || (data.certificates ? data.certificates.length : 1);
  const isBulk = count > 1;

  // === UNIFIED DOWNLOAD HANDLER (Single & Bulk) ===
  const handleDownload = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Allow UI update
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const items = data.certificates || (data.name ? [{name: data.name, id: data.id || "DEMO"}] : []);

    if (hiddenContainerRef.current && items.length > 0 && data.design) {
        const certs = hiddenContainerRef.current.children;
        const zip = new JSZip();

        for (let i = 0; i < certs.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 10)); // Yield

            const certElement = certs[i] as HTMLElement;
            const item = items[i];
            const recipientName = item.name;
            
            try {
                // Generate PDF
                const canvas = await html2canvas(certElement, { scale: 1.5, useCORS: true, logging: false });
                const imgData = canvas.toDataURL('image/jpeg', 0.8);
                const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1123, 794] });
                pdf.addImage(imgData, 'JPEG', 0, 0, 1123, 794);
                
                const safeName = recipientName.replace(/[^a-z0-9]/gi, '_');
                
                // IF SINGLE: Download PDF directly
                if (!isBulk) {
                    pdf.save(`${safeName}.pdf`);
                    setIsProcessing(false);
                    onClose();
                    return; 
                }

                // IF BULK: Add to Zip
                zip.file(`${safeName}.pdf`, pdf.output('blob'));
                setProgress(Math.round(((i + 1) / certs.length) * 100));
                
            } catch (err) {
                console.warn(`Skipped ${recipientName}`); 
            }
        }

        // Finish Bulk Zip
        if (isBulk) {
            let csvContent = "Recipient Name,Verification ID,Link\n";
            items.forEach(cert => {
                csvContent += `"${cert.name}",${cert.id},https://onlinecertificate.org/verify/${cert.id}\n`;
            });
            zip.file("Summary.csv", csvContent);
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `Certificates_Batch.zip`);
            setIsProcessing(false);
            onClose();
        }
    } else {
        setIsProcessing(false);
        alert(t('error_render'));
    }
  };

  return (
    <>
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="bg-green-600 p-6 text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"><X size={20} /></button>
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                        {isBulk ? <Layers className="w-8 h-8 text-white" /> : <CheckCircle className="w-8 h-8 text-white" />}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{isBulk ? t('header_batch') : t('header_single')}</h2>
                </div>

                <div className="p-6 space-y-6">
                    
                    {/* INFO BOX: Name or Count */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                        {isBulk ? (
                            <>
                                <p className="text-4xl font-bold text-slate-900 mb-1">{count}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">{t('label_generated')}</p>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-center mb-2 text-slate-300">
                                    <FileText size={32} />
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('label_ready')}</p>
                                <p className="text-lg font-bold text-slate-900 truncate px-4">
                                    {data.name || data.certificates?.[0]?.name || "Certificate"}.pdf
                                </p>
                            </>
                        )}
                    </div>

                    {/* BUTTON */}
                    <button 
                        onClick={handleDownload}
                        disabled={isProcessing}
                        className={`w-full h-12 rounded-xl font-bold transition-all relative overflow-hidden shadow-lg ${isProcessing ? 'bg-slate-100' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                    >
                        {isProcessing ? (
                            <>
                                <div className="absolute inset-0 bg-blue-100 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                                <div className="absolute inset-0 flex items-center justify-center gap-2 text-blue-700 z-10">
                                    <Loader2 className="animate-spin w-4 h-4" /> 
                                    <span className="text-sm">
                                        {isBulk ? t('btn_processing_batch', { progress }) : t('btn_processing_single')}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Download size={18} /> {isBulk ? t('btn_download_batch') : t('btn_download_single')}
                            </div>
                        )}
                    </button>

                    {data.guest && (
                        <div className="text-center text-xs text-slate-400">
                            <Link href="/signup" className="underline hover:text-slate-600">{t('guest_link')}</Link> {t('guest_text')}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* HIDDEN RENDER AREA - RENDERS FOR BOTH SINGLE AND BULK */}
        {data.design && (
            <div ref={hiddenContainerRef} style={{ position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -50 }}>
                {/* Check if certificates array exists, otherwise make array of 1 using single name/id */}
                {(data.certificates || [{name: data.name, id: data.id}]).map((cert, i) => (
                    <div key={i} style={{ width: '1123px', height: '794px', overflow: 'hidden' }}>
                        <CertificateTemplate 
                            data={{
                                certificate_title: data.design?.title,
                                organization_name: data.design?.org,
                                recipient_name_placeholder: cert.name,
                                action_text: data.design?.msg,
                                issue_date: data.design?.date,
                                verification_code: cert.id 
                            }}
                            // FIX: Added fallbacks to ensure strings are never undefined
                            customColor={data.design?.theme_color || "blue"}
                            frameStyle={data.design?.frame || "modern"}
                            customLogo={data.design?.logo || undefined}
                            designTheme={data.design?.theme || "Modern"}
                        />
                    </div>
                ))}
            </div>
        )}
    </>
  );
}