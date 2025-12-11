"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { User, LogOut, LayoutDashboard, Home, Mail, Settings, BookOpen } from "lucide-react";

export function Navigation() {
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
    
    // Force a hard reload to the home page.
    // This clears the browser memory/cache and guarantees the redirect happens.
    window.location.href = "/"; 
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            OnlineCertificate<span className="text-blue-600">.org</span>
          </span>
        </Link>

        {/* Menu Items */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
            <Home size={16} /> <span className="hidden sm:inline">Home</span>
          </Link>
          
{/* NEW LINK */}
  <Link href="/blog" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
     <BookOpen size={16} /> <span className="hidden sm:inline">Blog</span>
  </Link>

          {/* UPDATED: Points to the Contact Page now */}
          <Link href="/contact" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
             <Mail size={16} /> <span className="hidden sm:inline">Contact</span>
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5">
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              {/* NEW: Points to the Profile Page */}
              <Link href="/profile" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5">
                <Settings size={16} /> Profile
              </Link>
              
              <div className="h-4 w-px bg-slate-200 mx-2"></div>

              <button 
                onClick={handleLogout} 
                className="text-sm font-medium text-slate-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              className="ml-4 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all flex items-center gap-2"
            >
              <User size={16} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}