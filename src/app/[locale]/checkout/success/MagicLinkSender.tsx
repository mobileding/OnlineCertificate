"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";

export function MagicLinkSender({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSendLink = async () => {
    setLoading(true);
    setMsg("");
    setStatus("idle");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setLoading(false);

    if (error) {
      setStatus("error");
      // Handle the specific rate limit error specifically
      if (error.message.includes("Rate limit")) {
         setMsg("Too many attempts. Please check your inbox or wait 60s.");
      } else {
         setMsg(error.message);
      }
    } else {
      setStatus("success");
      setMsg("Link sent! Check your inbox.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-in zoom-in">
        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 font-bold">Email Sent!</p>
        <p className="text-green-600 text-xs mt-1">Check {email}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start mb-6">
        <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 text-left">
          <strong>One final step</strong><br/>
          We sent a login link to <u>{email}</u>. Click it to access your new features.
        </div>
      </div>

      <button
        onClick={handleSendLink}
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
        Resend Login Link
      </button>

      {status === "error" && (
        <p className="text-red-500 text-xs font-bold mt-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3"/> {msg}
        </p>
      )}
      
      <p className="text-slate-400 text-xs mt-4 text-center">
        Didn't receive it? Check your Spam folder.
      </p>
    </div>
  );
}