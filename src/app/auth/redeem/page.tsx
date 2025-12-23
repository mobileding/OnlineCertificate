"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

export default function RedeemPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Authenticating...");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSessionFound = async () => {
        setStatus("Session secured. Redirecting...");
        // Wait 500ms for the cookie to be written to the browser
        setTimeout(() => {
            window.location.href = "/dashboard?new_pro=true";
        }, 500);
    };

    // 1. STANDARD CHECK (Supabase Auto-detect)
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        handleSessionFound();
      }
    });

    // 2. THE NUCLEAR OPTION (Manual Hash Parsing)
    // If the standard check fails, we do it ourselves.
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
        setStatus("Manually exchanging token...");
        
        // Extract tokens from the URL hash #access_token=...&refresh_token=...
        const params = new URLSearchParams(hash.substring(1)); // remove the #
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
            // Force-set the session
            supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            }).then(({ data, error }) => {
                if (error) {
                    console.error("Manual Exchange Error:", error);
                    setStatus("Error exchanging token");
                    setErrorMsg(error.message);
                } else if (data.session) {
                    console.log("Manual exchange successful!");
                    handleSessionFound();
                }
            });
        }
    } else {
        // If no hash, maybe we are already logged in?
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) handleSessionFound();
            else if (!hash) {
                 // No hash, no session -> Error
                 setStatus("No token found.");
                 setErrorMsg("The login link seems invalid or missing.");
            }
        });
    }

  }, [router]);

  // === RENDER ===
  if (errorMsg) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{errorMsg}</span>
              </div>
              <button 
                onClick={() => router.push('/login')} 
                className="text-sm text-slate-500 underline hover:text-slate-800"
              >
                Go to Login Page
              </button>
          </div>
      );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-slate-500 text-sm font-medium">{status}</p>
    </div>
  );
}