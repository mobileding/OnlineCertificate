"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleAuth = async (action: "login" | "signup") => {
    setLoading(true);
    setMessage(null);

    try {
      if (action === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ text: "Check your email to confirm your account!", type: "success" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/"); // Redirect to home on success
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-xl border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to issue verified certificates</p>
        </div>

        <div className="space-y-4">
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
                placeholder="••••••••"
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-xs font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}

          <button 
            onClick={() => handleAuth("login")}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-black transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Sign In"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">Or</span></div>
          </div>

          <button 
            onClick={() => handleAuth("signup")}
            disabled={loading}
            className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-all"
          >
            Create Account
          </button>

          <Link href="/" className="block text-center text-xs text-slate-400 hover:text-slate-600 mt-4">
            Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}