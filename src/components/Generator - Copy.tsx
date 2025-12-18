"use client";

import { 
  Loader2, Save, Palette, Type, LayoutTemplate, 
  Briefcase, Heart, Home, Upload, Check, Sparkles, ShieldCheck, PenTool,
  AlertCircle, Download, ScrollText, Wand2, Award // <--- Added Award
} from "lucide-react";
import Link from 'next/link';
import { CertificateTemplate } from './CertificateTemplate';
import html2canvas from 'html2canvas';
import { useState, useEffect } from 'react'; 
import { getUserLimits } from "../app/actions/user";
import jsPDF from 'jspdf';
import { saveCertificate } from "../app/actions/save";

import { SaveModal } from './SaveModal';
import { SuccessModal } from './SuccessModal';

interface GeneratorProps {
  initialPrompt?: string;
  initialData?: any;
}

export function Generator({ initialPrompt = "", initialData = null }: GeneratorProps) {
  // === STATE ===
  const [input, setInput] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null); 
  const [errorMessage, setErrorMessage] = useState("");

  // Tabs for the new Studio Layout
  const [activeTab, setActiveTab] = useState<'design' | 'text' | 'ai' | 'paper'>('ai');
  const [textureStyle, setTextureStyle] = useState('None');


  const [userLimitStatus, setUserLimitStatus] = useState<any>({
      canSave: true, 
      reason: "", 
      isLoggedIn: true, 
  });
  
  // Certificate Data
  const [result, setResult] = useState<any>(initialData);
  const [customColor, setCustomColor] = useState(initialData?.theme_color || '#2563eb');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [frameStyle, setFrameStyle] = useState('Default');
  const [designTheme, setDesignTheme] = useState<"Modern" | "Classic" | "Playful" | "Minimal" | "Gothic">("Modern");

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // === EFFECTS ===
  useEffect(() => {
    getUserLimits().then(setUserLimitStatus);
  }, []);

  // Presets
  const examples = [
    { label: "Employee Award", value: "Painfree Clinic appreciates Adam Smith for 5 years of dedicated service and hard work.", icon: Briefcase },
    { label: "Volunteer", value: "Michael Johnson has successfully completed 50 hours of community service volunteering.", icon: Heart },
    { label: "Top Tenant", value: "Joseph is awarded Top Tenant of 2024 by First Real Estate Co for consistent payments.", icon: Home }
  ];

  // === HANDLERS ===

  const updateField = (field: string, value: string) => {
    setResult((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCustomLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (overrideInput?: string) => {
    const textToUse = overrideInput || input;
    if (!textToUse) return;
    
    setLoading(true);
    setErrorMessage(""); 
    setLogs(["Initializing...", "Analyzing prompt..."]);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToUse }),
      });
      const data = await response.json();

      if (data.error) {
        setLogs(prev => [...prev, "ERROR: Policy Violation."]);
        setErrorMessage(data.error); 
        return; 
      }
      
      setResult(data);
      if(data.theme_color) setCustomColor(data.theme_color);
      setLogs(prev => [...prev, "Render complete."]);

    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, "ERROR: Connection Failed."]);
      setErrorMessage("Connection failed. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSingle = async (nameOverride?: string) => {
    setIsSaveModalOpen(false);
    
    const generateSegment = () => Math.random().toString(36).substring(2, 5).toUpperCase();
    const formattedId = `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
    const finalName = nameOverride || result.recipient_name_placeholder;

    const payload = {
        recipient_name:        finalName, 
        course_title:          result.certificate_title || "Certificate",
        organization_name:     result.organization_name || "Organization",
        action_text:           result.action_text || "For outstanding achievement.",
	signature_text:        result.signature_text, // <--- ADD THIS
        theme:                 "Modern",
        theme_color:           customColor,
        verification_code:     formattedId,
        issue_date:            new Date().toISOString().split('T')[0]
    };

    const response = await saveCertificate(payload, false);
    
    if (response.success) {
        setSuccessData({
            id: response.code || formattedId,
            guest: response.guest,
            name: finalName,
            design: {
                title: result.certificate_title,
                org: result.organization_name,
                msg: result.action_text,
                date: new Date().toLocaleDateString(),
                theme_color: customColor,
                frame: frameStyle,
                logo: customLogo,
                theme: designTheme
            },
            certificates: [{ name: finalName, id: response.code || formattedId }]
        });
        
        if (!response.guest) getUserLimits().then(setUserLimitStatus);
    } else {
        alert("Error saving: " + response.error);
    }
  };

  const handleSaveBulk = async (names: string[]) => {
    setIsSaveModalOpen(false);
    setLoading(true); 

    const generateSegment = () => Math.random().toString(36).substring(2, 5).toUpperCase();

    const payloads = names.map(name => ({
        recipient_name:        name,
        course_title:          result.certificate_title || "Certificate",
        organization_name:     result.organization_name || "Organization",
        action_text:           result.action_text || "For outstanding achievement.",
signature_text:        result.signature_text, // <--- ADD THIS
        theme:                 "Modern",
        theme_color:           customColor,
        verification_code:     `${generateSegment()}-${generateSegment()}-${generateSegment()}`,
        issue_date:            new Date().toISOString().split('T')[0]
    }));

    const response = await saveCertificate(payloads, true);
    setLoading(false);

    if (response.success) {
        setSuccessData({
            isBulk: true,
            count: names.length,
            certificates: payloads.map(p => ({ 
                name: p.recipient_name, 
                id: p.verification_code 
            })),
            names: names,
            guest: response.guest,
            design: {
                title: result.certificate_title,
                org: result.organization_name,
                msg: result.action_text,
                date: new Date().toLocaleDateString(),
                theme_color: customColor,
                frame: frameStyle,
                logo: customLogo,
                theme: designTheme
            }
        });
        
        if (!response.guest) {
             getUserLimits().then(setUserLimitStatus);
        }
    } else {
        alert("Bulk save error: " + (response.message || response.error));
    }
  };

const handleDownloadPDF = async () => {
    const element = document.querySelector('#certificate-preview-container') as HTMLElement;
    if (!element) return;

    // 1. CLONE the element
    // We clone it so we can manipulate it without affecting the visible UI
    const clone = element.cloneNode(true) as HTMLElement;

    // 2. RESET STYLES on the clone
    // We force the clone to be full size (no scaling) and fully opaque
    clone.style.transform = 'scale(1)';
    clone.style.position = 'fixed';
    clone.style.left = '-9999px'; // Hide it off-screen
    clone.style.top = '0';
    clone.style.width = '1123px'; // Force exact A4 landscape width
    clone.style.height = '794px'; // Force exact A4 landscape height
    clone.style.zIndex = '-1';
    
    // Append clone to body so html2canvas can find it
    document.body.appendChild(clone);

    try {
        // 3. CAPTURE the clone
        const canvas = await html2canvas(clone, { 
            scale: 2, // High resolution
            useCORS: true, // Allow loading external images (logos)
            logging: false,
            windowWidth: 1123,
            windowHeight: 794
        });

        // 4. GENERATE PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1123, 794] });
        pdf.addImage(imgData, 'PNG', 0, 0, 1123, 794);
        pdf.save(`${result.recipient_name_placeholder || 'certificate'}.pdf`);

    } catch (e) {
        console.error(e);
        alert("Error generating PDF");
    } finally {
        // 5. CLEAN UP
        document.body.removeChild(clone);
    }
  };

  // --- RENDER ---

// 1. HERO VIEW (Empty State)
  if (!result && !initialData) {
  return (
<div className="bg-slate-50 font-sans text-slate-900 flex flex-col items-center">
        
        {/* Changed py-20 to pt-12 to move headline UP */}
        <div className="text-center max-w-4xl mx-auto pt-12 pb-20 px-4">
          
          {/* 1. HEADLINE */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            AI-Written. <span className="text-blue-600">Instantly Verified.</span>
          </h1>

          {/* 2. SUBHEADER */}
{/* 2. SUBHEADER */}
<p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
  Generate <strong>free</strong>, <Link 
        href="/verify" 
        className="text-blue-600 hover:text-blue-700 hover:underline decoration-blue-300 underline-offset-4 font-semibold transition-all"
        title="Check a verification code"
    >
        verifiable certificates
    </Link>{' '} with AI in seconds. Every award includes a secure <strong>QR code</strong> and is stored permanently in the cloud.
</p>
{/* 3. CALL TO ACTION (Input Box Wrapper) */}
<div className="max-w-3xl mx-auto mb-16 text-left relative">
  
  {/* === THE BACKGROUND STAMP (Behind the Form) === */}
{/* === THE BACKGROUND STAMP === */}
<div className="absolute 
    -bottom-[200px] 
    -right-[100px] 
    z-0 pointer-events-none select-none opacity-[0.12] mix-blend-multiply hidden md:block">
    
    <img 
      src="https://img.favpng.com/11/1/18/logo-organization-food-graphics-rubber-stamp-png-favpng-GR86uuwddk8nzbRiCv0BtpaMd.jpg" 
      alt="Stamp Decor"
      className="w-[500px] h-auto object-contain rotate-[-12deg]"
    />
</div>
  {/* === THE FORM (White Box) === */}
  {/* z-10 ensures this sits ON TOP of the stamp */}
  <div className="relative z-10 bg-white border-2 border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all p-2 group">
      
      <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your award (e.g. Employee of the Month for Sarah)..."
          className="w-full p-4 text-base outline-none resize-none min-h-[120px] rounded-lg text-slate-700 placeholder:text-slate-400 bg-transparent"
          onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}}
      />

      {errorMessage && (
          <div className="mx-4 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-bold animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
          </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-slate-100 gap-4 bg-slate-50/50 rounded-b-lg">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Try:</span>
              {examples.map((ex, i) => (
                  <button key={i} onClick={() => { setInput(ex.value); }} className="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm text-slate-600">
                      <ex.icon className="w-3 h-3" /> {ex.label}
                  </button>
              ))}
          </div>
          <button onClick={() => handleGenerate()} disabled={loading || !input.trim()} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-black transition-all disabled:opacity-50 w-full md:w-auto justify-center shadow-md">
              {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>} Generate
          </button>
      </div>
  </div>






          </div>

          {/* 4. THE "AT A GLANCE" ICONS */}
          <div className="grid md:grid-cols-3 gap-8 text-left max-w-3xl mx-auto border-t border-slate-200 pt-10">
              
              {/* Feature A */}
              <div className="flex gap-4 items-start">
                  <div className="bg-purple-100 p-3 rounded-lg text-purple-600 shrink-0">
                      <PenTool size={24} />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-900">1. Describe It</h3>
                      <p className="text-sm text-slate-500">Just type a simple sentence about the achievement.</p>
                  </div>
              </div>

              {/* Feature B */}
              <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 shrink-0">
                      <Sparkles size={24} />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-900">2. AI Writes It</h3>
                      <p className="text-sm text-slate-500">Our engine crafts the perfect professional wording.</p>
                  </div>
              </div>

              {/* Feature C */}
              <div className="flex gap-4 items-start">
                  <div className="bg-green-100 p-3 rounded-lg text-green-600 shrink-0">
                      <ShieldCheck size={24} />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-900">3. Verify It</h3>
                      <p className="text-sm text-slate-500">Includes a unique QR code for permanent proof.</p>
                  </div>
              </div>

          </div>
        </div>
      </div>
    );
  }
  // 2. STUDIO VIEW (New Layout)
  return (
// ... inside return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50 font-sans text-slate-900 animate-in fade-in duration-500">
      
{/* === TOP: CANVAS PREVIEW AREA === */}
      <div className="w-full bg-slate-100/50 border-b border-slate-200 flex justify-center pt-10 overflow-hidden relative transition-all
          h-[400px]       /* Mobile: Scale 0.45 */
          md:h-[520px]    /* Tablet: Scale 0.60 */
          lg:h-[650px]    /* Laptop: Scale 0.75 */
          xl:h-[750px]    /* Desktop: Scale 0.90 */
      ">
         
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
         
         {/* New Button */}
         <div className="absolute top-4 left-4 z-10">
             <button onClick={() => setResult(null)} className="bg-white text-slate-500 hover:text-slate-900 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50">
                 <LayoutTemplate className="w-3 h-3" /> New
             </button>
         </div>

         {/* CERTIFICATE PREVIEW */}
         {/* UPDATED SCALES: Increased to make certificate larger and legible */}
         <div 
            id="certificate-preview-container" 
            className="shadow-2xl border border-white bg-white origin-top transition-all
                scale-[0.45]    /* Mobile */
                md:scale-[0.6]  /* Tablet */
                lg:scale-[0.75] /* Laptop - Nice and Big */
                xl:scale-[0.9]  /* Desktop - Almost full size */
            "
         >
            <CertificateTemplate 
                data={result} 
                customColor={customColor}
                frameStyle={frameStyle}
                customLogo={customLogo || undefined}
                designTheme={designTheme}
		textureStyle={textureStyle} 
            />
         </div>
      </div>

      {/* === MIDDLE: CONTROL BAR === */}
      <div className="bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            
            {/* Left: Tool Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('design')} 
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'design' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    <Palette size={14} /> Design
                </button>
                <button 
                    onClick={() => setActiveTab('text')} 
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    <Type size={14} /> Text
                </button>
<button 
        onClick={() => setActiveTab('paper')} 
        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'paper' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
    >
        <ScrollText size={14} /> Paper
    </button>
                <button 
                    onClick={() => setActiveTab('ai')} 
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    <Wand2 size={14} /> AI
                </button>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={handleDownloadPDF} 
                    className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                    <Download size={14} /> PDF
                </button>
                <button 
                    onClick={() => setIsSaveModalOpen(true)}
                    disabled={userLimitStatus.isLoggedIn && !userLimitStatus.canSave}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-black transition-all shadow-sm disabled:opacity-50 disabled:bg-red-400"
                    title={userLimitStatus.isLoggedIn && !userLimitStatus.canSave ? userLimitStatus.reason : "Save"}
                >
                    <Save size={14} /> Save Certificate
                </button>
            </div>
         </div>
      </div>

      {/* === BOTTOM: INPUT PANEL (Contextual) === */}
      <div className="bg-slate-50 border-t border-slate-200 p-6 min-h-[220px]">
         <div className="max-w-7xl mx-auto">
            
            {/* TAB 1: DESIGN TOOLS */}
            {activeTab === 'design' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2">
                    {/* Colors */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Primary Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {['#2563eb', '#dc2626', '#16a34a', '#d97706', '#000000', '#7c3aed'].map(c => (
                                <button key={c} onClick={() => setCustomColor(c)} className={`w-8 h-8 rounded-full border transition-transform ${customColor === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-900 border-transparent' : 'border-slate-200 hover:scale-105'}`} style={{ backgroundColor: c }} />
                            ))}
                            <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-8 h-8 rounded-full overflow-hidden border-0 p-0 cursor-pointer" />
                        </div>
                    </div>

                    {/* Themes */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Theme</label>
                        <div className="flex flex-wrap gap-2">
                            {['Modern', 'Classic', 'Playful', 'Minimal', 'Gothic'].map((theme) => (
                                <button key={theme} onClick={() => setDesignTheme(theme as any)} className={`px-3 py-1.5 text-xs font-bold rounded border transition-all ${designTheme === theme ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                                    {theme}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Frames */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Frame</label>
                        <div className="flex flex-wrap gap-2">
                            {['Default', 'Thick', 'Double', 'Dashed', 'None'].map((style) => (
                                <button key={style} onClick={() => setFrameStyle(style)} className={`px-3 py-1.5 text-xs font-bold rounded border transition-all ${frameStyle === style ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: TEXT CONTENT */}
            {activeTab === 'text' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Title</label>
                        <input className="w-full p-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 outline-none" value={result.certificate_title || ''} onChange={(e) => updateField('certificate_title', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Organization</label>
                        <input className="w-full p-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 outline-none" value={result.organization_name || ''} onChange={(e) => updateField('organization_name', e.target.value)} />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Signature</label>
                        <input 
                            className="w-full p-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 outline-none" 
                            placeholder="(Leave blank to sign manually)"
                            value={result.signature_text || ''} 
                            onChange={(e) => updateField('signature_text', e.target.value)} 
                        />
                    </div>




                    <div className="lg:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message</label>
                        <input className="w-full p-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 outline-none" value={result.action_text || ''} onChange={(e) => updateField('action_text', e.target.value)} />
                    </div>
                    
                    {/* Logo Upload Moved to Text Tab for better flow */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Upload Logo</label>
                        <div className="flex gap-2 items-center">
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            {customLogo && <button onClick={() => setCustomLogo(null)} className="text-xs text-red-500 font-bold hover:underline">Remove</button>}
                        </div>
                    </div>
                    
                    {/* Recipient is handled by Save Modal, but we can show it here for single edits */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Preview Name</label>
                        <input className="w-full p-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 outline-none" value={result.recipient_name_placeholder || ''} onChange={(e) => updateField('recipient_name_placeholder', e.target.value)} />
                    </div>
                </div>
            )}


{/* TAB 4: PAPER TEXTURES */}
{activeTab === 'paper' && (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4 text-center">
            Select Paper Material
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Option 1: Standard */}
            <button 
                onClick={() => setTextureStyle('None')}
                className={`group relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${textureStyle === 'None' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-full shadow-sm"></div>
                <span className="text-xs font-bold text-slate-700">Standard</span>
            </button>

            {/* Option 2: Gold Foil */}
            <button 
                onClick={() => setTextureStyle('Gold')}
                className={`group relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 overflow-hidden ${textureStyle === 'Gold' ? 'border-blue-600' : 'border-slate-200 hover:border-slate-300'}`}
            >
                {/* Visual Preview of Gold Gradient */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-yellow-600 via-yellow-200 to-yellow-600"></div>
                <div className="w-12 h-12 rounded-full shadow-sm bg-gradient-to-br from-yellow-500 via-yellow-200 to-yellow-500 border border-yellow-600"></div>
                <span className="text-xs font-bold text-slate-700 relative z-10">Gold Foil</span>
            </button>

            {/* Option 3: Parchment */}
            <button 
                onClick={() => setTextureStyle('Parchment')}
                className={`group relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${textureStyle === 'Parchment' ? 'border-blue-600 bg-[#fffbf0]' : 'border-slate-200 bg-[#fffbf0] hover:border-slate-300'}`}
            >
                <div className="w-12 h-12 rounded-full shadow-sm border border-stone-300 bg-[#f5e6d3]"></div>
                <span className="text-xs font-bold text-slate-700">Parchment</span>
            </button>

            {/* Option 4: Official (Guilloche) */}
            <button 
                onClick={() => setTextureStyle('Guilloche')}
                className={`group relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${textureStyle === 'Guilloche' ? 'border-blue-600' : 'border-slate-200 hover:border-slate-300'}`}
            >
                <div className="w-12 h-12 rounded-full shadow-sm border-2 border-slate-300 bg-slate-50 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-slate-300" />
                </div>
                <span className="text-xs font-bold text-slate-700">Official</span>
            </button>

        </div>
    </div>
)}

            {/* TAB 3: AI REGENERATION */}
{activeTab === 'ai' && (
                <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        ✨ AI Instructions
                    </label>
                    
                    {/* Changed from 'flex gap-2' (Row) to 'space-y-3' (Column) */}
                    <div className="space-y-3">
                        
                        {/* 1. The New Large Text Area */}
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe exactly how you want the certificate to sound..."
                            className="w-full h-32 p-4 text-slate-700 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm leading-relaxed resize-none shadow-sm outline-none"
                        />

                        {/* 2. The Button (Now full width or right aligned) */}
                        <div className="flex justify-end">
                            <button 
                                onClick={() => handleGenerate()} 
                                disabled={loading} 
                                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>} 
                                Update Certificate
                            </button>
                        </div>

                    </div>
                    
                    {errorMessage && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}
                    
                    <p className="text-xs text-slate-400 mt-3 italic">
                        Tip: You can say things like "Make it sound like a pirate" or "Write a formal legal document."
                    </p>
                </div>
            )}

         </div>
      </div>

      <SuccessModal 
         isOpen={!!successData} 
         onClose={() => setSuccessData(null)} 
         data={successData} 
      />
       
      <SaveModal 
         isOpen={isSaveModalOpen} 
         onClose={() => setIsSaveModalOpen(false)}
         currentName={result?.recipient_name_placeholder || ""}
         onSaveSingle={handleSaveSingle}
         onSaveBulk={handleSaveBulk}
      />

    </div>
  );
}