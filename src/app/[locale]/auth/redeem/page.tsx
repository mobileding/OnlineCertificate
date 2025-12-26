"use client";

import { useEffect, useState, Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

function RedeemLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Authenticating...");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. GET LOCALE (Default to 'en' if missing)
  const locale = searchParams.get('locale') || 'en';

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSessionFound = async () => {
        setStatus("Session secured. Redirecting...");
        
        // === THE FIX ===
        // We use 'locale' directly. No need for 'localePrefix'.
        const targetUrl = `/${locale}/dashboard?new_pro=true`;
        
        console.log("Redirecting to:", targetUrl);

        setTimeout(() => {
            // Force hard reload to ensure we hit the correct folder
            window.location.href = targetUrl;
        }, 500);
    };

    // A. STANDARD CHECK (Supabase Auto-detect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        handleSessionFound();
      }
    });

    // B. MANUAL HASH PARSING (The Nuclear Option)
    // If the standard check fails, we parse the URL hash manually.
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
        setStatus("Manually exchanging token...");
        
        const params = new URLSearchParams(hash.substring(1)); // remove the #
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
            supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            }).then(({ data, error }) => {
                if (error) {
                    console.error("Manual Exchange Error:", error);
                    setErrorMsg(error.message);
                } else if (data.session) {
                    console.log("Manual exchange successful!");
                    handleSessionFound();
                }
            });
        }
    } else {
        // C. ALREADY LOGGED IN CHECK
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) handleSessionFound();
            else if (!hash) {
                 // No hash, no session -> Error (only if we aren't just arriving)
            }
        });
    }

    return () => subscription.unsubscribe();

  }, [router, locale]);

  // === RENDER ===
  if (errorMsg) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{errorMsg}</span>
              </div>
              <button 
                onClick={() => router.push(`/${locale}/login`)} 
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

// WRAPPER: Required because useSearchParams needs a Suspense boundary
export default function RedeemPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin"/></div>}>
      <RedeemLogic />
    </Suspense>
  );
}