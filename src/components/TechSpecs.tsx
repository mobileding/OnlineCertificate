import { UploadCloud, BrainCircuit, Database, Zap } from "lucide-react";

export function TechSpecs() {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
            {/* Added font-serif here */}
            <h2 className="text-3xl md:text-4xl font-serif font-extrabold mb-6">Built for Scale & Security</h2>
            <p className="text-slate-400 text-lg">
                Whether you are issuing one award or ten thousand, our infrastructure handles the heavy lifting.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1: Smart Bulk */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors group">
                <div className="bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <UploadCloud className="text-blue-400 group-hover:text-white" size={28} />
                </div>
                {/* Added font-serif here */}
                <h3 className="text-xl font-serif font-bold mb-3 flex items-center gap-2">
                    Smart Bulk Upload <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded text-white uppercase tracking-wide font-sans">Elite</span>
                </h3>
                <p className="text-slate-400 leading-relaxed">
                    Stop formatting spreadsheets. Our AI analyzes your CSV headers (e.g., "Student Name", "Recipient") and maps them automatically, saving you hours of data cleaning.
                </p>
            </div>

            {/* Feature 2: AI Composition */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-colors group">
                <div className="bg-purple-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                    <BrainCircuit className="text-purple-400 group-hover:text-white" size={28} />
                </div>
                {/* Added font-serif here */}
                <h3 className="text-xl font-serif font-bold mb-3">AI Certificate Composition</h3>
                <p className="text-slate-400 leading-relaxed">
                    Writer's block? Just type a raw fact ("He sold 50 units"). Our composition engine expands it into formal, celebratory language suitable for professional awards.
                </p>
            </div>

            {/* Feature 3: Cloud Storage */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors group">
                <div className="bg-emerald-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                    <Database className="text-emerald-400 group-hover:text-white" size={28} />
                </div>
                {/* Added font-serif here */}
                <h3 className="text-xl font-serif font-bold mb-3">Permanent Cloud Storage</h3>
                <p className="text-slate-400 leading-relaxed">
                    We don't just generate PDFs; we host the proof. Every certificate gets a permanent URL and database entry, ensuring it remains verifiable for years to come.
                </p>
            </div>

        </div>
      </div>
    </section>
  );
}