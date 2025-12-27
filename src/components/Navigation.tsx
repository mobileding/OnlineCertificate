"use client";

import { useEffect, useState, useRef } from "react"; // <--- 1. Import useRef
import { Link, useRouter } from "@/i18n/routing"; 
import { usePathname } from "next/navigation"; 
import { useLocale, useTranslations } from "next-intl"; 
import { createBrowserClient } from "@supabase/ssr";
import { User, LogOut, LayoutDashboard, Home, Mail, Settings } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Image from "next/image";

export function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale(); 
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  
  // 2. Add a Ref to track manual logout
  const isLoggingOut = useRef(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const isHomePage = pathname === `/${locale}` || pathname === '/';

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      // 3. Only refresh if we are NOT manually logging out
      if (_event === 'SIGNED_OUT' && !isLoggingOut.current) {
         router.refresh(); 
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    // 4. Set the flag BEFORE signing out
    isLoggingOut.current = true;
    
    await supabase.auth.signOut();
    setUser(null);
    
    // Force hard reload to clear all states/caches
    window.location.href = `/${locale}`; 
  };
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* === LOGO (WITH HARD REFRESH LOGIC) === */}
        {isHomePage ? (
            // OPTION A: If on Home -> Use <a> to force hard reload (Resets Generator)
            <a href={`/${locale}`} className="flex items-center gap-2 cursor-pointer">
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
            </a>
        ) : (
            // OPTION B: If elsewhere -> Use <Link> for fast client-side nav
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
        )}

        {/* MENU ITEMS */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Public Links */}
          {/* Note: I applied the same logic to the 'Home' icon link below for consistency */}
          {isHomePage ? (
             <a href={`/${locale}`} className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer">
                <Home size={16} /> <span className="hidden sm:inline">{t('home')}</span>
             </a>
          ) : (
             <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
                <Home size={16} /> <span className="hidden sm:inline">{t('home')}</span>
             </Link>
          )}
          
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