"use client";

import { useEffect, useState } from "react";
// 1. CHANGE: Import Link and useRouter from your custom i18n routing
import { Link, useRouter } from "@/i18n/routing"; 
import { useLocale } from "next-intl"; // 2. Import useLocale
import { createBrowserClient } from "@supabase/ssr";
import { User, LogOut, LayoutDashboard, Home, Mail, Settings } from "lucide-react";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale(); // Get current language (e.g., 'en' or 'es')
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    
    // 3. FIX: Hard reload to the CURRENT locale root
    // This preserves the language while still clearing the browser cache
    window.location.href = `/${locale}`; 
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo - Use Link instead of <a> to preserve language state */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            OnlineCertificate<span className="text-blue-600">.org</span>
          </span>
        </Link>

        {/* Menu Items */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Public Links */}
          {/* Use Link instead of <a> */}
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
            <Home size={16} /> <span className="hidden sm:inline">{t('home')}</span>
          </Link>
          
          <Link href="/contact" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
             <Mail size={16} /> <span className="hidden sm:inline">{t('contact')}</span>
          </Link>

          {/* Language Switcher */}
          <div className="border-l border-slate-200 pl-4 ml-2">
             <LanguageSwitcher />
          </div>

          {/* Auth Logic */}
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5 ml-2">
                <LayoutDashboard size={16} /> {t('dashboard')}
              </Link>

              <Link href="/profile" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
                <Settings size={16} /> <span className="hidden md:inline">{t('profile')}</span>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="text-sm font-medium text-slate-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={16} /> <span className="hidden md:inline">{t('logout')}</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="ml-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all flex items-center gap-2"
              >
                <User size={16} /> <span className="hidden sm:inline">{t('signin')}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}