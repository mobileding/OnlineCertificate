"use client";

import { useState } from "react";
import { Check, User, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { updateVerification } from "../app/actions/admin";

export function AdminUserRow({ profile }: { profile: any }) {
  const [orgName, setOrgName] = useState(profile.organization_name || "");
  const [isLoading, setIsLoading] = useState(false);

  // Extract the count safely (Supabase returns it as an array of objects usually)
  const certCount = profile.certificates?.[0]?.count || 0;

  const handleToggle = async () => {
    // Prevent approving if name is empty
    if (!profile.is_org_verified && !orgName.trim()) {
      alert("Please enter an Organization Name before verifying.");
      return;
    }

    setIsLoading(true);
    // Flip the status
    await updateVerification(profile.id, !profile.is_org_verified, orgName);
    setIsLoading(false);
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50">
      
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

      {/* 2. Certificate Count (NEW) */}
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
        <input 
          type="text" 
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Enter Org Name..."
          className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-transparent hover:bg-white focus:bg-white transition-colors"
        />
      </td>

      {/* 4. Identity Status (Read Only) */}
      <td className="px-6 py-4">
        {profile.is_email_verified ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Check size={14} className="text-green-500" /> Email Confirmed
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
             <div className="w-3 h-3 rounded-full bg-slate-300"></div> Pending
          </div>
        )}
      </td>

      {/* 5. Business Status (CLICKABLE) */}
      <td className="px-6 py-4 text-right">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`
            relative inline-flex items-center gap-1.5 pl-3 pr-4 py-1.5 rounded-full text-xs font-bold transition-all border
            ${profile.is_org_verified 
              ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group" 
              : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
            }
          `}
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              {/* Show Check or Alert icon depending on state */}
              {profile.is_org_verified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
              
              {/* Text changes on hover via CSS group/hidden tricks, or simpler react logic below: */}
              <span>
                 {profile.is_org_verified ? "Official Business" : "Unverified"}
              </span>
            </>
          )}
        </button>
      </td>

    </tr>
  );
}