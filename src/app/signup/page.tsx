"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, UserPlus, CheckCircle } from "lucide-react";
import Link from "next/link";

// Reusing your Google Icon for consistency
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success view
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setMessage(null);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
    } catch (err: any) {
        setMessage({ text: err.message, type: "error" });
        setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    setLoading(true);
    setMessage(null);

    try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Redirect them back to login or dashboard after they click the email link
            emailRedirectTo: `${window.location.origin}/auth/callback`, 
          }
        });
        
        if (error) throw error;
        
        // Show success state
        setIsSuccess(true);
        setMessage({ text: "Account created! Please check your email.", type: "success" });

    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // === SUCCESS VIEW (After clicking Sign Up) ===
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

  // === FORM VIEW ===
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-xl border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Start issuing verified certificates today</p>
        </div>

        <div className="space-y-4">
          
          {/* Google Button */}
          <button 
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-all flex justify-center items-center gap-2 mb-2"
          >
             <GoogleIcon />
             Sign up with Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">Or with email</span></div>
          </div>

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
            <div className={`p-3 rounded-lg text-xs font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}

          <button 
            onClick={handleEmailSignUp}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-black transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Create Account"}
          </button>

          {/* Link to Login */}
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