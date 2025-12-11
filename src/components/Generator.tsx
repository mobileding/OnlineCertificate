"use client";

import { useState, useRef } from 'react';
import { ArrowRight, Loader2, Download, Save, Pencil, AlertCircle, Palette, Type } from "lucide-react";
import QRCode from 'qrcode'; 
import { CertificateTemplate } from './CertificateTemplate'; // Fixed path
import html2canvas from 'html2canvas';
import JSZip from 'jszip'; 
import jsPDF from 'jspdf';
import { SaveModal } from './SaveModal'; // Fixed path
import { SuccessModal } from './SuccessModal'; // Fixed path

interface GeneratorProps {
  initialPrompt?: string;
  initialData?: any;
}

export function Generator({ initialPrompt = "", initialData = null }: GeneratorProps) {
  const [input, setInput] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  
  // Initialize with initialData if provided (for Templates)
  const [result, setResult] = useState<any>(initialData);
  
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [frameStyle, setFrameStyle] = useState('Default');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const [customColor, setCustomColor] = useState(initialData?.theme_color || '#2563eb');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [editTab, setEditTab] = useState<'design' | 'content'>('design');
  const [bulkProgress, setBulkProgress] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [successCode, setSuccessCode] = useState<string | undefined>(undefined);

  const examples = [
    "Painfree Clinic appreciates Adam Smith for 5 years of service",
    "Michael Johnson completed 50 hours of community service",
    "Joseph is a top tenant awarded by First Real Estate Co."
  ];

  const handleExampleClick = (text: string) => {
    setInput(text);
    handleGenerate(text);
  };

  const handleGenerate = async (overrideInput?: string) => {
    const textToUse = overrideInput || input;
    if (!textToUse) return;
    setLoading(true);
    setIsEditing(false);
    setResult(null); 
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToUse }),
      });
      const data = await response.json();

      if (data.error) {
        setError("The AI refused this request. It may violate content policies.");
        return; 
      }
      setResult(data);
      // Update custom color to match AI suggestion
      if(data.theme_color) setCustomColor(data.theme_color);

    } catch (error) {
      console.error(error);
      setError("Could not connect to the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (!result) return;
    setIsSaveModalOpen(true);
  };

  const handleSaveSingle = async (realName: string) => {
    setIsSaveModalOpen(false);
    if (!realName || !result) return; 

    setSaving(true);
    const finalData = { ...result, recipient_name_placeholder: realName };

    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      const saved = await response.json();
      
      if (saved.success) {
        const verifyUrl = `${window.location.origin}/verify/${saved.code}`;
        const qrImage = await QRCode.toDataURL(verifyUrl);

        setResult((prev: any) => ({ 
          ...prev, 
          recipient_name_placeholder: realName, 
          qrCodeData: qrImage, 
          verification_code: saved.code 
        }));

        setSuccessCount(1);
        setSuccessCode(saved.code);
        setShowSuccess(true);
      } 
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBulk = async (names: string[]) => {
    setIsSaveModalOpen(false);
    
    const zip = new JSZip();
    const element = document.getElementById('certificate-export'); 
    
    if (!element || !result) return;

    try {
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        
        setBulkProgress(`Generating ${i + 1} of ${names.length}: ${name}`);

        const personData = { ...result, recipient_name_placeholder: name };
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personData),
        });
        const saved = await response.json();
        if (!saved.success) continue; 

        const verifyUrl = `${window.location.origin}/verify/${saved.code}`;
        const qrImage = await QRCode.toDataURL(verifyUrl);

        await new Promise(resolve => {
          setResult((prev: any) => ({
             ...prev, 
             recipient_name_placeholder: name,
             qrCodeData: qrImage,
             verification_code: saved.code
          }));
          setTimeout(resolve, 200); 
        });

        const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true, 
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/png').split(',')[1]; 

        zip.file(`${name.replace(/[^a-z0-9]/gi, '_')}_Certificate.png`, imgData, { base64: true });
      }

      setBulkProgress("Zipping files...");
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificates_Batch_${new Date().getTime()}.zip`;
      a.click();

      setSuccessCount(names.length);
      setSuccessCode(undefined);
      setShowSuccess(true); 

    } catch (error) {
      console.error(error);
      alert("Something went wrong during batch generation.");
    } finally {
      setBulkProgress(null);
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById('certificate-export');
    if (!element) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1123, 794] });
      pdf.addImage(imgData, 'PNG', 0, 0, 1123, 794);
      pdf.save('certificate.pdf');
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (field: string, value: string) => {
    setResult((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER for Generator */}
      {!initialData && (
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Create a Certificate
            </h1>
            <p className="text-slate-500 text-xs">AI-Powered Certificate Generator</p>
          </div>
        </div>
      )}

      {/* INPUT BOX */}
      <div className="w-full max-w-2xl mx-auto mb-10 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Best Dad Award..."
          className="w-full py-4 pl-6 pr-14 text-lg border border-gray-300 rounded-full shadow-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button onClick={() => handleGenerate()} disabled={loading} className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md">
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

      {/* EXAMPLE PROMPTS (Only show if no result yet) */}
      {!result && !initialData && (
        <div className="max-w-2xl mx-auto mb-10 text-center animate-in fade-in slide-in-from-bottom-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">Try an example</p>
          <div className="flex flex-wrap justify-center gap-2">
            {examples.map((ex, i) => (
              <button 
                key={i}
                onClick={() => handleExampleClick(ex)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* WORKSPACE */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-700">
          
          {/* LEFT COLUMN: CONTROLS */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex gap-2">
              <button onClick={() => setIsEditing(!isEditing)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border flex items-center justify-center gap-1 transition-all ${isEditing ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                 <Pencil className="w-3 h-3"/> {isEditing ? 'Close' : 'Edit'}
              </button>
              <button onClick={handleSaveClick} disabled={saving} className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transition-all">
                 {saving ? <Loader2 className="animate-spin w-3 h-3"/> : <Save className="w-3 h-3"/>} Save
              </button>
              <button onClick={handleDownload} disabled={downloading} className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transition-all">
                 {downloading ? <Loader2 className="animate-spin w-3 h-3"/> : <Download className="w-3 h-3"/>} PDF
              </button>
            </div>

            {/* EDITING PANEL */}
            {isEditing && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in slide-in-from-top-2">
                <div className="flex border-b border-gray-100">
                  <button onClick={() => setEditTab('design')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${editTab === 'design' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <Palette className="w-3 h-3" /> Design
                  </button>
                  <button onClick={() => setEditTab('content')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${editTab === 'content' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <Type className="w-3 h-3" /> Text
                  </button>
                </div>

                <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
                  {editTab === 'design' ? (
                    <>
                      {/* Theme */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Theme</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Modern', 'Ivy', 'Playful', 'Minimal', 'Gothic'].map((theme) => (
                            <button key={theme} onClick={() => updateField('design_theme', theme)} className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${result.design_theme === theme ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Frame */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Frame Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Default', 'Thick', 'Double', 'Gold', 'Dashed', 'None'].map((style) => (
                            <button key={style} onClick={() => setFrameStyle(style)} className={`py-2 px-1 text-[10px] font-medium rounded-lg border text-center transition-all ${frameStyle === style ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Primary Color</label>
                        <div className="flex gap-2 items-center">
                           <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200 bg-white p-1" />
                           <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">{customColor}</span>
                        </div>
                      </div>

                      {/* Logo */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Custom Logo</label>
                        <div className="flex gap-2">
                           <label className="flex-1 cursor-pointer py-2 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 hover:border-blue-400 transition-all flex items-center justify-center text-xs font-bold text-slate-500">
                             {customLogo ? "Change File" : "Upload PNG/JPG"}
                             <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                           </label>
                           {customLogo && (
                             <button onClick={() => setCustomLogo(null)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                               <AlertCircle size={16}/>
                             </button>
                           )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Title</label><input className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" value={result.certificate_title} onChange={(e) => updateField('certificate_title', e.target.value)}/></div>
                      <div><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Organization</label><input className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" value={result.organization_name} onChange={(e) => updateField('organization_name', e.target.value)}/></div>
                      <div><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Recipient</label><input className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" value={result.recipient_name_placeholder} onChange={(e) => updateField('recipient_name_placeholder', e.target.value)}/></div>
                      <div><label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Message</label><textarea className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none h-24 resize-none leading-relaxed" value={result.action_text} onChange={(e) => updateField('action_text', e.target.value)}/></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PREVIEW */}
          <div className="lg:col-span-9">
            <div className="sticky top-6">
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-slate-50/50 shadow-2xl flex justify-center items-center backdrop-blur-sm">
                 {/* Scaled Preview */}
                 <div className="scale-[0.5] sm:scale-[0.6] md:scale-[0.7] xl:scale-[0.8] origin-top my-4 md:my-8 shadow-sm" style={{ width: '1123px', height: '794px' }}>
                    <CertificateTemplate 
                      data={result} 
                      id="certificate-view" 
                      customColor={customColor} 
                      customLogo={customLogo || undefined}
                      frameStyle={frameStyle}
                    />
                 </div>
              </div>
              
              {/* Spacer for sticky height */}
              <div className="h-[400px] sm:h-[480px] md:h-[560px] xl:h-[640px] pointer-events-none" />
            </div>
          </div>

          {/* HIDDEN GHOST EXPORT */}
          <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
             <div id="certificate-export" style={{ width: '1123px', height: '794px' }}>
                <CertificateTemplate 
                  data={result} 
                  id="certificate-export-inner" 
                  customColor={customColor} 
                  customLogo={customLogo || undefined}
                  frameStyle={frameStyle}
                />
             </div>
          </div>
          
        </div>
      )}

      <SaveModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)}
        currentName={result?.recipient_name_placeholder || ""}
        onSaveSingle={handleSaveSingle}
        onSaveBulk={handleSaveBulk}
      />

      <SuccessModal 
        isOpen={showSuccess} 
        count={successCount} 
        code={successCode} 
        onClose={() => setShowSuccess(false)} 
      /> 

      {/* BULK LOADING OVERLAY */}
      {bulkProgress && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Processing Batch</h2>
          <p className="text-blue-200 font-mono text-lg">{bulkProgress}</p>
          <p className="text-white/50 text-sm mt-8">Please do not close this window.</p>
        </div>
      )}

    </div>
  );
}