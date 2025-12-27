import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Link } from "@/i18n/routing"; 
import { Award, Rocket, BookOpen, ArrowRight } from "lucide-react"; // Added Icons
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

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // === THE GATEKEEPER ===
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, created_at')
    .eq('id', user.id)
    .single();

  const isPaid = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

  // Check if "Brand New" (created in last 10 mins) to allow graceful payment catch-up
  const createdAt = new Date(user.created_at).getTime();
  const now = new Date().getTime();
  const isBrandNew = (now - createdAt) < 10 * 60 * 1000; 

  if (!isPaid && !isBrandNew) {
      console.log(`[Dashboard] Blocking User ${user.email}. Tier: ${profile?.subscription_tier}`);
      redirect(`/${locale}/pricing?error=upgrade_required`);
  }

  // Fetch Certificates
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
          {/* Only show top button if they actually have data, otherwise the big button below is enough */}
          {certificates && certificates.length > 0 && (
            <Link href="/" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition flex items-center justify-center gap-2 shadow-sm">
                <Award size={18} /> {t('btn_issue')}
            </Link>
          )}
        </div>

        {/* Content Area */}
        {certificates && certificates.length > 0 ? (
          <DashboardTable certificates={certificates} />
        ) : (
          /* === NEW WELCOME STATE === */
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm flex flex-col items-center">
            
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-6 ring-8 ring-blue-50/50">
              <Rocket className="text-blue-600 w-10 h-10 ml-1" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('welcome_title')}</h3>
            
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg leading-relaxed">
              {t('welcome_desc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Primary CTA: Create Certificate */}
                <Link 
                    href="/" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                >
                    {t('btn_create_first')} <ArrowRight size={18} />
                </Link>

                {/* Secondary CTA: Read Guide */}
                <Link 
                    href="/guide" 
                    className="text-slate-600 hover:text-slate-900 px-6 py-3 font-medium flex items-center gap-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                    <BookOpen size={18} /> {t('link_guide')}
                </Link>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}