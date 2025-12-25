// src/app/admin/blog/[id]/page.tsx

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import { updateBlogPost, deleteBlogPost } from '../../../actions/blog';

// SAFE INTERFACE: Accepts params as a Promise OR a regular object
interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function EditBlogPage(props: PageProps) {
  // 1. SAFELY RESOLVE PARAMS
  // This works regardless of your Next.js version
  const params = await Promise.resolve(props.params);
  const postId = params.id;

  // 2. SECURITY CHECK
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

  // 3. FETCH THE POST
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-slate-800">Post Not Found</h1>
        <p className="text-slate-500 mb-4">Could not find ID: {postId}</p>
        <Link href="/admin/blog" className="text-blue-600 hover:underline">Go Back</Link>
      </div>
    );
  }

  // ... (The rest of the return statement stays exactly the same as before) ...
  return (
    <main className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link href="/admin/blog" className="flex items-center text-slate-500 hover:text-slate-800 mb-2 transition-colors text-sm font-medium">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Editing: <span className="text-blue-600 truncate max-w-md">{post.title}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* PREVIEW BUTTON */}
            <Link 
              href={`/blog/${post.slug}`} 
              target="_blank" 
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <Eye size={16} /> Preview Live
            </Link>

            {/* DELETE BUTTON */}
            <form action={deleteBlogPost as any}>
               <input type="hidden" name="id" value={post.id} />
               <button 
                 type="submit" 
                 className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition-all"
               >
                 <Trash2 size={16} /> Delete
               </button>
            </form>
          </div>
        </div>

        {/* EDITOR FORM */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <form action={updateBlogPost as any} className="space-y-6">
            <input type="hidden" name="id" value={post.id} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* MAIN CONTENT COLUMN */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Article Title</label>
                  <input 
                    name="title" 
                    required 
                    defaultValue={post.title}
                    className="w-full p-3 border border-slate-300 rounded-lg font-bold text-slate-900 text-lg shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Excerpt (SEO)</label>
                  <textarea 
                    name="excerpt" 
                    required 
                    rows={3} 
                    defaultValue={post.excerpt}
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm leading-relaxed focus:border-blue-500 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Content (Markdown)</label>
                  <textarea 
                    name="content" 
                    required 
                    rows={25} 
                    defaultValue={post.content}
                    className="w-full p-6 border border-slate-200 rounded-xl font-mono text-sm bg-slate-50 leading-relaxed focus:border-blue-500 focus:bg-white outline-none" 
                  />
                </div>
              </div>

              {/* SIDEBAR SETTINGS COLUMN */}
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Publishing Status</label>
                  <div className="flex items-center gap-3 bg-white p-3 rounded border border-slate-200">
                    <input 
                      type="checkbox" 
                      name="is_published" 
                      id="pub" 
                      defaultChecked={post.is_published}
                      className="w-5 h-5 text-blue-600 rounded cursor-pointer" 
                    />
                    <label htmlFor="pub" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                       Publish Article
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Slug URL</label>
                  <input 
                    name="slug" 
                    defaultValue={post.slug}
                    className="w-full p-2 border border-slate-200 rounded-md text-sm text-slate-600 focus:border-blue-500 outline-none font-mono" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Image URL</label>
                  <input 
                    name="cover_image" 
                    defaultValue={post.cover_image}
                    className="w-full p-2 border border-slate-200 rounded-md text-sm text-slate-600 focus:border-blue-500 outline-none" 
                  />
                  {post.cover_image && (
                    <img src={post.cover_image} alt="Cover" className="mt-2 w-full h-32 object-cover rounded border border-slate-100" />
                  )}
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}