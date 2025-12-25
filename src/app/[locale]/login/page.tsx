"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, Mail, ArrowRight, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  
  // UI Toggles
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [usePassword, setUsePassword] = useState(false);

  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. MAGIC LINK HANDLER
  const handleMagicLink = async () => {
    if (!email) { 
        setMessage({ text: t('err_email_required'), type: "error" }); 
        return; 
    }
    setLoading(true); setMessage(null);
    try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setIsMagicLinkSent(true);
        setMessage({ text: t('msg_magic_sent'), type: "success" });
    } catch (err: any) { setMessage({ text: err.message, type: "error" }); } 
    finally { setLoading(false); }
  };

  // 2. PASSWORD HANDLER
  const handlePasswordLogin = async () => {
    setLoading(true); setMessage(null);
    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/"); router.refresh();
    } catch (err: any) { setMessage({ text: err.message, type: "error" }); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-xl border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
          <p className="text-slate-500 text-sm mt-1">
             {usePassword ? t('subtitle_pwd') : t('subtitle_magic')}
          </p>
        </div>

        {isMagicLinkSent ? (
            /* SUCCESS VIEW */
            <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{t('success_title')}</h3>
                <p className="text-slate-500 text-sm mb-6">
                    {t.rich('success_desc', {
                        email: email,
                        br: () => <br />,
                        b: (chunks) => <b>{chunks}</b>
                    })}
                </p>
                <button onClick={() => { setIsMagicLinkSent(false); setMessage(null); }} className="text-sm font-bold text-slate-400 hover:text-slate-600">
                    &larr; {t('btn_back')}
                </button>
            </div>
        ) : (
            /* LOGIN FORM */
            <div className="space-y-4">
            
            {/* Email Field (Always visible) */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">{t('label_email')}</label>
                <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="name@example.com" />
                </div>
            </div>
            
            {/* Password Field (Only if usePassword is true) */}
            {usePassword && (
                 <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">{t('label_password')}</label>
                    <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="••••••••" />
                    </div>
                </div>
            )}

            {message && <div className={`p-3 rounded-lg text-xs font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message.text}</div>}

            {/* Dynamic Action Button */}
            <button 
                onClick={usePassword ? handlePasswordLogin : handleMagicLink}
                disabled={loading}
                className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-black transition-all flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                    usePassword ? t('btn_signin_pwd') : (
                        <>{t('btn_signin_magic')} <ArrowRight className="w-4 h-4 opacity-70"/></>
                    )
                )}
            </button>

            {/* Toggle Link */}
            <div className="text-center pt-2">
                <button 
                    onClick={() => { setUsePassword(!usePassword); setMessage(null); }}
                    className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                    {usePassword ? t('toggle_magic') : t('toggle_pwd')}
                </button>
            </div>


            </div>
        )}
      </div>
    </div>
  );
}