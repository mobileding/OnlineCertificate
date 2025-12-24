import Link from "next/link";
import { 
  Palette, Type, FileText, Sparkles, LayoutDashboard, UserCircle, 
  ArrowRight, MousePointerClick, BookOpen 
} from "lucide-react";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-600">
      
      {/* 1. HERO HEADER */}
      <section className="py-20 bg-slate-900 text-white text-center px-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen size={14} className="text-blue-400" /> User Manual
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight">
          Master the Platform
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          A complete tour of our Design Toolbox, AI Engine, and Dashboard features.
          Learn how to create professional certificates in seconds.
        </p>
        <Link href="/create" className="px-8 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 transition-all text-sm shadow-lg shadow-blue-900/50">
          Start Designing Now
        </Link>
      </section>

      {/* 2. THE TOOLBOX OVERVIEW */}
      <section className="py-20 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">The Toolbox</h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Everything you need is located on the left-hand sidebar of the editor. 
              We've organized the tools into four intuitive categories so you can customize every inch of your certificate without getting lost.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                <Palette size={20} className="text-slate-600" /> 
                <span className="text-slate-700 text-sm">
                    <strong>Design Tool:</strong> Controls the overall look, frames, and colors.
                </span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                <Type size={20} className="text-slate-600" /> 
                <span className="text-slate-700 text-sm">
                    <strong>Text Tool:</strong> Edits the names, titles, and signatures.
                </span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                <FileText size={20} className="text-slate-600" /> 
                <span className="text-slate-700 text-sm">
                    <strong>Paper Tool:</strong> Changes the background texture and quality.
                </span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                <Sparkles size={20} className="text-slate-600" /> 
                <span className="text-slate-700 text-sm">
                    <strong>AI Writer:</strong> Writes your description for you.
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <img 
              src="/guide-images/toolbox.png" 
              alt="Design Toolbox" 
              className="w-full rounded border border-slate-200 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 3. DESIGN TOOL */}
      <section className="py-20 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* IMAGE SLOT (Left on desktop) */}
          <div className="order-2 md:order-1 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <img 
              src="/guide-images/designtool.png" 
              alt="Design Tool" 
              className="w-full rounded border border-slate-100"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-2 mb-4 text-purple-700 font-bold uppercase text-xs tracking-wider">
                <Palette size={16} /> Module 1
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Design Tool</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              This is where you define the "Vibe" of your award. 
            </p>
            <div className="space-y-6 border-l-2 border-slate-200 pl-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Color Picker</h3>
                <p className="text-sm text-slate-500 mt-1">Choose from our professional palettes or enter your brand's Hex Code to match your company logo perfectly.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Themes</h3>
                <p className="text-sm text-slate-500 mt-1">Switch layouts instantly. Go "Modern" for startups, or "Classic" for universities.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Frames</h3>
                <p className="text-sm text-slate-500 mt-1">Add elegance with a double-line gold border, or keep it clean with a minimalist edge.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEXT TOOL */}
      <section className="py-20 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold uppercase text-xs tracking-wider">
                <Type size={16} /> Module 2
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Text Tool</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Precision control over every word. This is the most used tool in the box.
            </p>
            <div className="grid grid-cols-1 gap-4">
               <div className="bg-slate-50 p-5 rounded border border-slate-200">
                  <span className="font-serif font-bold text-slate-900 block mb-1">Organization & Logo</span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                      Upload your school or company logo here. It auto-scales to fit the header.
                  </span>
               </div>
               <div className="bg-slate-50 p-5 rounded border border-slate-200">
                  <span className="font-serif font-bold text-slate-900 block mb-1">Signatures</span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                      Type the signer's name and title (e.g., "Elon Musk, CEO"). The system applies a handwriting font automatically.
                  </span>
               </div>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <img 
              src="/guide-images/texttool.png" 
              alt="certificate text tool" 
              className="w-full rounded border border-slate-200 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 5. PAPER TOOL */}
      <section className="py-20 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
             <img 
              src="/guide-images/papertool.png" 
              alt="Design paper tool" 
              className="w-full rounded border border-slate-100"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-2 mb-4 text-amber-700 font-bold uppercase text-xs tracking-wider">
                <FileText size={16} /> Module 3
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Paper Tool</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Digital certificates don't have to feel flat. Use the Paper tool to add realistic textures that simulate physical awards.
            </p>
            <ul className="space-y-3 border-t border-slate-200 pt-4">
                <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <div className="w-3 h-3 bg-amber-400 rounded-sm border border-amber-500"></div> 
                    <span><strong>Gold Foil:</strong> Metallic sheen perfect for 1st place awards.</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <div className="w-3 h-3 bg-orange-100 rounded-sm border border-orange-200"></div> 
                    <span><strong>Parchment:</strong> An academic, old-world paper feel.</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <div className="w-3 h-3 bg-blue-100 rounded-sm border border-blue-200"></div> 
                    <span><strong>Guilloche:</strong> Complex geometric security patterns used in banking.</span>
                </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. AI WRITER */}
      <section className="py-20 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold uppercase text-xs tracking-wider">
                <Sparkles size={16} /> Module 4
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">AI Writer</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Stuck on what to write? Don't just say "Good job." Let our AI write a meaningful commendation.
            </p>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Workflow Example</div>
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <span className="block text-xs font-bold text-slate-500 mb-1">You type:</span>
                        <div className="bg-white border border-slate-200 p-2 rounded text-sm text-slate-700 font-mono">"Good at coding"</div>
                    </div>
                    <ArrowRight className="text-slate-300 mt-6" size={16} />
                    <div className="flex-1">
                         <span className="block text-xs font-bold text-slate-500 mb-1">AI Generates:</span>
                        <div className="bg-blue-50 border border-blue-100 p-2 rounded text-sm text-blue-900 font-serif leading-snug">"For demonstrating exceptional problem-solving skills and mastering complex algorithms."</div>
                    </div>
                </div>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <img 
              src="/guide-images/aiassistant.png" 
              alt="Design AI assistant" 
              className="w-full rounded border border-slate-200 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 7. DASHBOARD & PROFILE */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-serif font-bold mb-4">Managing Your Account</h2>
                <p className="text-slate-400">Once you've created your certificates, the Dashboard helps you organize them.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                
                {/* DASHBOARD CARD */}
                <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <LayoutDashboard className="text-blue-400" size={24} />
                        <h3 className="text-2xl font-serif font-bold">The Dashboard</h3>
                    </div>
                    <p className="text-slate-400 mb-6 h-20 text-sm leading-relaxed">
                        Your secure digital filing cabinet. Every certificate you generate (Pro/Elite) is saved here automatically. You can verify their status, re-download PDFs, or delete old records.
                    </p>
                    <img 
                      src="/guide-images/dashboard.png" 
                      alt="user's dashboard" 
                      className="w-full rounded border border-slate-600 shadow-lg opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>

                {/* PROFILE CARD */}
                <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <UserCircle className="text-purple-400" size={24} />
                        <h3 className="text-2xl font-serif font-bold">User Profile</h3>
                    </div>
                    <p className="text-slate-400 mb-6 h-20 text-sm leading-relaxed">
                        Manage your identity. Update your Password, change your Organization Name (which appears on receipts), manage your Subscription, and check your <strong>Verification Badge</strong> status.
                    </p>
                    <img 
                      src="/guide-images/profile.png" 
                      alt="user's profile" 
                      className="w-full rounded border border-slate-600 shadow-lg opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>

            </div>
        </div>
      </section>

    </main>
  );
}