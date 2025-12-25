"use client";

import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/routing"; // 1. Custom Routing
import { useLocale, useTranslations } from "next-intl"; // 2. i18n Hooks
import { createBrowserClient } from "@supabase/ssr";
import { User, LogOut, LayoutDashboard, Home, Mail, Settings } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Image from "next/image";

export function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale(); // Get current language (e.g., 'en', 'es', 'zh')
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // 1. Initial User Check
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // 2. Real-time Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') {
         // Fallback: If session expires automatically, just refresh current view
         router.refresh(); 
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    
    // 3. LOGOUT LOGIC (Locale Aware)
    // We force a hard reload to the localized root (e.g. /es, /zh, or /en)
    // This clears the cache but keeps the user in their chosen language.
    window.location.href = `/${locale}`; 
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/certlogo.png" 
            alt="OnlineCertificate Logo" 
            width={32} 
            height={32} 
            className="object-contain" 
          />
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            OnlineCertificate<span className="text-blue-600">.org</span>
          </span>
        </Link>

        {/* MENU ITEMS */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Public Links */}
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