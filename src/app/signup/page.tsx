"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" | "info" } | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleEmailSignUp = async () => {
    setLoading(true);
    setMessage(null);

    try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`, 
          }
        });
        
        if (error) throw error;
        
        setIsSuccess(true);
        setMessage({ text: "Account created! Please check your email.", type: "success" });

    } catch (err: any) {
      // === UX IMPROVEMENT: Detect Duplicate Accounts ===
      if (err.message.includes("already registered") || err.status === 400) {
          setMessage({ 
              text: "This email is already registered. Please log in instead.", 
              type: "info" // Show blue/neutral instead of red error
          });
      } else {
          setMessage({ text: err.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your inbox</h1>
                <p className="text-slate-500 text-sm mb-6">
                    We've sent a confirmation link to <strong>{email}</strong>. Please click the link to activate your account.
                </p>
                <Link href="/login" className="text-blue-600 font-bold hover:underline text-sm">
                    Back to Sign In
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-xl border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Start issuing verified certificates today</p>
        </div>

        <div className="space-y-4">

          {/* Email Field */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="Create a password"
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 
                ${message.type === 'error' ? 'bg-red-50 text-red-600' : 
                  message.type === 'info' ? 'bg-blue-50 text-blue-700' : 
                  'bg-green-50 text-green-600'}`}>
               {message.type === 'error' && <AlertCircle className="w-4 h-4"/>}
               {message.text}
               {/* If it's the "already registered" info message, show a login link */}
               {message.type === 'info' && (
                   <Link href="/login" className="underline font-bold ml-auto">Log In &rarr;</Link>
               )}
            </div>
          )}

          <button 
            onClick={handleEmailSignUp}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-black transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Create Account"}
          </button>

          <div className="text-center mt-4">
              <span className="text-xs text-slate-500">Already have an account? </span>
              <Link href="/login" className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">
                 Sign In
              </Link>
          </div>

        </div>
      </div>
    </div>
  );
}