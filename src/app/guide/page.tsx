import Link from "next/link";
import { 
  Palette, Type, FileText, Sparkles, LayoutDashboard, UserCircle, 
  ArrowRight, MousePointerClick, Camera 
} from "lucide-react";

// --- REUSABLE COMPONENT: IMAGE PLACEHOLDER ---
// This acts as the container where you will put your screenshots later.
const Placeholder = ({ label, height = "h-64" }: { label: string, height?: string }) => (
  <div className={`w-full ${height} bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 p-6 text-center group hover:bg-slate-50 transition-colors`}>
    <div className="bg-white p-3 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
      <Camera size={24} className="text-blue-500" />
    </div>
    <span className="font-bold text-sm text-slate-600 uppercase tracking-wide mb-1">Insert Screenshot Here</span>
    <span className="text-xs">{label}</span>
  </div>
);

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. HERO HEADER */}
      <section className="py-20 bg-slate-900 text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Master the Platform
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          A complete tour of our Design Toolbox, AI Engine, and Dashboard features.
          Learn how to create professional certificates in seconds.
        </p>
        <Link href="/create" className="px-6 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-500 transition-all">
          Start Designing Now
        </Link>
      </section>

      {/* 2. THE TOOLBOX OVERVIEW */}
      <section className="py-20 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide mb-4">
              <MousePointerClick size={14} /> The Interface
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Toolbox</h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Everything you need is located on the left-hand sidebar of the editor. 
              We've organized the tools into four intuitive categories so you can customize every inch of your certificate without getting lost.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <Palette size={20} className="text-purple-500" /> 
                <strong>Design Tool:</strong> Controls the overall look, frames, and colors.
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <Type size={20} className="text-blue-500" /> 
                <strong>Text Tool:</strong> Edits the names, titles, and signatures.
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <FileText size={20} className="text-amber-500" /> 
                <strong>Paper Tool:</strong> Changes the background texture and quality.
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <Sparkles size={20} className="text-emerald-500" /> 
                <strong>AI Assistant:</strong> Writes your description for you.
              </li>
            </ul>
          </div>
<img 
  src="/guide-images/toolbox.png" 
  alt="Design Toolbox" 
  className="w-full rounded-xl border border-slate-200 shadow-lg"
/>
        </div>
      </section>

      {/* 3. DESIGN TOOL */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* IMAGE SLOT (Left on desktop) */}
          <div className="order-2 md:order-1">
<img 
  src="/guide-images/designtool.png" 
  alt="Design Tool" 
  className="w-full rounded-xl border border-slate-200 shadow-lg"
/>
          </div>
          <div className="order-1 md:order-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg inline-block mb-4"><Palette size={24} /></div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">1. Design Tool</h2>
            <p className="text-slate-600 mb-6">
              This is where you define the "Vibe" of your award. 
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900">Color Picker</h3>
                <p className="text-sm text-slate-500">Choose from our professional palettes or enter your brand's Hex Code to match your company logo perfectly.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Themes</h3>
                <p className="text-sm text-slate-500">Switch layouts instantly. Go "Modern" for startups, or "Classic" for universities.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Frames</h3>
                <p className="text-sm text-slate-500">Add elegance with a double-line gold border, or keep it clean with a minimalist edge.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEXT TOOL */}
      <section className="py-20 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg inline-block mb-4"><Type size={24} /></div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">2. Text Tool</h2>
            <p className="text-slate-600 mb-6">
              Precision control over every word. This is the most used tool in the box.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Organization & Logo</span>
                  <span className="text-xs text-slate-500">Upload your school or company logo here. It auto-scales to fit the header.</span>
               </div>
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Signatures</span>
                  <span className="text-xs text-slate-500">Type the signer's name and title (e.g., "Elon Musk, CEO"). The system applies a handwriting font automatically.</span>
               </div>
            </div>
          </div>
<img 
  src="/guide-images/texttool.png" 
  alt="certificate text tool" 
  className="w-full rounded-xl border border-slate-200 shadow-lg"
/>
        </div>
      </section>

      {/* 5. PAPER TOOL */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
             <img 
  src="/guide-images/papertool.png" 
  alt="Design paper tool" 
  className="w-full rounded-xl border border-slate-200 shadow-lg"
/>
          </div>
          <div className="order-1 md:order-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg inline-block mb-4"><FileText size={24} /></div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">3. Paper Tool</h2>
            <p className="text-slate-600 mb-6">
              Digital certificates don't have to feel flat. Use the Paper tool to add realistic textures that simulate physical awards.
            </p>
            <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-700"><div className="w-2 h-2 bg-amber-400 rounded-full"></div> <strong>Gold:</strong> A metallic sheen perfect for 1st place awards.</li>
                <li className="flex items-center gap-2 text-slate-700"><div className="w-2 h-2 bg-orange-200 rounded-full"></div> <strong>Parchment:</strong> An academic, old-world paper feel.</li>
                <li className="flex items-center gap-2 text-slate-700"><div className="w-2 h-2 bg-blue-200 rounded-full"></div> <strong>Guilloche:</strong> Complex geometric security patterns used in banking.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. AI ASSISTANT */}
      <section className="py-20 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg inline-block mb-4"><Sparkles size={24} /></div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">4. AI Writer</h2>
            <p className="text-slate-600 mb-6">
              Stuck on what to write? Don't just say "Good job." Let our AI write a meaningful commendation.
            </p>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">How it works</div>
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <span className="block text-xs text-slate-500 mb-1">You type:</span>
                        <div className="bg-slate-100 p-2 rounded text-sm text-slate-700 italic">"Good at coding"</div>
                    </div>
                    <ArrowRight className="text-slate-300 mt-4" size={20} />
                    <div className="flex-1">
                         <span className="block text-xs text-slate-500 mb-1">AI Generates:</span>
                        <div className="bg-blue-50 p-2 rounded text-sm text-blue-800 font-medium">"For demonstrating exceptional problem-solving skills and mastering complex algorithms."</div>
                    </div>
                </div>
            </div>
          </div>
<img 
  src="/guide-images/aiassistant.png" 
  alt="Design AI assistant" 
  className="w-full rounded-xl border border-slate-200 shadow-lg"
/>
        </div>
      </section>

      {/* 7. DASHBOARD & PROFILE */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Managing Your Account</h2>
                <p className="text-slate-400">Once you've created your certificates, the Dashboard helps you organize them.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                
                {/* DASHBOARD CARD */}
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <LayoutDashboard className="text-blue-400" size={28} />
                        <h3 className="text-2xl font-bold">The Dashboard</h3>
                    </div>
                    <p className="text-slate-400 mb-6 h-20">
                        Your secure digital filing cabinet. Every certificate you generate (Pro/Elite) is saved here automatically. You can verify their status, re-download PDFs, or delete old records.
                    </p>
<img 
  src="/guide-images/dashboard.png" 
  alt="user's dashboard" 
  className="w-full rounded-xl border border-slate-200 shadow-lg"
/>
                </div>

                {/* PROFILE CARD */}
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <UserCircle className="text-purple-400" size={28} />
                        <h3 className="text-2xl font-bold">User Profile</h3>
                    </div>
                    <p className="text-slate-400 mb-6 h-20">
                        Manage your identity. Update your Password, change your Organization Name (which appears on receipts), manage your Subscription, and check your <strong>Verification Badge</strong> status.
                    </p>
<img 
  src="/guide-images/profile.png" 
  alt="user's profile" 
  className="w-full rounded-xl border border-slate-200 shadow-lg"
/>
                </div>

            </div>
        </div>
      </section>

    </main>
  );
}