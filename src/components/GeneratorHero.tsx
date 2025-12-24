import { Wand2, Loader2, ScrollText, GraduationCap, Award, Briefcase, ArrowRight, Sparkles } from "lucide-react";

interface GeneratorHeroProps {
  input: string;
  setInput: (value: string) => void;
  onGenerate: (override?: string) => void;
  loading: boolean;
  errorMessage: string;
}

export function GeneratorHero({ input, setInput, onGenerate, loading, errorMessage }: GeneratorHeroProps) {
  
  const presets = [
    {
      icon: <Briefcase size={14} />,
      label: "Employee of Month",
      prompt: "A professional Employee of the Month certificate for Sarah Jenkins, awarded by TechCorp Inc. for outstanding dedication. Signed by the CEO."
    },
    {
      icon: <GraduationCap size={14} />,
      label: "Course Completion",
      prompt: "A formal Certificate of Completion awarded to Michael Chang for mastering Advanced Python. Issued by Code Academy. Date: Today."
    },
    {
      icon: <Award size={14} />,
      label: "Appreciation",
      prompt: "A warm Certificate of Appreciation presented to The Volunteer Team for their selfless support. With gratitude from the City Council."
    }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center justify-center p-4">
      
      <div className="max-w-3xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* 1. HEADLINE (Serif Font Restored) */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight">
            AI-Written. <span className="text-blue-600">Instantly Verified.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Generate <strong className="font-bold text-slate-900">free, verifiable certificates</strong> with AI in seconds. 
            Every award includes a secure <strong className="font-bold text-slate-900">QR code</strong> and is stored permanently in the cloud.
          </p>
        </div>

        {/* 2. MAIN INPUT INTERFACE */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 relative overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-400 transition-all flex flex-col min-h-[400px]">
          
          {/* TEXTAREA */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="e.g. A certificate for John Doe for winning the 2025 Science Fair..."
            className="w-full flex-grow p-6 text-lg text-slate-800 placeholder:text-slate-300 resize-none outline-none bg-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                onGenerate();
              }
            }}
          />

          {/* PRESETS */}
          <div className="px-6 pb-6 pt-2 bg-gradient-to-t from-white via-white to-transparent">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 pl-1">
                 {input.length > 0 ? "Switch Preset:" : "Try a preset:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {presets.map((p, i) => (
                  <button
                      key={i}
                      onClick={() => setInput(p.prompt)}
                      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all text-left group cursor-pointer"
                  >
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                          {p.icon}
                      </div>
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 line-clamp-1">
                          {p.label}
                      </span>
                  </button>
                  ))}
              </div>
          </div>
          
          {/* FOOTER BAR */}
          <div className="bg-slate-50 border-t border-slate-100 p-3 flex justify-between items-center relative z-30 h-16">
            <span className="text-xs text-slate-400 font-medium pl-3 hidden sm:block">
              <span className="font-bold">Pro Tip:</span> Mention the "Issuer" and "Date" for best results.
            </span>
            
            <button
              onClick={() => onGenerate()}
              disabled={loading || !input.trim()}
              className="ml-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Generating...
                </>
              ) : (
                <>
                  <Wand2 size={16} /> Generate Certificate <ArrowRight size={14} className="opacity-50"/>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
             <span className="font-bold">Error:</span> {errorMessage}
          </div>
        )}

        {/* 3. FOOTER INFO */}
        <div className="pt-8 flex justify-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
                <ScrollText size={14} /> Open Standard PDF
            </div>
            <div className="flex items-center gap-2">
                <Sparkles size={14} /> AI Powered Layouts
            </div>
        </div>

      </div>
    </div>
  );
}