"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

// Unwrap params for Next.js 15+
export default function CheckoutSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params); // Unwrap the promise
  const locale = resolvedParams.locale;
  
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter();

  const [status, setStatus] = useState("Verifying payment...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      return;
    }

    // THE TIMER / POLLING LOGIC
    const processOrder = async () => {
      try {
        setStatus("Finalizing account setup...");
        
        // Call our new API
        const res = await fetch('/api/fulfill-order', {
            method: 'POST',
            body: JSON.stringify({ sessionId, locale }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Processing failed");

        // If successful, the API gives us the Magic Link URL
        if (data.success && data.redirectUrl) {
            setStatus("Success! Redirecting...");
            // Force hard redirect to clear caches
            window.location.href = data.redirectUrl;
        } else {
            throw new Error("No redirect URL received");
        }

      } catch (err: any) {
        console.error(err);
        // If it fails (race condition?), we wait 2 seconds and try ONE more time (simple retry)
        setStatus("Retrying...");
        setTimeout(() => {
             // You could add a retry loop here, but for now let's show the error
             setError("We received your payment, but account setup is taking longer than expected. Please check your email.");
        }, 3000);
      }
    };

    processOrder();

  }, [sessionId, locale]);

  // RENDER
  if (error) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-100 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900">Setup Issue</h2>
                <p className="text-slate-600 mt-2">{error}</p>
                <p className="text-sm text-slate-400 mt-4">Contact support if you cannot access your account.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
           <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Received</h2>
        <p className="text-slate-500 mb-4">{status}</p>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-full w-2/3 animate-pulse"></div>
        </div>
        <p className="text-xs text-slate-400 mt-6">Please do not close this window.</p>
      </div>
    </div>
  );
}