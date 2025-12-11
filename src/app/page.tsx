import { Generator } from "../components/Generator";
// FIX: Use relative path instead of @
import { HomeContent } from "../components/HomeContent"; 

export default function HomePage() {
  return (
    <main>
      <Generator />
      {/* Add the marketing content below the tool */}
      <HomeContent />
    </main>
  );
}