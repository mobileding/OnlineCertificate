import Link from "next/link";
import { CheckCircle, Upload, Zap, FileSpreadsheet, ArrowRight, BrainCircuit, FileText } from "lucide-react";

// HELPER: High-Fidelity Mini Certificate
const RealMiniCert = ({ name, org, desc, index }: { name: string, org: string, desc: string, index: number }) => (
  <div className="relative group perspective-1000">
      <div className="bg-white border-4 border-double border-slate-200 p-6 rounded-lg shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        
        {/* Background Texture Effect */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Badge Watermark */}
        <div className="absolute -bottom-4 -right-4 text-slate-100 rotate-12">
            <Zap size={80} />
        </div>

        <div className="relative z-10 text-center space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                Certificate of Achievement
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-slate-900 leading-none">
                {name}
            </h3>
            
            <div className="w-16 h-px bg-slate-300 mx-auto my-2"></div>
            
            <p className="text-xs text-slate-500 italic leading-relaxed px-2">
                "{desc}"
            </p>
            
            <div className="pt-3 mt-1">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Issued by {org}
                </div>
            </div>
        </div>
      </div>

      {/* Status Pill */}
      <div className="absolute -top-2 -right-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-green-200 flex items-center gap-1">
        <CheckCircle size={10} /> PDF #{index}
      </div>
  </div>
);

export default function SmartBulkPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* HERO SECTION */}
      <section className="py-20 bg-slate-900 text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wide mb-6">
            <Zap size={14} className="text-yellow-400" /> Elite Feature
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Stop formatting spreadsheets. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Let our AI map the data.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            The world's first <strong>Smart Bulk Upload</strong>. Upload your messy export from Eventbrite or HR software, and our system figures out the rest.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/pricing" className="px-8 py-4 bg-blue-600 rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50">
              Upgrade to Elite
            </Link>
            <Link href="/dashboard" className="px-8 py-4 bg-slate-800 rounded-full font-bold hover:bg-slate-700 transition-all">
              Try Demo in Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* THE PROBLEM / SOLUTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left: The Pain */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">The Old Way (Standard)</h2>
            <p className="text-slate-500 text-lg">
              Most bulk generators act like robots. If your column is named "Student Name" instead of "Name", they crash. You spend hours renaming columns and cleaning data.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-400">
                <FileSpreadsheet className="text-red-400" /> Must match template exactly
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <FileSpreadsheet className="text-red-400" /> Breaks on typos
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <FileSpreadsheet className="text-red-400" /> Static text only (same desc for everyone)
              </li>
            </ul>
          </div>

          {/* Right: The Solution (Elite) */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit size={200} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Elite Way (Smart)</h2>
            <p className="text-slate-600 text-lg mb-6">
              Our Smart Engine reads your headers. It knows that "Attendee", "Recipient", and "Student" all mean <strong>Name</strong>. It maps your data automatically.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-medium text-slate-800">
                <CheckCircle className="text-green-500" /> 
                <span><strong>Auto-Mapping:</strong> Upload messy internal files.</span>
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-800">
                <CheckCircle className="text-green-500" /> 
                <span><strong>Dynamic Text:</strong> Change the "Description" for every single person.</span>
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-800">
                <CheckCircle className="text-green-500" /> 
                <span><strong>Custom Org Names:</strong> Great for agencies issuing for multiple clients.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* --- COMBINED VISUALIZER --- */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Dynamic Fields: The Game Changer</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Paste your raw data, and watch the system generate unique certificates for every single line instantly.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* 1. LEFT: RAW DATA INPUT */}
            <div className="w-full lg:w-5/12 sticky top-8">
                <div className="bg-slate-800 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase">
                                <FileText size={16} /> Source Input (CSV)
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>

                        {/* Raw Data Display - UPDATED: Removed Header Row */}
                        <div className="font-mono text-xs md:text-sm leading-8 text-slate-300 overflow-x-auto">
                            
                            {/* Row 1 */}
                            <div className="flex gap-4 hover:bg-slate-800/50 rounded px-1 transition-colors group/line cursor-default">
                                <span className="text-slate-600 select-none w-4 text-right">1</span> 
                                <span className="group-hover/line:text-white transition-colors">
                                    <span className="text-blue-300">sarah smith</span>, <span className="text-orange-300">a1 real estate</span>, <span className="text-green-300">for closing $1m in sales in Q3</span>
                                </span>
                            </div>

                            {/* Row 2 */}
                            <div className="flex gap-4 hover:bg-slate-800/50 rounded px-1 transition-colors group/line cursor-default">
                                <span className="text-slate-600 select-none w-4 text-right">2</span> 
                                <span className="group-hover/line:text-white transition-colors">
                                    <span className="text-blue-300">mike jones</span>, <span className="text-orange-300">big shipbuilder</span>, <span className="text-green-300">for 10 years of loyal service</span>
                                </span>
                            </div>

                            {/* Row 3 */}
                            <div className="flex gap-4 hover:bg-slate-800/50 rounded px-1 transition-colors group/line cursor-default">
                                <span className="text-slate-600 select-none w-4 text-right">3</span> 
                                <span className="group-hover/line:text-white transition-colors">
                                    <span className="text-blue-300">peter williams</span>, <span className="text-orange-300">pain free clinic</span>, <span className="text-green-300">being very attentive to the patient</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Connection Line (Desktop Only) */}
                    <div className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 text-slate-300 z-10">
                        <ArrowRight size={40} className="animate-pulse" />
                    </div>
                </div>
            </div>

            {/* 2. RIGHT: GENERATED CERTIFICATES GRID */}
            <div className="w-full lg:w-7/12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    <RealMiniCert 
                        index={1}
                        name="Sarah Smith"
                        org="A1 Real Estate"
                        desc="For closing $1m in sales in Q3"
                    />

                    <RealMiniCert 
                        index={2}
                        name="Mike Jones"
                        org="Big Shipbuilder"
                        desc="For 10 years of loyal service"
                    />

                    <RealMiniCert 
                        index={3}
                        name="Peter Williams"
                        org="Pain Free Clinic"
                        desc="Being very attentive to the patient"
                    />

                    {/* Upsell Card */}
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                        <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Upload Your Own CSV</span>
                        <span className="text-xs mt-1">Try it in the Dashboard</span>
                    </div>

                </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-slate-900">What columns does the Smart Uploader look for?</h3>
            <p className="text-slate-600 mt-2">
              It looks for keywords like "Name", "Student", or "Employee" for the recipient. It looks for "Description", "Reason", or "Body" for the text. It auto-detects dates.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Is this included in the Pro Plan?</h3>
            <p className="text-slate-600 mt-2">
              No. The Pro plan ($6/mo) includes standard Bulk Upload (Strict Template). The Smart Auto-Mapping feature is exclusive to the Elite Plan ($22/mo).
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}