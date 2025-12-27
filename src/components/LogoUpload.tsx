"use client";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Camera, Loader2, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl"; // <--- 1. Import this

export function LogoUpload({ userId, currentLogoUrl }: { userId: string, currentLogoUrl: string | null }) {
  const t = useTranslations('Profile'); // <--- 2. Hook into the 'Profile' namespace
  const [logoUrl, setLogoUrl] = useState<string | null>(currentLogoUrl);
  const [uploading, setUploading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (currentLogoUrl && !currentLogoUrl.startsWith('http')) {
        const { data } = supabase.storage.from('logos').getPublicUrl(currentLogoUrl);
        setLogoUrl(data.publicUrl);
    }
  }, [currentLogoUrl]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return; 
      }

      const file = event.target.files[0];
      
      // === 1. LIMIT: File Size (2MB) ===
      const limitMB = 2;
      if (file.size > limitMB * 1024 * 1024) {
         // Localized Alert with variable
         alert(t('upload_alert_size', { limit: limitMB }));
         return;
      }

      // === 2. LIMIT: File Type ===
      if (!file.type.startsWith("image/")) {
         alert(t('upload_alert_type'));
         return;
      }

      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-logo.${fileExt}`;

      // 3. Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 4. Update Profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ logo_url: filePath })
        .eq("id", userId);

      if (updateError) throw updateError;

      // 5. Refresh
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(filePath);
      setLogoUrl(`${urlData.publicUrl}?t=${Date.now()}`); 

    } catch (error: any) {
      alert(`${t('upload_alert_error')} ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-3">
      <div className="relative group">
        {/* The Image Circle */}
        <div className="w-24 h-24 rounded-xl border-2 border-slate-200 bg-white flex items-center justify-center overflow-hidden shadow-sm relative">
          {uploading ? (
             <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-blue-600" />
             </div>
          ) : null}
          
          {logoUrl ? (
            <img 
               src={logoUrl} 
               alt={t('upload_alt')} 
               className="w-full h-full object-contain p-1" 
            />
          ) : (
            <ImageIcon className="text-slate-300 w-8 h-8" />
          )}
        </div>

        {/* The Upload Button Overlay */}
        <label className="absolute inset-0 flex flex-col gap-1 items-center justify-center bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl backdrop-blur-[2px]">
            <Camera size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wide">{t('upload_btn_change')}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
        </label>
      </div>
      
      {/* Helper Text */}
      <p className="text-[10px] text-slate-400 font-medium text-center sm:text-left leading-tight">
         {t('upload_helper')}
      </p>
    </div>
  );
}