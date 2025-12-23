"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { Check, User, ShieldCheck, ShieldAlert, Loader2, Trash2, Save } from "lucide-react";
import { updateVerification, deleteUser } from "../app/admin/actions";
import { useRouter } from "next/navigation"; // Added router

export function AdminUserRow({ profile }: { profile: any }) {
  const router = useRouter();
  
  // Local state for input
  const [orgName, setOrgName] = useState(profile.organization_name || "");
  
  // Loading states
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  // Sync state if parent profile changes (fix for UI not refreshing after save)
  useEffect(() => {
    setOrgName(profile.organization_name || "");
  }, [profile.organization_name]);

  const certCount = profile.certificates?.[0]?.count || 0;

  // 1. TOGGLE VERIFICATION
  const handleToggle = async () => {
    if (!profile.is_org_verified && !orgName.trim()) {
      alert("Please enter an Organization Name before verifying.");
      return;
    }
    setIsVerifying(true);
    await updateVerification(profile.id, !profile.is_org_verified, orgName);
    setIsVerifying(false);
    // Router refresh ensures the server data replaces our local state
    router.refresh(); 
  };

  // 2. SAVE NAME ONLY
  const handleSaveName = async () => {
    setIsSavingName(true);
    try {
        await updateVerification(profile.id, profile.is_org_verified, orgName);
        router.refresh(); // Refresh to confirm save
    } catch (e) {
        alert("Failed to save. Check console.");
    } finally {
        setIsSavingName(false);
    }
  };

  // 3. DELETE USER
  const handleDelete = async () => {
    if (!confirm("Are you sure? This will permanently delete this user.")) return;
    setIsDeleting(true);
    await deleteUser(profile.id);
  };

  const hasNameChanged = orgName !== (profile.organization_name || "");

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50 group">
      
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

      {/* 2. Count */}
      <td className="px-6 py-4 text-center">
        {certCount > 0 ? (
          <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full text-xs">
            {certCount}
          </span>
        ) : (
          <span className="text-slate-300 text-xs">-</span>
        )}
      </td>

      {/* 3. Editable Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter Org Name..."
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-transparent hover:bg-white focus:bg-white transition-colors"
            />
            {hasNameChanged && (
                <button 
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    title="Save Name Change"
                >
                    {isSavingName ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />}
                </button>
            )}
        </div>
      </td>

      {/* 4. Identity Status (Clarified) */}
      <td className="px-6 py-4">
        {profile.is_email_verified ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Check size={14} className="text-green-500" /> Email Confirmed
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400" title="User has not clicked the email confirmation link yet">
             <div className="w-3 h-3 rounded-full bg-amber-400"></div> Email Pending
          </div>
        )}
      </td>

      {/* 5. Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-3">
            <button
            onClick={handleToggle}
            disabled={isVerifying}
            className={`
                relative inline-flex items-center gap-1.5 pl-3 pr-4 py-1.5 rounded-full text-xs font-bold transition-all border
                ${profile.is_org_verified 
                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200" 
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                }
            `}
            >
            {isVerifying ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <>
                {profile.is_org_verified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                <span>{profile.is_org_verified ? "Verified" : "Verify"}</span>
                </>
            )}
            </button>

            <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
            >
                {isDeleting ? <Loader2 size={16} className="animate-spin text-red-600"/> : <Trash2 size={16} />}
            </button>
        </div>
      </td>

    </tr>
  );
}