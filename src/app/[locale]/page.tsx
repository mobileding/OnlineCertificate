import { Generator } from "@/components/Generator";
import { TemplateGallery } from "@/components/TemplateGallery"; 
import { VerificationSection } from "@/components/VerificationSection";
import { TechSpecs } from "@/components/TechSpecs";
import { HomeDetails} from "@/components/HomeDetails";

export default function HomePage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      
      {/* 1. Hero & Generator Tool */}
      <Generator />
      
      {/* 2. Template Gallery (Visual Proof) */}
      <section id="templates">
         <TemplateGallery />
      </section>

      {/* 3. Verification & Trust (Why it makes sense) */}
      <VerificationSection />

      {/* 4. Technology Specs (Bulk, AI, Cloud) */}
      <TechSpecs />
	
      <HomeDetails />
     
    </main>
  );
}