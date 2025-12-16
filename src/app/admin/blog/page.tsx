import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, ExternalLink, ChevronLeft, ChevronRight, FileText, Eye } from 'lucide-react';

import { createBlogPost, getBlogPosts, deleteBlogPost, togglePostStatus } from '../../actions/blog';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogAdminPage({ searchParams }: PageProps) {
  // 1. SECURITY CHECK
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

  // 2. PAGINATION
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const PAGE_SIZE = 10;
  const { data: posts, total } = await getBlogPosts(currentPage, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
            <div>
                <Link href="/admin" className="flex items-center text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Blog Manager</h1>
                <p className="text-slate-500">Managing {total} articles</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* LEFT: CREATE FORM */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-fit sticky top-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5"/> Write New Post
            </h2>
            {/* FIX 1: Added 'as any' to silence TypeScript error */}
            <form action={createBlogPost as any} className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Article Title</label>
                <input name="title" required placeholder="e.g. How to create a school certificate" className="w-full p-2 border rounded-md" />
              </div>
              
              {/* COVER IMAGE URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
                <input 
                  name="cover_image" 
                  placeholder="https://images.unsplash.com/photo-..." 
                  className="w-full p-2 border rounded-md text-sm text-slate-600" 
                />
                <p className="text-xs text-slate-400 mt-1">Paste a link to an image (Unsplash, etc.)</p>
              </div>

              {/* EXCERPT */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Excerpt (SEO Description)</label>
                <textarea name="excerpt" required rows={2} placeholder="A short summary..." className="w-full p-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Main Content (Markdown Supported)</label>
                <textarea 
                    name="content" 
                    required 
                    rows={12} 
                    placeholder="# Heading 1&#10;&#10;Write your article content here. You can use **bold**, *italics*, and lists." 
                    className="w-full p-4 border rounded-md font-mono text-sm bg-slate-50" 
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                <input type="checkbox" name="is_published" id="pub" className="w-4 h-4 text-blue-600 rounded" />
                <label htmlFor="pub" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Publish immediately? (If unchecked, saves as Draft)
                </label>
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-md transition-all">
                Save Article
              </button>
            </form>
          </div>

          {/* RIGHT: LIST */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic">No posts found.</div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {posts.map((post: any) => (
                    <li key={post.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${post.is_published ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                            <span className="text-xs font-bold uppercase text-slate-400">
                                {post.is_published ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-xs text-slate-400">• {new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="font-semibold text-slate-900 truncate mb-1">{post.title}</div>
                        <Link 
                          href={`/blog/${post.slug}`} 
                          target="_blank" 
                          className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 w-fit"
                        >
                          <Eye size={12} /> View Live
                        </Link>
                      </div>

                      {/* TOGGLE STATUS BUTTON */}
                      {/* FIX 2: Added 'as any' here too */}
                      <form action={togglePostStatus as any}>
                          <input type="hidden" name="id" value={post.id} />
                          <input type="hidden" name="current_status" value={String(post.is_published)} />
                          
                          <button 
                              type="submit" 
                              className={`px-3 py-1 text-xs font-bold rounded border transition-colors mr-2 ${
                                  post.is_published 
                                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                      : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                              }`}
                          >
                              {post.is_published ? 'Unpublish' : 'Publish Now'}
                          </button>
                      </form>

                      {/* DELETE BUTTON */}
                      {/* FIX 3: Added 'as any' here too */}
                      <form action={deleteBlogPost as any}>
                        <input type="hidden" name="id" value={post.id} />
                        <button type="submit" className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors" title="Delete Post">
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Link
                  href={`/admin/blog?page=${currentPage - 1}`}
                  className={`flex items-center px-4 py-2 rounded border bg-white ${
                    currentPage <= 1 ? 'text-slate-300 border-slate-200 pointer-events-none' : 'text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <ChevronLeft size={16} className="mr-1" /> Prev
                </Link>
                <Link
                  href={`/admin/blog?page=${currentPage + 1}`}
                  className={`flex items-center px-4 py-2 rounded border bg-white ${
                    currentPage >= totalPages ? 'text-slate-300 border-slate-200 pointer-events-none' : 'text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}