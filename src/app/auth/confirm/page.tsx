"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ConfirmPage() {
  const [status, setStatus] = useState("Verifying credentials...");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Set up a listener for the login event
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || session) {
            setStatus("Login success! Redirecting...");
            // Force a hard refresh to ensure server components see the new cookie
            router.refresh(); 
            setTimeout(() => router.replace("/"), 500); // Small delay to ensure cookie sticks
        }
    });

    // 2. Manual check (in case the listener missed the initial event)
    const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            setStatus("Session found. Redirecting...");
            router.refresh();
            router.replace("/");
        } else {
            // If no session yet, we DO NOT redirect. We wait for the hash parser.
            // If 5 seconds pass and still nothing, we show an error (handled by timeout below).
        }
    };

    checkSession();

    // 3. Fallback Timeout (If nothing happens after 8 seconds)
    const timeout = setTimeout(() => {
        setError("We couldn't verify your link automatically.");
        setStatus("");
    }, 8000);

    return () => {
        authListener.subscription.unsubscribe();
        clearTimeout(timeout);
    };
  }, [router]);

  // === RENDER ===
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center text-center max-w-sm w-full">
        
        {/* LOADING STATE */}
        {!error && (
            <>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Logging you in</h2>
                <p className="text-slate-500 text-sm animate-pulse">{status}</p>
            </>
        )}

        {/* ERROR STATE */}
        {error && (
            <div className="animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Link Issue</h2>
                <p className="text-slate-500 text-sm mb-6">{error}</p>
                <button 
                    onClick={() => router.push('/login')}
                    className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-black transition-all"
                >
                    Back to Login
                </button>
            </div>
        )}

      </div>
    </div>
  );
}