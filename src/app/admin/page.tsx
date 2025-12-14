import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link'; // Import Link
import { FileText, Search, Users, ArrowRight } from 'lucide-react'; // Import Icons

// Import the Client Component for the user row
import { AdminUserRow } from '../../components/AdminUserRow';

export default async function AdminPage() {
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

  // Fetch profiles with certificate counts
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*, certificates(count)', { count: 'exact' }) 
    .order('created_at', { ascending: false });

  // Get some quick stats (optional, but looks nice)
  const { count: templateCount } = await supabase.from('templates').select('*', { count: 'exact', head: true });
  const { count: blogCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });

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
             <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                {profiles?.length || 0} Users
             </div>
          </div>
        </div>

        {/* SECTION 1: MANAGEMENT LINKS (New) */}
        <div className="grid md:grid-cols-2 gap-6">
            
            {/* SEO Template Manager Card */}
            <Link href="/admin/seotemplate" className="group block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Search size={24} />
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {templateCount || 0} Pages
                    </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">SEO Template Manager</h3>
                <p className="text-slate-500 text-sm mb-4">Create and manage programmatic landing pages (e.g. "Best Dad Certificate").</p>
                <div className="text-blue-600 text-sm font-bold flex items-center group-hover:underline">
                    Manage Templates <ArrowRight size={16} className="ml-1" />
                </div>
            </Link>

            {/* Blog Manager Card */}
            <Link href="/admin/blog" className="group block bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <FileText size={24} />
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {blogCount || 0} Posts
                    </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">Blog Manager</h3>
                <p className="text-slate-500 text-sm mb-4">Write articles, manage drafts, and publish content to the blog.</p>
                <div className="text-purple-600 text-sm font-bold flex items-center group-hover:underline">
                    Manage Blog <ArrowRight size={16} className="ml-1" />
                </div>
            </Link>

        </div>

        {/* SECTION 2: USER TABLE (Existing) */}
        <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users size={20} /> Master User List
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs">User / Email</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs text-center">Certs Created</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs w-64">Org Name (Editable)</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs">Identity</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs text-right">Business Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {profiles?.map((profile) => (
                    <AdminUserRow key={profile.id} profile={profile} />
                ))}
                </tbody>
            </table>
            </div>
        </div>

      </div>
    </main>
  );
}