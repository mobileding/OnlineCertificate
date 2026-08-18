"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // <--- 1. Import Router
import { Sparkles, PenTool, Loader2 } from "lucide-react";
import { generateSeoMissions } from "@/actions/missions";

export function MissionGenerator() {
  const router = useRouter(); // <--- 2. Initialize Router
  const [strategy, setStrategy] = useState("mixed");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    
    // 1. Run the Server Action
    const result = await generateSeoMissions(formData);
    
    if (!result.success) {
        alert("Error: " + result.error);
    } else {
        // 2. Force the page to reload the data (The Fix)
        router.refresh();
    }
    
    setLoading(false);
  };

  return (
    <form action={handleSubmit} className="flex items-center gap-2 bg-white border border-slate-200 p-1 pr-2 rounded-lg shadow-sm">
      
      {/* THE DROPDOWN */}
      <select 
        name="strategy" 
        value={strategy}
        onChange={(e) => setStrategy(e.target.value)}
        className="bg-transparent text-sm font-medium text-slate-700 p-2 outline-none cursor-pointer hover:bg-slate-50 rounded max-w-[150px]"
      >
        <option value="mixed">🔀 Mixed Bag</option>
        <option value="corporate">💼 Corporate & HR</option>
        <option value="education">🎓 School & Kids</option>
        <option value="sports">⚽ Sports & Coach</option>
        <option value="holidays">🎄 Holidays</option>
        <option value="funny">🎭 Funny / Prank</option>
        <option value="manual">✨ Custom / Manual</option>
      </select>

      {/* MANUAL INPUT */}
      {strategy === "manual" && (
        <input 
          name="custom_topic"
          placeholder="e.g. Dog Grooming..."
          required={strategy === "manual"}
          className="text-sm p-1.5 border border-slate-300 rounded-md outline-none focus:border-blue-500 w-40 animate-in fade-in slide-in-from-left-2"
        />
      )}

      {/* THE BUTTON */}
      <button 
        type="submit" 
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1.5 rounded-md font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? (
            <Loader2 size={14} className="animate-spin" />
        ) : (
            <>
                {strategy === "manual" ? <PenTool size={14} /> : <Sparkles size={14} />} 
                Go
            </>
        )}
      </button>
    </form>
  );
}