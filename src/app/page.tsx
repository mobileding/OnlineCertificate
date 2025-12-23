//import { Generator } from "../components/Generator";
//import { HomeContent } from "../components/HomeContent"; 

//export default function HomePage() {
//  return (
//    <main className="bg-slate-50 min-h-screen">
//      {/* 1. The Tool */}
//      <Generator />
      
//      {/* 2. The Marketing Specs */}
//      <HomeContent />
//    </main>
//  );
//}



import { Generator } from "../components/Generator";
import { TemplateGallery } from "../components/TemplateGallery"; // <--- Import the Gallery
import { HomeContent } from "../components/HomeContent"; 
// import { Navigation } from "../components/Navigation"; // Assuming you have a Navbar

export default function HomePage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* 1. The Main Tool */}
      <Generator />
      
      {/* 2. The Trust Gallery (NEW) */}
      <TemplateGallery />

      {/* 3. The Marketing Specs (Your existing text) */}
      <HomeContent />
    </main>
  );
}