import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// 1. CHANGE: Use the i18n Link so buttons keep the language
import { Link } from "@/i18n/routing"; 
import { Award } from "lucide-react";
import { DashboardTable } from '@/components/DashboardTable'; 
import { getTranslations } from 'next-intl/server'; 

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() }
      }
    }
  );

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // FIX: Redirect to the localized login page
    redirect(`/${locale}/login`);
  }

  // 2. === THE GATEKEEPER ===
const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const isPaid = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';
  
  // --- THE FIX START ---
  // Check if the URL has ?new_pro=true
  const search = await searchParams;
  const isFreshUpgrade = search?.new_pro === 'true';

  // LOGIC: If they are NOT paid, AND they are NOT a fresh upgrade -> Kick them out.
  // "isFreshUpgrade" acts as our VIP Pass to bypass the check for this one visit.
  if (!isPaid && !isFreshUpgrade) {
    redirect(`/${locale}/pricing?error=upgrade_required`);
  }
  // ==========================

  // 3. Fetch Certificates
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .eq('issuer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
            <p className="text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
          <Link href="/" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition flex items-center justify-center gap-2 shadow-sm">
            <Award size={18} /> {t('btn_issue')}
          </Link>
        </div>

        {/* The Table */}
        {certificates && certificates.length > 0 ? (
          <DashboardTable certificates={certificates} />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-slate-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('empty_title')}</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              {t('empty_desc')}
            </p>
          </div>
        )}

      </div>
    </main>
  );
}