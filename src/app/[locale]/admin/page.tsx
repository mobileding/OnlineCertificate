import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Link } from "@/i18n/routing";
import { FileText, Users, LayoutTemplate, Target, Search, ChevronLeft, ChevronRight, ShieldAlert, CheckCircle } from 'lucide-react';
import { AdminUserRow } from '@/components/AdminUserRow';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; filter?: string }>; 
}) {
  const params = await searchParams;
  const query = params.q || "";
  const filter = params.filter || "all"; 
  const currentPage = Number(params.page) || 1;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  // --- 1. GET THE "PENDING" COUNT ---
  const { count: pendingCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_org_verified', false)
    .not('google_business_url', 'is', null); 

  // --- 2. MAIN QUERY ---
  const ITEMS_PER_PAGE = 10;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let profileQuery = supabase
    .from('profiles')
    .select('*, certificates(count)', { count: 'exact' });

  if (query) {
    profileQuery = profileQuery.or(`email.ilike.%${query}%,organization_name.ilike.%${query}%`);
  }
  
  if (filter === 'pending') {
     profileQuery = profileQuery
        .eq('is_org_verified', false)
        .not('google_business_url', 'is', null);
  }

  const { data: profiles, count, error } = await profileQuery
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  // Quick Stats
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: templateCount } = await supabase.from('templates').select('*', { count: 'exact', head: true });
  const { count: blogCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
  
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const { count: weeklyCount } = await supabase
    .from('seo_missions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('completed_at', startOfWeek.toISOString());

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
            <p className="text-slate-500">System Overview</p>
          </div>
          <div className="flex gap-3">
             <Link href="/admin" className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
                <Users size={16} className="text-slate-400" />
                {totalUsers || 0} Total Users
             </Link>
          </div>
        </div>

        {/* === ACTION GRID (4 COLUMNS) === */}
        <div className="grid md:grid-cols-4 gap-6">
            
            {/* 1. VERIFICATION QUEUE */}
            <Link 
                href="/admin?filter=pending" 
                className={`group block p-6 rounded-xl border shadow-sm transition-all ${
                    (pendingCount || 0) > 0 
                    ? "bg-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-md cursor-pointer" 
                    : "bg-white border-slate-200 opacity-60 hover:opacity-100"
                }`}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${(pendingCount || 0) > 0 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                        <ShieldAlert size={24} />
                    </div>
                    {(pendingCount || 0) > 0 ? (
                        <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded animate-pulse">
                            {pendingCount} Pending
                        </span>
                    ) : (
                         <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle size={10} /> All Clear
                        </span>
                    )}
                </div>
                <h3 className={`text-lg font-bold mb-1 ${(pendingCount || 0) > 0 ? "text-amber-900" : "text-slate-900"}`}>
                    Verification Queue
                </h3>
            </Link>

            {/* 2. MISSION CONTROL */}
            <Link href="/admin/tasks" className="group block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Target size={24} /></div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        <span className="text-emerald-600 font-bold">+{weeklyCount || 0}</span> This Week
                    </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Mission Control</h3>
            </Link>
            
            {/* 3. SEO TEMPLATES */}
            <Link href="/admin/seotemplate" className="group block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><LayoutTemplate size={24} /></div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{templateCount || 0} Pages</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">SEO Templates</h3>
            </Link>

            {/* 4. BLOG MANAGER */}
            <Link href="/admin/blog" className="group block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FileText size={24} /></div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{blogCount || 0} Posts</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">Blog Manager</h3>
            </Link>

        </div>

        {/* SECTION 2: USER TABLE */}
        <div>
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {filter === 'pending' ? (
                        <>
                            <ShieldAlert size={20} className="text-amber-500" /> 
                            <span>Pending Verifications</span>
                            <Link href="/admin" className="text-xs font-normal text-blue-600 underline ml-2">(Show All)</Link>
                        </>
                    ) : (
                        <><Users size={20} /> Master User List</>
                    )}
                </h2>
                
                {/* SEARCH BAR */}
                <form className="relative w-64">
                    <input 
                        name="q"
                        defaultValue={query}
                        placeholder="Search email or org..." 
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="absolute left-3 top-2.5 text-slate-400">
                        <Search className="w-4 h-4" />
                    </button>
                    <input type="hidden" name="page" value="1" />
                </form>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs">User / Email</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs text-center">Certs</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs w-64">Org Name (Edit)</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs">Evidence</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs">Identity</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {profiles?.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-slate-400">
                        {filter === 'pending' ? "Good job! No pending verifications." : "No users found."}
                    </td></tr>
                ) : (
                    profiles?.map((profile) => (
                        <AdminUserRow key={profile.id} profile={profile} />
                    ))
                )}
                </tbody>
            </table>
            
            {/* PAGINATION */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                    Showing <strong>{from + 1}-{Math.min(to + 1, count || 0)}</strong> of <strong>{count}</strong>
                </span>
                
                <div className="flex gap-2">
                    <Link 
                        href={`/admin?page=${currentPage - 1}&q=${query}&filter=${filter}`}
                        className={`p-2 rounded hover:bg-white border border-transparent hover:border-slate-200 transition-all ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronLeft size={16} />
                    </Link>
                    <span className="text-sm font-bold text-slate-700 py-2 px-2">Page {currentPage}</span>
                    <Link 
                        href={`/admin?page=${currentPage + 1}&q=${query}&filter=${filter}`}
                        className={`p-2 rounded hover:bg-white border border-transparent hover:border-slate-200 transition-all ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
            </div>
        </div>

      </div>
    </main>
  );
}