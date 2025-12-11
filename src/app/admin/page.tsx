import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// Import the new Client Component
import { AdminUserRow } from '../../components/AdminUserRow';
import { createPost } from "../actions/admin"; // Import the new action

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

  // UPDATED QUERY: Fetch profiles AND the count of their certificates
  // Note: 'certificates(count)' relies on the foreign key we set up earlier
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*, certificates(count)', { count: 'exact' }) 
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
            <p className="text-slate-500">Master User List</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium">
             Total Users: {profiles?.length || 0}
          </div>
        </div>



{/* SECTION 1: WRITE A POST */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Write New Article</h2>
        <form action={createPost} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input name="title" required placeholder="Article Title" className="w-full p-2 border rounded" />
            <input name="excerpt" required placeholder="Short summary (for SEO)" className="w-full p-2 border rounded" />
          </div>
          <textarea name="content" required placeholder="Write in Markdown (# Heading, **Bold**)..." className="w-full p-2 border rounded h-32 font-mono text-sm" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
            Publish Post
          </button>
        </form>
      </div>






        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs">User / Email</th>
                {/* NEW COLUMN */}
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs text-center">Certs Created</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs w-64">Org Name (Editable)</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs">Identity</th>
                {/* MERGED COLUMN (Status + Action) */}
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
    </main>
  );
}