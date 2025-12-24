import { Sparkles, Loader2, AlertCircle, PenTool, ShieldCheck, Globe, BadgeCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface GeneratorHeroProps {
  input: string;
  setInput: (val: string) => void;
  onGenerate: () => void;
  loading: boolean;
  errorMessage: string;
}

export function GeneratorHero({ input, setInput, onGenerate, loading, errorMessage }: GeneratorHeroProps) {
  
  const examples = [
    { label: "Employee Award", value: "Painfree Clinic appreciates Adam Smith for 5 years of dedicated service." },
    { label: "Volunteer", value: "Michael Johnson has completed 50 hours of community service." },
    { label: "Top Tenant", value: "Joseph is awarded Top Tenant of 2024 by First Real Estate Co." }
  ];

  return (
    <div className="bg-slate-50 font-sans text-slate-900 flex flex-col items-center min-h-[85vh] relative overflow-hidden">
      
      {/* BACKGROUND PATTERN */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cubes.png")` }}>
      </div>

      <div className="text-center max-w-5xl mx-auto pt-20 pb-20 px-4 relative z-10">
        
        {/* HEADLINE */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
           AI-Written. <span className="text-blue-600">Instantly Verified.</span>
        </h1>
        
        {/* SUBHEADER */}
        <p className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Generate <strong className="text-slate-900">free, verifiable certificates</strong> with AI in seconds. 
          Every award includes a secure QR code and is stored permanently in the cloud.
        </p>

        {/* === CHATBOX SECTION === */}
        <div className="relative max-w-2xl mx-auto w-full group perspective-1000">
            {/* STAMP BACKGROUND */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.08] pointer-events-none select-none transition-opacity duration-700 group-hover:opacity-[0.15]">
                <BadgeCheck size={350} className="text-slate-900 rotate-12" />
            </div>
            
            <div className="relative z-10 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 p-2 focus-within:ring-4 focus-within:ring-slate-100 transition-all">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe the award (e.g. 'Jane Doe for Excellence in Biology')..."
                    className="w-full p-6 text-lg outline-none resize-none min-h-[140px] rounded-xl text-slate-700 placeholder:text-slate-400 bg-transparent"
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onGenerate(); }}}
                />
                
                {errorMessage && (
                    <div className="mx-4 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-bold animate-in slide-in-from-top-1">
                        <AlertCircle className="w-4 h-4" /> {errorMessage}
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-t border-slate-100 gap-4 bg-slate-50/50 rounded-b-xl">
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Try:</span>
                        {examples.map((ex, i) => (
                            <button key={i} onClick={() => setInput(ex.value)} className="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
                                {ex.label}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={onGenerate} 
                        disabled={loading || !input.trim()} 
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all disabled:opacity-50 w-full md:w-auto justify-center shadow-lg"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4 text-amber-400"/>} 
                        Generate PDF
                    </button>
                </div>
            </div>
        </div>

        {/* === 3 STEPS === */}
        <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto pt-16 mt-8">
            <div className="flex flex-col items-center text-center gap-3 group">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl text-slate-700 group-hover:border-blue-300 group-hover:text-blue-600 transition-all shadow-sm"><PenTool size={28} /></div>
                <div><h3 className="font-bold text-slate-900 text-lg">1. Describe It</h3><p className="text-sm text-slate-500">Just type the achievement.</p></div>
            </div>
            <div className="flex flex-col items-center text-center gap-3 group">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl text-slate-700 group-hover:border-purple-300 group-hover:text-purple-600 transition-all shadow-sm"><Sparkles size={28} /></div>
                <div><h3 className="font-bold text-slate-900 text-lg">2. AI Writes It</h3><p className="text-sm text-slate-500">We craft professional wording.</p></div>
            </div>
            <div className="flex flex-col items-center text-center gap-3 group">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl text-slate-700 group-hover:border-green-300 group-hover:text-green-600 transition-all shadow-sm"><ShieldCheck size={28} /></div>
                <div><h3 className="font-bold text-slate-900 text-lg">3. Verify It</h3><p className="text-sm text-slate-500">Permanent proof via QR code.</p></div>
            </div>
        </div>

      </div>
    </div>
  );
}