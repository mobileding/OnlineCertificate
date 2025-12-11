import React from 'react';

export const CertificateTemplate = ({ 
  data, 
  id, 
  customColor, 
  customLogo,
  frameStyle // <--- NEW PROP
}: { 
  data: any, 
  id: string, 
  customColor?: string, 
  customLogo?: string,
  frameStyle?: string
}) => {
  if (!data) return null;

  const primaryColor = customColor || data.theme_color || '#000000';

  // 1. BASE THEMES (Layout & Fonts only)
  const themes: any = {
    Modern: {
      container: "p-12 bg-white text-left flex flex-col justify-between font-sans", // Removed border here
      title: "text-5xl font-extrabold mb-2 uppercase tracking-tight",
      org: "text-xl text-slate-500 mb-8 uppercase tracking-widest font-semibold",
      recipient: "text-6xl font-bold text-black mb-6",
      text: "text-xl text-slate-600 leading-relaxed max-w-2xl",
    },
    Ivy: {
      container: "p-12 pt-16 bg-[#fffbf0] text-center font-serif flex flex-col justify-between",
      title: "text-4xl mb-6 underline decoration-1 underline-offset-4 italic",
      org: "text-2xl mb-4 font-bold",
      recipient: "text-6xl italic mb-6 text-slate-900",
      text: "text-xl px-12 leading-loose",
    },
    Playful: {
      container: "bg-blue-50 p-12 text-center rounded-3xl flex flex-col justify-between font-sans",
      title: "text-6xl font-black mb-4 drop-shadow-sm",
      org: "text-2xl font-bold mb-8",
      recipient: "text-5xl font-bold mb-6 underline decoration-wavy decoration-opacity-50",
      text: "text-xl font-medium",
    },
    Minimal: {
      container: "p-16 bg-white text-center flex flex-col justify-between font-sans",
      title: "text-2xl uppercase tracking-[0.5em] text-slate-400 mb-12",
      org: "text-sm font-bold uppercase tracking-widest text-slate-300 mb-12",
      recipient: "text-5xl font-light text-slate-800 mb-8",
      text: "text-base text-slate-500 font-light",
    },
    Gothic: {
      container: "p-12 bg-[#fdfbf7] text-center flex flex-col justify-between",
      title: "text-6xl mb-8 font-['UnifrakturMaguntia'] tracking-wide", 
      org: "text-lg font-bold uppercase tracking-[0.3em] mb-8 font-serif text-slate-600",
      recipient: "text-7xl mb-8 font-['UnifrakturMaguntia']",
      text: "text-2xl italic font-serif px-16 leading-loose text-slate-700",
    }
  };

  const currentTheme = themes[data.design_theme || 'Modern'] || themes.Modern;

  // 2. FRAME LOGIC (Overrides Theme Defaults)
  // If user hasn't selected a frame, we use the theme's "Natural" look
  const selectedFrame = frameStyle || 'Default';

  const getFrameClasses = () => {
    switch (selectedFrame) {
      case 'Thick': return `border-[14px] border-solid`;
      case 'Double': return `border-[20px] border-double`;
      case 'Dashed': return `border-[6px] border-dashed rounded-3xl`;
      case 'Gold': return `border-[16px] border-solid border-[#cfb53b]`; // Fallback color
      case 'None': return `border-0`;
      default: 
        // Default Logic based on Theme
        if (data.design_theme === 'Modern') return `border-[12px] border-solid`;
        if (data.design_theme === 'Ivy') return `border-4 border-double`;
        if (data.design_theme === 'Playful') return `border-4 border-dashed rounded-3xl`;
        if (data.design_theme === 'Gothic') return `border-[20px] border-double`;
        return `border-0`;
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');`}</style>

      <div 
        id={id} 
        className={`w-[1123px] h-[794px] relative shadow-2xl overflow-hidden ${currentTheme.container} ${getFrameClasses()}`}
        style={{ 
          // If Gold, we use a fancy gradient. Otherwise use primaryColor.
          borderColor: selectedFrame === 'Gold' ? '#eec147' : primaryColor, 
          borderImage: selectedFrame === 'Gold' ? 'linear-gradient(to bottom, #cfb53b, #fbf5b7, #aa8628, #fbf5b7, #cfb53b) 1' : undefined
        }}
      >
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          
          <div className="flex justify-center mb-6">
             {customLogo ? (
               <img src={customLogo} alt="Logo" className="h-24 object-contain" />
             ) : (
               <h3 className={currentTheme.org}>{data.organization_name}</h3>
             )}
          </div>

          <h1 className={currentTheme.title} style={{ color: primaryColor }}>
            {data.certificate_title || "Certificate of Achievement"}
          </h1>
          
          {data.design_theme !== 'Minimal' && <p className="text-slate-400 text-sm mb-4 font-serif italic">is hereby awarded to</p>}
          
          <h2 className={currentTheme.recipient} style={{ color: primaryColor }}>
             {data.recipient_name_placeholder}
          </h2>
          
          <p className={currentTheme.text}>{data.action_text}</p>
        </div>

        {/* Footer */}
{/* Footer */}
        <div className="flex justify-between items-end border-t border-slate-300 pt-6 mt-10 relative">
          <div className="text-left">
            <p className="text-lg font-semibold text-slate-700 font-serif">{new Date().toLocaleDateString()}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Date</p>
          </div>
          
          {/* QR Code - UPDATED: Moved up (bottom-20) and Larger (w-24) */}
          {data.qrCodeData && (
            <div className="absolute bottom-20 right-0 flex flex-col items-center bg-white p-2 rounded-xl border border-gray-200 shadow-md">
               {/* Increased size from w-16 to w-24 */}
               <img src={data.qrCodeData} alt="QR" className="w-24 h-24" />
               <span className="text-[10px] text-slate-500 font-bold font-mono mt-1 tracking-wider">SCAN TO VERIFY</span>
            </div>
          )}

          <div className="text-right">
            <p className="text-lg font-semibold text-slate-700 font-serif">OnlineCertificate.org</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Verified Issuer</p>
          </div>
        </div>
        
        {/* Inner Border Decoration for Double/Gothic frames */}
        {(selectedFrame === 'Double' || data.design_theme === 'Gothic') && selectedFrame !== 'Thick' && selectedFrame !== 'None' && selectedFrame !== 'Dashed' && (
          <div className="absolute inset-4 border border-slate-400 pointer-events-none opacity-30" />
        )}
      </div>
    </>
  );
};