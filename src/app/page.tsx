'use client';

import { useState, useRef } from 'react';
import { ArrowRight, Loader2, Download, Save, Pencil, AlertCircle, Palette, Type } from "lucide-react";
import QRCode from 'qrcode'; 
import { CertificateTemplate } from '../components/CertificateTemplate';
import html2canvas from 'html2canvas';
import JSZip from 'jszip'; 
import jsPDF from 'jspdf';
import { SaveModal } from '../components/SaveModal';
import { SuccessModal } from '../components/SuccessModal';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [frameStyle, setFrameStyle] = useState('Default');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

const [customColor, setCustomColor] = useState('#2563eb'); // Default Blue
const [customLogo, setCustomLogo] = useState<string | null>(null);
const [editTab, setEditTab] = useState<'design' | 'content'>('design'); // NEW STATE
const [bulkProgress, setBulkProgress] = useState<string | null>(null);
const [showSuccess, setShowSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  // 1. GENERATE
  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    setIsEditing(false);
    setResult(null); 
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();

      if (data.error) {
        setError("The AI refused this request. It may violate content policies.");
        return; 
      }
      setResult(data);
    } catch (error) {
      console.error(error);
      setError("Could not connect to the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 // 2. OPEN THE MODAL (Attached to the "Save" button in UI)
  const handleSaveClick = () => {
    if (!result) return;
    setIsSaveModalOpen(true);
  };

  // 2.1 SAVE SINGLE (Called when user clicks "Save Certificate" in modal)
  const handleSaveSingle = async (realName: string) => {
    setIsSaveModalOpen(false); // Close the popup
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
        const verifyUrl = `https://onlinecertificate.org/verify/${saved.code}`;
        const qrImage = await QRCode.toDataURL(verifyUrl);

        setResult((prev: any) => ({ 
          ...prev, 
          recipient_name_placeholder: realName, 
          qrCodeData: qrImage, 
          verification_code: saved.code 
        }));
        alert(`Saved successfully!`);
      } 
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  // 2.2 SAVE BULK (Called when user uploads CSV)
  // 3. SAVE BULK (The Factory Line)
// 3. SAVE BULK
  const handleSaveBulk = async (names: string[]) => {
    setIsSaveModalOpen(false);
    
    const zip = new JSZip();
    // CHANGED: Target the hidden export ID
    const element = document.getElementById('certificate-export'); 
    
    if (!element || !result) return;

    try {
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        
        setBulkProgress(`Generating ${i + 1} of ${names.length}: ${name}`);

        // ... (Database saving logic stays the same) ...
        const personData = { ...result, recipient_name_placeholder: name };
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personData),
        });
        const saved = await response.json();
        if (!saved.success) continue; 

        const verifyUrl = `https://onlinecertificate.org/verify/${saved.code}`;
        const qrImage = await QRCode.toDataURL(verifyUrl);

        // Update State
        await new Promise(resolve => {
          setResult((prev: any) => ({
             ...prev, 
             recipient_name_placeholder: name,
             qrCodeData: qrImage,
             verification_code: saved.code
          }));
          setTimeout(resolve, 200); 
        });

        // CHANGED: Capture the hidden element
        // We use scale: 1 because the element is already full size (1123px)
        const canvas = await html2canvas(element, { 
            scale: 2, // High res for print
            useCORS: true, // Helps with images
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/png').split(',')[1]; 

        zip.file(`${name.replace(/[^a-z0-9]/gi, '_')}_Certificate.png`, imgData, { base64: true });
      }

      // ... (Download logic stays the same) ...
      setBulkProgress("Zipping files...");
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificates_Batch_${new Date().getTime()}.zip`;
      a.click();
// ... previous zip generation code ...

      // TRIGGER SUCCESS MODAL instead of alert
      setSuccessCount(names.length);
      setShowSuccess(true); 

    } catch (error) {
      console.error(error);
      alert("Something went wrong during batch generation.");
    } finally {
      setBulkProgress(null);
    }
  };


   


  // 3. DOWNLOAD (The New Screenshot Method)
// SINGLE DOWNLOAD
  const handleDownload = async () => {
    // CHANGED: Target the hidden export ID
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


  // 4. file upload helper
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
    <main className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            OnlineCertificate<span className="text-blue-600">.org</span>
          </h1>
          <p className="text-slate-500 text-xs">AI-Powered Certificate Generator</p>
        </div>

        {/* INPUT BOX */}
        <div className="w-full max-w-lg relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Best Dad Award..."
            className="w-full py-2 pl-4 pr-12 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button onClick={handleGenerate} disabled={loading} className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-3 rounded-md transition-all">
            {loading ? <Loader2 className="animate-spin w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-4 bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      {result && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: CONTROLS (Narrower: col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            
            {/* Compact Action Bar */}
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex gap-2">
              <button onClick={() => setIsEditing(!isEditing)} className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wide border flex items-center justify-center gap-1 transition-all ${isEditing ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                 <Pencil className="w-3 h-3"/> {isEditing ? 'Close' : 'Edit'}
              </button>

<button onClick={handleSaveClick} disabled={saving} className="flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wide bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-1">
                 {saving ? <Loader2 className="animate-spin w-3 h-3"/> : <Save className="w-3 h-3"/>} Save
              </button>



              <button onClick={handleDownload} disabled={downloading} className="flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wide bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-1">
                 {downloading ? <Loader2 className="animate-spin w-3 h-3"/> : <Download className="w-3 h-3"/>} PDF
              </button>
            </div>

            {/* TABBED EDITOR */}
            {isEditing && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-in slide-in-from-top-2">
                
                {/* Compact Tabs */}
                <div className="flex border-b border-gray-100">
                  <button 
                    onClick={() => setEditTab('design')}
                    className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${editTab === 'design' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    <Palette className="w-3 h-3" /> Design
                  </button>
                  <button 
                    onClick={() => setEditTab('content')}
                    className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${editTab === 'content' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    <Type className="w-3 h-3" /> Text
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-3 space-y-4 max-h-[500px] overflow-y-auto">
                  
                  {editTab === 'design' ? (
                    <>
                      {/* Theme Grid */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Theme</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {['Modern', 'Ivy', 'Playful', 'Minimal', 'Gothic'].map((theme) => (
                            <button key={theme} onClick={() => updateField('design_theme', theme)} className={`py-1.5 px-2 text-[10px] font-medium rounded border text-center transition-all ${result.design_theme === theme ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Frame Grid */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Frame</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['Default', 'Thick', 'Double', 'Gold', 'Dashed', 'None'].map((style) => (
                            <button key={style} onClick={() => setFrameStyle(style)} className={`py-1.5 px-1 text-[10px] font-medium rounded border text-center transition-all ${frameStyle === style ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color & Logo */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Options</label>
                        <div className="flex gap-2">
                          <div className="flex-1 flex items-center gap-2 border border-slate-200 p-1 rounded bg-white">
                            <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent p-0" />
                            <span className="text-[10px] font-mono text-slate-500">{customColor}</span>
                          </div>
                          
                          <label className="flex-1 cursor-pointer flex items-center justify-center border border-dashed border-slate-300 rounded hover:bg-slate-50 text-[10px] font-medium text-slate-500">
                             {customLogo ? "Change Logo" : "Upload Logo"}
                             <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          </label>
                        </div>
                        {customLogo && <button onClick={() => setCustomLogo(null)} className="text-[10px] text-red-500 mt-1 block w-full text-right hover:underline">Remove Logo</button>}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Compact Text Fields */}
                      <div><label className="text-[10px] font-bold text-slate-400 uppercase">Title</label><input className="w-full mt-0.5 p-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-blue-100 outline-none" value={result.certificate_title} onChange={(e) => updateField('certificate_title', e.target.value)}/></div>
                      <div><label className="text-[10px] font-bold text-slate-400 uppercase">Organization</label><input className="w-full mt-0.5 p-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-blue-100 outline-none" value={result.organization_name} onChange={(e) => updateField('organization_name', e.target.value)}/></div>
                      <div><label className="text-[10px] font-bold text-slate-400 uppercase">Recipient</label><input className="w-full mt-0.5 p-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-blue-100 outline-none" value={result.recipient_name_placeholder} onChange={(e) => updateField('recipient_name_placeholder', e.target.value)}/></div>
                      <div><label className="text-[10px] font-bold text-slate-400 uppercase">Message</label><textarea className="w-full mt-0.5 p-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-blue-100 outline-none h-16 resize-none" value={result.action_text} onChange={(e) => updateField('action_text', e.target.value)}/></div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PREVIEW (Wider: col-span-9) */}
          <div className="lg:col-span-9">
            <div className="sticky top-6">
              <div className="overflow-hidden border border-slate-200 rounded-xl bg-slate-100 shadow-xl flex justify-center items-center">
                 {/* AUTO-SCALE TRICK:
                    We use a container that fits the width, then scale the certificate to fit inside.
                    Scale 0.75 works well for standard laptops (1366px+).
                 */}
                 <div className="scale-[0.5] sm:scale-[0.6] md:scale-[0.7] xl:scale-[0.8] origin-top my-4 md:my-8" style={{ width: '1123px', height: '794px' }}>
                    <CertificateTemplate 
                      data={result} 
                      id="certificate-view" 
                      customColor={customColor} 
                      customLogo={customLogo || undefined}
                      frameStyle={frameStyle}
                    />
                 </div>
              </div>
 
             
              {/* Spacer to give the sticky container height */}
              <div className="h-[400px] sm:h-[480px] md:h-[560px] xl:h-[640px] pointer-events-none" />
            </div>
          </div>
 


{/* --- NEW ADDITION START: HIDDEN GHOST EXPORT --- */}
          {/* This sits off-screen so we can take a full-size picture of it */}
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
          {/* --- NEW ADDITION END --- */}



         
        </div>
      )}
<SaveModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)}
        currentName={result?.recipient_name_placeholder || ""}
        onSaveSingle={handleSaveSingle}
        onSaveBulk={handleSaveBulk}
      />
{/* BULK PROCESSING OVERLAY */}
      {bulkProgress && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Processing Batch</h2>
          <p className="text-blue-200 font-mono text-lg">{bulkProgress}</p>
          <p className="text-white/50 text-sm mt-8">Please do not close this window.</p>
        </div>
      )}
<SuccessModal 
        isOpen={showSuccess} 
        count={successCount} 
        onClose={() => setShowSuccess(false)} 
      />    
</main>
  );
}