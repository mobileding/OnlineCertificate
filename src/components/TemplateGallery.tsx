"use client";

import { useRef, useState, useEffect } from "react";
import { CertificateTemplate } from "./CertificateTemplate";
import { CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Palette } from "lucide-react";

// --- EXPANDED DEMO DATA ---
const DEMO_TEMPLATES = [
  {
    id: 1,
    label: "Corporate Excellence",
    color: "#2563eb", // Blue
    badge: "Most Popular",
    data: {
      recipient_name_placeholder: "Sarah Jenkins",
      certificate_title: "Employee of the Month",
      organization_name: "TechFlow Systems",
      action_text: "For demonstrating exceptional leadership and driving record sales in Q4 2024.",
      signature_text: "James CEO",
      verification_code: "EMP-882-991",
    },
    frame: "Default",
    texture: "None",
    theme: "Modern"
  },
  {
    id: 2,
    label: "Academic Prestige",
    color: "#d97706", // Gold
    badge: "Classic",
    data: {
      recipient_name_placeholder: "Michael Chang",
      certificate_title: "Certificate of Completion",
      organization_name: "Ivy League Online",
      action_text: "Has successfully mastered the Advanced Python Programming curriculum with Honors.",
      signature_text: "Dr. A. Smith",
      verification_code: "EDU-229-X77",
    },
    frame: "Double",
    texture: "Parchment",
    theme: "Classic"
  },
  {
    id: 3,
    label: "Creative Visionary",
    color: "#dc2626", // Red
    badge: "Bold",
    data: {
      recipient_name_placeholder: "The Design Team",
      certificate_title: "Excellence in Design",
      organization_name: "Creative Studio X",
      action_text: "For the outstanding rebranding project that captured the hearts of millions.",
      signature_text: "Art Director",
    },
    frame: "Thick",
    texture: "None",
    theme: "Bold"
  },
  {
    id: 4,
    label: "Hackathon Winner",
    color: "#10b981", // Emerald
    badge: "Tech",
    data: {
      recipient_name_placeholder: "Alex 'Root' Chen",
      certificate_title: "1st Place Winner",
      organization_name: "Global Hack 2025",
      action_text: "For deploying the most innovative AI solution in the 48-hour sprint.",
      signature_text: "DevRel Team",
    },
    frame: "Nest",
    texture: "None",
    theme: "Tech"
  },
  {
    id: 5,
    label: "Lifetime Achievement",
    color: "#4f46e5", // Indigo
    badge: "Elegant",
    data: {
      recipient_name_placeholder: "Eleanor Rigby",
      certificate_title: "Lifetime Service Award",
      organization_name: "Community Foundation",
      action_text: "In grateful recognition of 25 years of dedicated volunteer service.",
      signature_text: "The Board",
    },
    frame: "Elegant",
    texture: "Guilloche",
    theme: "Elegant"
  },
  {
    id: 6,
    label: "Rising Star",
    color: "#ec4899", // Pink
    badge: "Playful",
    data: {
      recipient_name_placeholder: "Tommy Turnberry",
      certificate_title: "Super Star Award",
      organization_name: "Little League",
      action_text: "For having the best attitude and being a great team player this season!",
      signature_text: "Coach Mike",
    },
    frame: "Dashed",
    texture: "None",
    theme: "Playful"
  }
];

export function TemplateGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll buttons visibility
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400; // Approx card width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      // Timeout to allow scroll to finish before checking again
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-purple-200 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wide mb-6 shadow-sm">
            <Palette size={14} className="text-blue-600" /> Template Gallery
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Designed to Impress.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            From official corporate recognitions to fun playful awards, our engine 
            auto-formats your certificates perfectly.
          </p>
        </div>

        {/* --- CAROUSEL CONTAINER --- */}
        <div className="relative group">
          
          {/* Scroll Buttons (Desktop) */}
          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white border border-slate-200 p-3 rounded-full shadow-lg text-slate-700 hover:text-blue-600 hover:scale-110 transition-all hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white border border-slate-200 p-3 rounded-full shadow-lg text-slate-700 hover:text-blue-600 hover:scale-110 transition-all hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* The Scrolling Area */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 pt-4 px-4 scrollbar-hide -mx-4 md:mx-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {DEMO_TEMPLATES.map((template) => (
              <div 
                key={template.id} 
                className="snap-center shrink-0 w-[85vw] md:w-[480px] lg:w-[550px] relative group/card perspective-1000"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 transition-all duration-500 group-hover/card:shadow-2xl group-hover/card:-translate-y-2">
                  
                  {/* Preview Window */}
                  <div className="relative w-full aspect-[1.414/1] bg-slate-100 overflow-hidden cursor-pointer">
                    
                    {/* The "Real" Certificate Scaled Down */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1123px] h-[794px] origin-center transform scale-[0.35] md:scale-[0.42] lg:scale-[0.48] pointer-events-none select-none shadow-lg">
                      <CertificateTemplate 
                        data={template.data}
                        customColor={template.color}
                        frameStyle={template.frame}
                        designTheme={template.theme as any}
                        textureStyle={template.texture}
                      />
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors" />
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 bg-white border-t border-slate-100 relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                         {template.badge}
                      </div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{template.theme}</div>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-xl group-hover/card:text-blue-600 transition-colors">
                      {template.label}
                    </h3>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
            <div className="text-xs text-slate-400 font-medium animate-pulse">
                Swipe to explore designs &rarr;
            </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-1"
            >
                Create Your Certificate <ArrowRight size={18} />
            </button>
        </div>

      </div>
    </section>
  );
}