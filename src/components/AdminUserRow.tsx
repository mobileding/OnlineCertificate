"use client";

import { useState } from "react";
import { 
  User, ShieldCheck, ShieldAlert, Loader2, Trash2, Save, 
  Globe, Linkedin, MapPin, Check, AlertCircle 
} from "lucide-react";
// FIX: Ensure this path matches your file structure (e.g., @/app/[locale]/admin/actions)
import { updateProfileField, deleteUser } from "@/app/[locale]/admin/actions"; 
import { useRouter } from "next/navigation";

export function AdminUserRow({ profile }: { profile: any }) {
  const router = useRouter();
  
  // Local state for Name Input
  const [orgName, setOrgName] = useState(profile.organization_name || "");
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const certCount = profile.certificates?.[0]?.count || 0;

  // Helper to verify a specific field
  const toggleVerify = async (field: string, currentValue: boolean) => {
    setLoadingField(field);
    // If we are verifying the NAME, we also save the text value
    const updates = field === 'is_org_verified' 
      ? { [field]: !currentValue, organization_name: orgName }
      : { [field]: !currentValue };
      
    await updateProfileField(profile.id, updates);
    setLoadingField(null);
    router.refresh(); 
  };

  const handleDelete = async () => {
    if (!confirm("Permanently delete this user?")) return;
    setLoadingField('delete');
    await deleteUser(profile.id);
  };

  // Reusable Mini-Shield Button
  const VerifyToggle = ({ field, isVerified }: { field: string, isVerified: boolean }) => (
    <button
      onClick={() => toggleVerify(field, isVerified)}
      disabled={!!loadingField}
      className={`p-1 rounded-md transition-all ${
        isVerified 
          ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
          : "text-slate-300 hover:text-emerald-600 hover:bg-emerald-50"
      }`}
      title={isVerified ? "Revoke Verification" : "Verify this item"}
    >
      {loadingField === field ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        isVerified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />
      )}
    </button>
  );

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50 group text-sm">
      
      {/* 1. User Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-full text-slate-500">
            <User size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">{profile.email}</span>
            <span className="text-xs text-slate-400 font-mono">{profile.id.slice(0, 8)}...</span>
          </div>
        </div>
      </td>

      {/* 2. Certificate Count (RESTORED) */}
      <td className="px-6 py-4 text-center">
        {certCount > 0 ? (
          <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full text-xs">
            {certCount}
          </span>
        ) : (
          <span className="text-slate-300 text-xs">-</span>
        )}
      </td>

      {/* 3. Org Name (Verification #1) */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
           <VerifyToggle field="is_org_verified" isVerified={profile.is_org_verified} />
           <input 
              type="text" 
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter Org Name..."
              className={`w-40 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  profile.is_org_verified ? "border-blue-200 bg-blue-50/30 font-bold text-slate-700" : "border-slate-200 bg-transparent"
              }`}
           />
           {/* Show Save icon if text changed but not saved yet */}
           {orgName !== (profile.organization_name || "") && (
              <button onClick={() => toggleVerify('is_org_verified', !profile.is_org_verified)} className="text-amber-500 hover:text-amber-600">
                <Save size={14}/>
              </button>
           )}
        </div>
      </td>

      {/* 4. Digital Evidence (Verification #2, #3, #4) */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
            
            {/* Website */}
            <div className={`flex items-center gap-1 p-1 rounded border ${profile.is_website_verified ? 'border-indigo-200 bg-indigo-50' : 'border-transparent'}`}>
                <VerifyToggle field="is_website_verified" isVerified={profile.is_website_verified} />
                {profile.website_url ? (
                    <a href={profile.website_url} target="_blank" className="text-indigo-600 hover:underline"><Globe size={14} /></a>
                ) : <Globe size={14} className="text-slate-200" />}
            </div>

            {/* LinkedIn */}
            <div className={`flex items-center gap-1 p-1 rounded border ${profile.is_linkedin_verified ? 'border-blue-200 bg-blue-50' : 'border-transparent'}`}>
                <VerifyToggle field="is_linkedin_verified" isVerified={profile.is_linkedin_verified} />
                {profile.linkedin_url ? (
                    <a href={profile.linkedin_url} target="_blank" className="text-blue-600 hover:underline"><Linkedin size={14} /></a>
                ) : <Linkedin size={14} className="text-slate-200" />}
            </div>

            {/* Google */}
            <div className={`flex items-center gap-1 p-1 rounded border ${profile.is_google_verified ? 'border-emerald-200 bg-emerald-50' : 'border-transparent'}`}>
                <VerifyToggle field="is_google_verified" isVerified={profile.is_google_verified} />
                {profile.google_business_url ? (
                    <a href={profile.google_business_url} target="_blank" className="text-emerald-600 hover:underline"><MapPin size={14} /></a>
                ) : <MapPin size={14} className="text-slate-200" />}
            </div>

        </div>
      </td>

      {/* 5. Identity Status (RESTORED) */}
      <td className="px-6 py-4">
        {profile.is_email_verified ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Check size={14} className="text-green-500" /> Confirmed
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
             <AlertCircle size={14} className="text-amber-400" /> Pending
          </div>
        )}
      </td>

      {/* 6. Delete Action */}
      <td className="px-6 py-4 text-right">
        <button 
            onClick={handleDelete}
            disabled={!!loadingField}
            className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
        >
            {loadingField === 'delete' ? <Loader2 size={16} className="animate-spin text-red-600"/> : <Trash2 size={16} />}
        </button>
      </td>

    </tr>
  );
}