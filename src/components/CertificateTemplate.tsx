"use client";

import { BadgeCheck, Calendar, Award, Star, Feather, Crown, ShieldCheck, Terminal, Zap, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "qrcode"; 
import { FitText } from './FitText';

interface CertificateTemplateProps {
  data: any;
  customColor: string;
  frameStyle: string;
  customLogo?: string;
  textureStyle?: string;
  designTheme?: "Modern" | "Classic" | "Playful" | "Minimal" | "Gothic" | "Tech" | "Bold" | "Elegant"; 
}

export function CertificateTemplate({ data, customColor, frameStyle, customLogo, designTheme = "Modern", textureStyle = "None" }: CertificateTemplateProps) {
  const [demoQr, setDemoQr] = useState<string>("");

  useEffect(() => {
    if (data?.qrCodeData) return;
    const code = data?.verification_code || "DEMO";
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://onlinecertificate.org';
    const url = `${domain}/verify/${code}`;
    QRCode.toDataURL(url, { margin: 2 }).then(setDemoQr).catch(console.error);
  }, [data?.verification_code, data?.qrCodeData]); 

  const qrCodeToDisplay = data?.qrCodeData || demoQr;
  if (!data) return null;

  // --- THEME CONFIG (Fonts & Icons) ---
  const themeStyles = {
      Modern: { fontTitle: "font-sans tracking-tight", fontBody: "font-sans", icon: Award, bgPattern: "opacity-[0.03]" },
      Classic: { fontTitle: "font-serif tracking-widest uppercase", fontBody: "font-serif", icon: Feather, bgPattern: "opacity-[0.05]" },
      Playful: { fontTitle: "font-sans font-black tracking-wide", fontBody: "font-sans", icon: Star, bgPattern: "opacity-[0.1]" },
      Minimal: { fontTitle: "font-mono uppercase tracking-[0.2em]", fontBody: "font-mono text-sm", icon: BadgeCheck, bgPattern: "hidden" },
      Gothic: { fontTitle: "font-serif font-black tracking-tighter", fontBody: "font-serif italic", icon: Crown, bgPattern: "opacity-[0.08]" },
      Tech: { fontTitle: "font-mono", fontBody: "font-mono", icon: Terminal, bgPattern: "opacity-10" },
      Bold: { fontTitle: "font-sans font-black", fontBody: "font-sans", icon: ShieldCheck, bgPattern: "opacity-10" },
      Elegant: { fontTitle: "font-serif italic", fontBody: "font-serif", icon: Award, bgPattern: "opacity-5" }
  };
  const currentTheme = themeStyles[designTheme] || themeStyles.Modern;
  const ThemeIcon = currentTheme.icon;
  const signature = data.signature_text || "";
  const PARCHMENT_URL = "https://www.transparenttextures.com/patterns/cream-paper.png";

  // --- RENDER HELPERS ---

  // 1. TEXTURE LAYER (Background)
  const renderTexture = () => {
    if (textureStyle === 'Gold') {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-yellow-200 to-yellow-600 p-6 z-0">
            <div className="w-full h-full bg-white shadow-inner"></div>
        </div>
      );
    }
    if (textureStyle === 'Parchment') {
      return (
        <div className="absolute inset-0 bg-[#fffbf0] z-0" 
             style={{ backgroundImage: `url("${PARCHMENT_URL}")`, boxShadow: 'inset 0 0 120px rgba(139, 69, 19, 0.15)' }}>
        </div>
      );
    }
    if (textureStyle === 'Guilloche') {
       return (
         <div className="absolute inset-0 bg-slate-50 p-4 z-0">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="w-full h-full border-[8px] border-double border-slate-300 bg-white"></div>
         </div>
       );
    }
    // Standard / None
    return <div className="absolute inset-0 bg-white z-0"></div>;
  };

  // 2. FRAME LAYER (Borders)
  const renderFrame = () => {
    if (frameStyle === 'None') return null;

    // === "NEST" BORDER ===
    if (frameStyle === 'Nest') {
      const encodedColor = customColor.replace('#', '%23');
      const patternSvg = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h16v2h-6v6h6v8H8v-6H2v6H0V0zm4 4h2v2H4V4zm8 8h2v2h-2v-2zm-8 0h2v2H4v-2zm8-8h2v2h-2V4z' fill='${encodedColor}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`;
      const borderThickness = '45px'; 

      return (
        <div className="absolute inset-0 z-20 pointer-events-none select-none">
           <div className="absolute top-0 left-0 right-0" style={{ height: borderThickness, backgroundImage: patternSvg }}></div>
           <div className="absolute bottom-0 left-0 right-0" style={{ height: borderThickness, backgroundImage: patternSvg }}></div>
           <div className="absolute left-0" style={{ top: borderThickness, bottom: borderThickness, width: borderThickness, backgroundImage: patternSvg }}></div>
           <div className="absolute right-0" style={{ top: borderThickness, bottom: borderThickness, width: borderThickness, backgroundImage: patternSvg }}></div>
           
           <div className="absolute border" style={{ borderColor: customColor, top: borderThickness, bottom: borderThickness, left: borderThickness, right: borderThickness }}></div>
           <div className="absolute border-[3px]" style={{ borderColor: customColor, top: `calc(${borderThickness} + 8px)`, bottom: `calc(${borderThickness} + 8px)`, left: `calc(${borderThickness} + 8px)`, right: `calc(${borderThickness} + 8px)` }}></div>
        </div>
      );
    }

    // === "ELEGANT" FRAME (Greek Key) ===
    if (frameStyle === 'Elegant') {
      const encodedColor = customColor.replace('#', '%23');
      const patternSvg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 40L0 0H20V20H40V40H20V20H0' stroke='${encodedColor}' stroke-width='2'/%3E%3C/g%3E%3C/svg%3E")`;
      const borderThickness = '40px';

      return (
        <div className="absolute inset-0 z-20 pointer-events-none select-none">
           <div className="absolute top-0 left-0 right-0" style={{ height: borderThickness, backgroundImage: patternSvg }}></div>
           <div className="absolute bottom-0 left-0 right-0" style={{ height: borderThickness, backgroundImage: patternSvg }}></div>
           <div className="absolute left-0" style={{ top: borderThickness, bottom: borderThickness, width: borderThickness, backgroundImage: patternSvg }}></div>
           <div className="absolute right-0" style={{ top: borderThickness, bottom: borderThickness, width: borderThickness, backgroundImage: patternSvg }}></div>
           
           <div className="absolute border-[2px]" style={{ borderColor: customColor, top: `calc(${borderThickness} + 4px)`, bottom: `calc(${borderThickness} + 4px)`, left: `calc(${borderThickness} + 4px)`, right: `calc(${borderThickness} + 4px)` }}></div>
        </div>
      );
    }

    // === "THICK" (The Multi-Layered "Museum Mat" Style) ===
    if (frameStyle === 'Thick') {
        // This creates a rich, layered frame using standard CSS borders and insets.
        // It looks thick but detailed, solving the "too plain" issue.
        return (
            <>
                {/* Layer 1: Outermost wide band (16px) */}
                <div className="absolute inset-0 z-20 pointer-events-none border-[16px]" style={{ borderColor: customColor }} />

                {/* Layer 2: White separator gap (4px) */}
                <div className="absolute inset-[16px] z-20 pointer-events-none border-[4px] border-white" />

                {/* Layer 3: Inner medium band (8px) */}
                <div className="absolute inset-[20px] z-20 pointer-events-none border-[8px]" style={{ borderColor: customColor }} />

                {/* Layer 4: Final white gap with a thin dashed line for detail */}
                <div className="absolute inset-[28px] z-20 pointer-events-none border-[4px] border-white flex items-center justify-center p-1">
                     {/* The thin dashed line inside the white gap */}
                     <div className="w-full h-full border border-dashed opacity-60" style={{ borderColor: customColor }} />
                </div>
            </>
        );
    }

    // === STANDARD FRAMES ===
    const insetClass = textureStyle === 'Gold' ? 'inset-10' : textureStyle === 'Guilloche' ? 'inset-8' : 'inset-4';
    return (
      <div className={`absolute pointer-events-none z-20 ${insetClass}
          ${frameStyle === 'Double' ? 'border-4' : 
            frameStyle === 'Dashed' ? 'border-4 border-dashed' : 
            'border-8 border-double' // Fallback to Standard
          }`}
          style={{ borderColor: customColor }}
      >
          {frameStyle === 'Double' && (
             <div className="absolute inset-2 border-2 pointer-events-none" style={{ borderColor: customColor }}></div>
          )}
      </div>
    );
  };

  // === 3. MAIN RENDER SWITCHER ===
  if (designTheme === 'Tech') {
      return (
        <div className="w-[1123px] h-[794px] relative bg-white text-slate-900 p-8 font-mono overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute inset-0 opacity-40 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', 
                     backgroundSize: '40px 40px' 
                 }}>
            </div>
            
            <div className="relative z-10 border-2 border-slate-900 h-full p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <Terminal size={32} className="text-slate-900" />
                        <span className="text-xl font-bold tracking-tighter uppercase">{data?.organization_name}</span>
                    </div>
<div className="text-right text-xs font-bold text-slate-500">
    HASH: {data?.verification_code || "X7F-229-99A"} <br/>
    {/* Use the stable issue_date or a static string if simpler */}
    TIMESTAMP: {data?.issue_date || new Date().toISOString().split('T')[0]}
</div>
                </div>

                <div className="flex-grow flex flex-col justify-center pl-12 border-l-4 border-slate-900 my-8">
                    <p className="text-slate-500 text-sm mb-2 font-bold">{`> const recipient =`}</p>
                    <h2 className="text-6xl font-bold text-slate-900 mb-8">"{data?.recipient_name_placeholder}"</h2>
                    
                    <p className="text-slate-500 text-sm mb-2 font-bold">{`> const achievement =`}</p>
                    <p className="text-3xl text-slate-800 max-w-4xl mb-8 leading-snug font-medium">"{data?.action_text}"</p>
                    
                    <p className="text-slate-500 text-sm mb-2 font-bold">{`> status:`}</p>
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded text-slate-900 border border-slate-300 w-fit font-bold">
                        <Zap size={16} fill="currentColor" className="text-black" /> VERIFIED_TRUE
                    </div>
                </div>

                <div className="border-t border-slate-300 pt-6 flex justify-between items-end">
                      <div className="text-sm text-slate-600">
                        <div className="mb-4">
                           {qrCodeToDisplay && <img src={qrCodeToDisplay} className="w-16 h-16" />}
                        </div>
                        <span className="font-bold">// AUTH_SIGNATURE:</span> {data.signature_text || "SYSTEM_ROOT"}
                      </div>
                      <div className="font-bold text-slate-400">// END OF LINE</div>
                </div>
            </div>
        </div>
      )
  }

  if (designTheme === 'Bold') {
      return (
          <div className="w-[1123px] h-[794px] relative bg-white text-slate-900 shadow-2xl flex overflow-hidden">
             {/* Left Colored Bar */}
             <div className="w-[35%] h-full flex flex-col items-center justify-center p-12 text-white relative" style={{ backgroundColor: customColor }}>
                 <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 
                 <div className="relative z-10 text-center">
                    {customLogo ? 
                        <img src={customLogo} className="w-48 h-48 object-contain bg-white rounded-full p-4 mb-8 mx-auto shadow-xl" /> : 
                        <ShieldCheck size={160} className="mx-auto mb-8 opacity-90" />
                    }
                    <h3 className="text-3xl font-black uppercase tracking-widest">{data?.organization_name}</h3>
                    <div className="mt-12 opacity-80">
                        <p className="text-sm font-bold uppercase tracking-widest mb-2">Verified ID</p>
                        <p className="text-xl font-mono">{data?.verification_code}</p>
                    </div>
                 </div>
             </div>
             
             {/* Right Content */}
             <div className="w-[65%] h-full p-20 flex flex-col justify-center relative">
                 <div className="absolute top-12 right-12 opacity-5">
                    <ShieldCheck size={400} />
                 </div>

                 <h1 className="text-8xl font-black uppercase tracking-tighter mb-2" style={{ color: customColor }}>
                    Award
                 </h1>
                 <h2 className="text-5xl font-bold uppercase text-slate-300 mb-16">Of Excellence</h2>
                 
                 <p className="text-sm font-bold uppercase text-slate-400 mb-2 tracking-widest">Presented To</p>
                 <FitText 
                  text={data?.recipient_name_placeholder} 
                  className="font-black uppercase text-slate-900 mb-12 border-b-4 border-slate-900 pb-4 inline-block w-full" 
                 />
                 
                 <div className="flex gap-4 mb-8">
                    <Quote size={32} className="text-slate-300 flex-shrink-0" />
                    <p className="text-2xl font-medium text-slate-600 max-w-xl leading-relaxed">
                        {data?.action_text}
                    </p>
                 </div>

                 <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-signature text-slate-900" style={{ fontFamily: 'cursive' }}>{data.signature_text}</p>
                        <p className="text-xs font-bold uppercase text-slate-400 mt-1">Authorized Signature</p>
                      </div>
                      {qrCodeToDisplay && <img src={qrCodeToDisplay} className="w-24 h-24" />}
                 </div>
             </div>
          </div>
      )
  }

  // === STANDARD LAYOUT ===
  return (
    <div className={`w-[1123px] h-[794px] relative bg-white shadow-2xl overflow-hidden flex flex-col ${currentTheme.fontBody}`}>
      
      {/* LAYER 1: TEXTURE */}
      {renderTexture()}

      {/* LAYER 2: FRAME */}
      {renderFrame()}

      {/* LAYER 3: WATERMARK ICON */}
      <div className={`absolute inset-0 pointer-events-none flex items-center justify-center z-0 ${currentTheme.bgPattern}`}>
         <ThemeIcon size={600} color={customColor} />
      </div>

      {/* LAYER 4: CONTENT */}
      <div className="relative z-30 w-full h-full flex flex-col items-center justify-between py-16 px-20">
        
        {/* TOP: Logo & Title */}
        <div className="w-full flex flex-col items-center">
            {customLogo ? (
                <img src={customLogo} alt="Logo" className="h-24 mb-6 object-contain" />
            ) : (
                <div className="mb-6"><ThemeIcon className="w-20 h-20" style={{ color: customColor }} /></div>
            )}

            <h2 className={`text-2xl font-bold mb-2 text-slate-500 ${designTheme === 'Minimal' ? 'text-xs uppercase tracking-[0.3em]' : 'uppercase tracking-widest'}`}>
                {data.organization_name || "Organization Name"}
            </h2>
            
            <h1 className={`text-6xl font-extrabold mb-4 ${currentTheme.fontTitle}`} style={{ color: customColor }}>
                {data.certificate_title || "Certificate of Appreciation"}
            </h1>
        </div>

        {/* MIDDLE: Recipient */}
        <div className="w-full flex flex-col items-center justify-center flex-grow">
            <p className="text-xl text-slate-600 mb-4 italic">is hereby awarded to</p>
            <div className="border-b-2 border-slate-300 w-full max-w-2xl mb-8 pb-2 text-center">
                <p className={`text-5xl font-bold text-slate-900 ${designTheme === 'Gothic' ? 'font-serif' : 'font-sans'}`}>
                    {data.recipient_name_placeholder || "Recipient Name"}
                </p>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl leading-relaxed text-center">
                {data.action_text || "For outstanding performance and dedication."}
            </p>
        </div>

        {/* BOTTOM: Footer */}
        <div className="w-full flex justify-between items-end mt-4">
            {/* Date */}
            <div className="text-center">
                <div className="flex items-center gap-2 text-slate-400 mb-2 justify-center uppercase text-xs font-bold tracking-wider"><Calendar size={14} /> Date</div>
                <p className="text-xl font-bold border-b border-slate-300 pb-1 px-4 min-w-[200px]">{data.issue_date || new Date().toLocaleDateString()}</p>
            </div>

            {/* Seal */}
            <div className="relative group -mb-4">
                <div className="absolute -inset-4 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity" style={{ backgroundColor: customColor }}></div>
                <div className="bg-white p-2 rounded-lg border shadow-sm relative z-10">
                    {qrCodeToDisplay ? <img src={qrCodeToDisplay} alt="QR" className="w-24 h-24" /> : <div className="w-24 h-24 bg-slate-50 flex items-center justify-center text-[10px]">Loading...</div>}
                </div>
                <div className="text-[10px] font-bold text-center mt-2 uppercase tracking-wider text-slate-400">Verified</div>
            </div>

            {/* Signature */}
            <div className="text-center">
                <div className="text-slate-400 mb-2 justify-center uppercase text-xs font-bold tracking-wider">Authorized Signature</div>
                <p className="text-2xl border-b border-slate-300 pb-1 px-4 min-w-[200px]" style={{ fontFamily: signature ? 'cursive' : 'inherit' }}>
                    {signature || <span className="opacity-0">Sign Here</span>}
                </p>
            </div>
        </div>

        {/* Verification Footer */}
        <div className="absolute bottom-4 w-full text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                Verification ID: {data.verification_code || "PREVIEW"}
            </p>
        </div>

      </div>
    </div>
  );
}