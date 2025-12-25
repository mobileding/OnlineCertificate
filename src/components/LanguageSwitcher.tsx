"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../i18n/routing';
import { Languages, Check, ChevronDown } from 'lucide-react'; // Changed Icon
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSelectChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        // UPDATED STYLING:
        // 1. bg-slate-100: Gives it a visible background container
        // 2. text-slate-700: Darker text for contrast
        // 3. hover:ring-2: Adds a blue ring on hover to scream "clickable"
        className={`
            flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all
            ${isOpen ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}
        `}
      >
        <Languages size={16} className="text-blue-600" /> {/* Blue icon stands out */}
        <span className="uppercase">{locale}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Language
            </div>
            <button
              onClick={() => onSelectChange('en')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🇺🇸</span> 
                <span className="font-medium">English</span>
              </div>
              {locale === 'en' && <Check size={14} className="text-blue-600" />}
            </button>
            <button
              onClick={() => onSelectChange('es')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🇪🇸</span> 
                <span className="font-medium">Español</span>
              </div>
              {locale === 'es' && <Check size={14} className="text-blue-600" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}