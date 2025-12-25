"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react"; // <--- 1. Import Suspense

// 2. Move your UI logic into this sub-component
function ErrorCard() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Login Failed</h1>
      <p className="text-slate-500 text-sm mb-6">
         The login link was invalid or has expired.
         {error && (
           <span className="block mt-2 font-mono text-xs text-red-500 bg-red-50 p-2 rounded">
             {error}
           </span>
         )}
      </p>
      <Link href="/login" className="text-blue-600 font-bold hover:underline text-sm">
         Try Logging In Again
      </Link>
    </div>
  );
}

// 3. The main page now just wraps the card in Suspense
export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* This boundary fixes the Vercel build error */}
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorCard />
      </Suspense>
    </div>
  );
}