"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function PasswordUpdateForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpdate = async () => {
    // 1. Validation
    if (password.length < 6) {
        setMessage({ type: 'error', text: "Password must be at least 6 characters." });
        return;
    }
    if (password !== confirmPassword) {
        setMessage({ type: 'error', text: "Passwords do not match." });
        return;
    }

    setLoading(true);
    setMessage(null);

    // 2. Update via Supabase (Works for creating NEW or changing OLD)
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
        setMessage({ type: 'error', text: error.message });
    } else {
        setMessage({ type: 'success', text: "Password updated successfully!" });
        setPassword("");
        setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
      <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Lock size={20} className="text-amber-500"/> Manage Password
      </h2>
      
      <div className="space-y-4">
        <div>
           <p className="text-xs text-slate-500 mb-4">
             Set a new password to log in with email & password instead of Magic Links.
           </p>
           
           <div className="space-y-3">
               <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">New Password</label>
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                   />
               </div>

               <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Confirm Password</label>
                   <input 
                     type="password" 
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     placeholder="••••••••"
                     className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                   />
               </div>

               <button 
                 onClick={handleUpdate}
                 disabled={loading || !password}
                 className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Update Password"}
               </button>
           </div>
        </div>

        {message && (
            <div className={`text-xs font-bold p-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-1 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {message.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                {message.text}
            </div>
        )}
      </div>
    </div>
  );
}