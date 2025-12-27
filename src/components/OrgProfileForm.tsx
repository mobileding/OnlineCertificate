"use client";

import { useState } from "react";
// 1. Import directly from the library
import { createBrowserClient } from "@supabase/ssr";
import { Globe, Linkedin, MapPin, Save, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// === HELPER: Auto-add https:// ===
const formatUrl = (url: string) => {
  if (!url || !url.trim()) return null;
  let cleanUrl = url.trim();
  // If it doesn't start with http:// or https://, add https://
  if (!/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = `https://${cleanUrl}`;
  }
  return cleanUrl;
};

interface OrgProfileProps {
  profile: {
    id: string; 
    website_url: string | null;
    linkedin_url: string | null;
    google_business_url: string | null;
    is_org_verified: boolean;
  };
}

export function OrgProfileForm({ profile }: OrgProfileProps) {
  // 2. Initialize Supabase right here
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    website_url: profile.website_url || "",
    linkedin_url: profile.linkedin_url || "",
    google_business_url: profile.google_business_url || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // === APPLY THE FORMATTING HERE ===
    const cleanData = {
        website_url: formatUrl(formData.website_url),
        linkedin_url: formatUrl(formData.linkedin_url),
        google_business_url: formatUrl(formData.google_business_url),
    };

    const { error } = await supabase
      .from("profiles")
      .update(cleanData) // Send cleanData, not formData
      .eq("id", profile.id);

    if (error) {
      alert("Error updating profile");
    } else {
      // Update local state so the input box shows the new https:// immediately
      setFormData({
          website_url: cleanData.website_url || "",
          linkedin_url: cleanData.linkedin_url || "",
          google_business_url: cleanData.google_business_url || ""
      });
      router.refresh(); 
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Organization Profile</h2>
          <p className="text-sm text-slate-500">
            These details appear on your public verification pages to build trust.
          </p>
        </div>
        
        {profile.is_org_verified ? (
           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Verified Business</span>
           </div>
        ) : (
           <div className="flex items-center gap-2 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200">
              <AlertCircle size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Unverified</span>
           </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Website Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <Globe size={14} /> Website URL
          </label>
          <input
            type="text" // changed from 'url' to 'text' to prevent browser validation blocking 'example.com'
            name="website_url"
            placeholder="example.com"
            value={formData.website_url}
            onChange={handleChange}
            className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
          />
        </div>

        {/* LinkedIn Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <Linkedin size={14} /> LinkedIn Page
          </label>
          <input
            type="text"
            name="linkedin_url"
            placeholder="linkedin.com/company/..."
            value={formData.linkedin_url}
            onChange={handleChange}
            className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
          />
        </div>

        {/* Google Business Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <MapPin size={14} /> Google Maps Link
          </label>
          <input
            type="text"
            name="google_business_url"
            placeholder="maps.google.com/..."
            value={formData.google_business_url}
            onChange={handleChange}
            className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
          />
          <p className="text-[10px] text-slate-400">
            *Required for "Verified Business" badge.
          </p>
        </div>

        <div className="md:col-span-3 flex justify-end mt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-black transition flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}