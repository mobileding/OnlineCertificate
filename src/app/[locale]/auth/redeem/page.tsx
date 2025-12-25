"use client";

import { useEffect, useState, Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

// Helper component to safely read search params
function RedeemLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Authenticating...");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. GET LOCALE FROM URL (Defaults to 'en')
  // We expect the URL to look like: /auth/redeem?locale=es#access_token=...
  const locale = searchParams.get('locale') || 'en';

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

// ... inside handleSessionFound ...
const handleSessionFound = async () => {
    setStatus("Session secured. Redirecting...");
    
    // Use the locale from URL, or default to '' (root) if it's 'en' and you use 'as-needed' strategy
    const localePrefix = locale && locale !== 'en' ? `/${locale}` : '';
    
    // Construct URL with the Grace Period flag
    const targetUrl = `${localePrefix}/dashboard?new_pro=true`;
    
    console.log("Redirecting to:", targetUrl); // Debug log

    setTimeout(() => {
        window.location.href = targetUrl;
    }, 500);
};

    // A. STANDARD CHECK
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        handleSessionFound();
      }
    });

    // B. MANUAL HASH PARSING
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
        setStatus("Manually exchanging token...");
        const params = new URLSearchParams(hash.substring(1));
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
                    handleSessionFound();
                }
            });
        }
    } else {
        // C. ALREADY LOGGED IN CHECK
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) handleSessionFound();
            else if (!hash) {
                 setStatus("No token found.");
                 setErrorMsg("The login link seems invalid or missing.");
            }
        });
    }

    return () => subscription.unsubscribe();

  }, [router, locale]); // Add locale to dependency array

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

// WRAPPER: Required because useSearchParams needs Suspense boundary
export default function RedeemPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin"/></div>}>
      <RedeemLogic />
    </Suspense>
  );
}