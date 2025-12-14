import { Generator } from "../components/Generator";
import { HomeContent } from "../components/HomeContent"; 

export default function HomePage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* 1. The Tool */}
      <Generator />
      
      {/* 2. The Marketing Specs */}
      <HomeContent />
    </main>
  );
}