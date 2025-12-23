"use client";

import { BadgeCheck, Calendar, Award, Star, Feather, Crown, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "qrcode"; 

interface CertificateTemplateProps {
  data: any;
  customColor: string;
  frameStyle: string;
  customLogo?: string;
  textureStyle?: string;
  designTheme?: "Modern" | "Classic" | "Playful" | "Minimal" | "Gothic"; 
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

  // --- THEME CONFIG ---
  const themeStyles = {
      Modern: { fontTitle: "font-sans tracking-tight", fontBody: "font-sans", icon: Award, bgPattern: "opacity-[0.03]" },
      Classic: { fontTitle: "font-serif tracking-widest uppercase", fontBody: "font-serif", icon: Feather, bgPattern: "opacity-[0.05]" },
      Playful: { fontTitle: "font-sans font-black tracking-wide", fontBody: "font-sans", icon: Star, bgPattern: "opacity-[0.1]" },
      Minimal: { fontTitle: "font-mono uppercase tracking-[0.2em]", fontBody: "font-mono text-sm", icon: BadgeCheck, bgPattern: "hidden" },
      Gothic: { fontTitle: "font-serif font-black tracking-tighter", fontBody: "font-serif italic", icon: Crown, bgPattern: "opacity-[0.08]" }
  };
  const currentTheme = themeStyles[designTheme] || themeStyles.Modern;
  const ThemeIcon = currentTheme.icon;
  const signature = data.signature_text || "";
  const PARCHMENT_URL = "https://www.transparenttextures.com/patterns/cream-paper.png";

// 1. Define the Red Border Styles
const redBorderStyles = {
  container: "p-8 bg-[#f3f4f6] relative flex items-center justify-center overflow-hidden",
  outer: "absolute inset-0 m-4 border-4 border-red-800 bg-white",
  pattern: "absolute inset-0 opacity-10 pointer-events-none", // Optional background pattern
  inner: "absolute inset-4 border border-red-800 border-double border-4 p-8 flex flex-col items-center justify-between"
};

  // --- RENDER HELPERS ---

  // 1. TEXTURE LAYER (Background)
  const renderTexture = () => {
    if (textureStyle === 'Gold') {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-yellow-200 to-yellow-600 p-6">
            <div className="w-full h-full bg-white shadow-inner"></div>
        </div>
      );
    }
    if (textureStyle === 'Parchment') {
      return (
        <div className="absolute inset-0 bg-[#fffbf0]" 
             style={{ backgroundImage: `url("${PARCHMENT_URL}")`, boxShadow: 'inset 0 0 120px rgba(139, 69, 19, 0.15)' }}>
        </div>
      );
    }
    if (textureStyle === 'Guilloche') {
       return (
         <div className="absolute inset-0 bg-slate-50 p-4">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="w-full h-full border-[8px] border-double border-slate-300 bg-white"></div>
         </div>
       );
    }
    // Standard / None
    return <div className="absolute inset-0 bg-white"></div>;
  };

// 2. FRAME LAYER (Borders)
  const renderFrame = () => {
    if (frameStyle === 'None') return null;

    const insetClass = textureStyle === 'Gold' ? 'inset-10' : textureStyle === 'Guilloche' ? 'inset-8' : 'inset-4';


    // === 1. "NEST" BORDER (Dynamic Color + Pattern) ===
 


  // === 1. "NEST" BORDER (Fixed Corners) ===
    if (frameStyle === 'Nest') {
      const encodedColor = customColor.replace('#', '%23');
      const patternSvg = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h16v2h-6v6h6v8H8v-6H2v6H0V0zm4 4h2v2H4V4zm8 8h2v2h-2v-2zm-8 0h2v2H4v-2zm8-8h2v2h-2V4z' fill='${encodedColor}' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`;
      const borderThickness = '45px'; 

      return (
        <div className="absolute inset-0 z-20 pointer-events-none select-none">
            
            {/* Layer 1: Thick Patterned Bars (BUTT JOINT FIX) */}
            {/* Top & Bottom run all the way across (Left 0, Right 0) */}
            <div className="absolute top-0 left-0 right-0" style={{ height: borderThickness, backgroundImage: patternSvg }}></div>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: borderThickness, backgroundImage: patternSvg }}></div>
            
            {/* Left & Right START below the top bar and STOP above the bottom bar */}
            {/* This prevents the overlap/solid color at the corners */}
            <div className="absolute left-0" 
                 style={{ 
                    top: borderThickness,     // <--- Starts below top bar
                    bottom: borderThickness,  // <--- Stops above bottom bar
                    width: borderThickness, 
                    backgroundImage: patternSvg 
                 }}>
            </div>
            <div className="absolute right-0" 
                 style={{ 
                    top: borderThickness,     // <--- Starts below top bar
                    bottom: borderThickness,  // <--- Stops above bottom bar
                    width: borderThickness, 
                    backgroundImage: patternSvg 
                 }}>
            </div>

            {/* Layer 2: The Gap (Border Color) */}
            <div className="absolute border" 
                 style={{ 
                    borderColor: customColor,
                    top: borderThickness, 
                    bottom: borderThickness, 
                    left: borderThickness, 
                    right: borderThickness 
                 }}>
            </div>

            {/* Layer 3: Decorative Inner Line */}
            <div className="absolute border-[3px]" 
                 style={{ 
                    borderColor: customColor,
                    top: `calc(${borderThickness} + 8px)`, 
                    bottom: `calc(${borderThickness} + 8px)`, 
                    left: `calc(${borderThickness} + 8px)`, 
                    right: `calc(${borderThickness} + 8px)` 
                 }}>
            </div>

            {/* Layer 4: Corner Ornaments */}
            <div className="absolute w-4 h-4 border-t-[4px] border-l-[4px]" 
                 style={{ borderColor: customColor, top: `calc(${borderThickness} + 4px)`, left: `calc(${borderThickness} + 4px)` }}></div>
            <div className="absolute w-4 h-4 border-t-[4px] border-r-[4px]" 
                 style={{ borderColor: customColor, top: `calc(${borderThickness} + 4px)`, right: `calc(${borderThickness} + 4px)` }}></div>
            <div className="absolute w-4 h-4 border-b-[4px] border-l-[4px]" 
                 style={{ borderColor: customColor, bottom: `calc(${borderThickness} + 4px)`, left: `calc(${borderThickness} + 4px)` }}></div>
            <div className="absolute w-4 h-4 border-b-[4px] border-r-[4px]" 
                 style={{ borderColor: customColor, bottom: `calc(${borderThickness} + 4px)`, right: `calc(${borderThickness} + 4px)` }}></div>
        </div>
      );
    }

// === 2. "ELEGANT" BORDER (Greek Key / Meander Pattern) ===
    if (frameStyle === 'Elegant') {
      const encodedColor = customColor.replace('#', '%23');
      
      // A classic Greek Key pattern SVG
      const patternSvg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 40L0 0H20V20H40V40H20V20H0' stroke='${encodedColor}' stroke-width='2'/%3E%3C/g%3E%3C/svg%3E")`;
      
      const borderThickness = '40px';

      return (
        <div className="absolute inset-0 z-20 pointer-events-none select-none">
            
            {/* The Patterned Border (Using mask for perfect corners is hard, so we use the 4-bar method again) */}
            
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0" style={{ height: borderThickness, backgroundImage: patternSvg }}></div>
            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0" style={{ height: borderThickness, backgroundImage: patternSvg }}></div>
            {/* Left Bar (Inset to prevent corner clash) */}
            <div className="absolute left-0" 
                 style={{ 
                    top: borderThickness, 
                    bottom: borderThickness, 
                    width: borderThickness, 
                    backgroundImage: patternSvg 
                 }}>
            </div>
            {/* Right Bar (Inset to prevent corner clash) */}
            <div className="absolute right-0" 
                 style={{ 
                    top: borderThickness, 
                    bottom: borderThickness, 
                    width: borderThickness, 
                    backgroundImage: patternSvg 
                 }}>
            </div>

            {/* Inner Gold/Color Line */}
            <div className="absolute border-[2px]" 
                 style={{ 
                    borderColor: customColor,
                    top: `calc(${borderThickness} + 4px)`, 
                    bottom: `calc(${borderThickness} + 4px)`, 
                    left: `calc(${borderThickness} + 4px)`, 
                    right: `calc(${borderThickness} + 4px)` 
                 }}>
            </div>

            {/* Corner Squares to clean up the joints */}
            <div className="absolute top-0 left-0 bg-white" style={{ width: borderThickness, height: borderThickness }}>
                <div className="w-full h-full border-[2px]" style={{ borderColor: customColor }}></div>
            </div>
            <div className="absolute top-0 right-0 bg-white" style={{ width: borderThickness, height: borderThickness }}>
                <div className="w-full h-full border-[2px]" style={{ borderColor: customColor }}></div>
            </div>
            <div className="absolute bottom-0 left-0 bg-white" style={{ width: borderThickness, height: borderThickness }}>
                 <div className="w-full h-full border-[2px]" style={{ borderColor: customColor }}></div>
            </div>
            <div className="absolute bottom-0 right-0 bg-white" style={{ width: borderThickness, height: borderThickness }}>
                 <div className="w-full h-full border-[2px]" style={{ borderColor: customColor }}></div>
            </div>

        </div>
      );
    }


    // === 2. STANDARD FRAME LOGIC ===
    return (
      <div className={`absolute pointer-events-none z-20 ${insetClass}
          ${frameStyle === 'Thick' ? 'border-[16px]' : 
            frameStyle === 'Double' ? 'border-4' : 
            frameStyle === 'Dashed' ? 'border-4 border-dashed' : 
            'border-8 border-double'
          }`}
          style={{ borderColor: customColor }}
      >
          {frameStyle === 'Double' && (
             <div className="absolute inset-2 border-2 pointer-events-none" style={{ borderColor: customColor }}></div>
          )}
      </div>
    );
  };


  return (
    // ROOT CONTAINER - FIXED SIZE 1123x794
    // We removed 'w-full' to prevent the shrinking bug
    <div className={`w-[1123px] h-[794px] relative bg-white shadow-2xl overflow-hidden flex flex-col ${currentTheme.fontBody}`}>
      
      {/* LAYER 1: TEXTURE */}
      {renderTexture()}

      {/* LAYER 2: FRAME (Now works everywhere) */}
      {renderFrame()}

      {/* LAYER 3: WATERMARK ICON */}
      <div className={`absolute inset-0 pointer-events-none flex items-center justify-center z-0 ${currentTheme.bgPattern}`}>
         <ThemeIcon size={600} color={customColor} />
      </div>

      {/* LAYER 4: CONTENT */}
      {/* Added z-30 to ensure text sits above everything else */}
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