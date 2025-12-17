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

  // 2. PAGINATION & DATA FETCHING
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const PAGE_SIZE = 8; // Reduced slightly to fit sidebar better
  
  // 3. PRE-FILL LOGIC
  const targetKeyword = params?.keyword as string | undefined;

  const defaultTitle = targetKeyword 
    ? `The Ultimate Guide to ${targetKeyword}: Templates & Wording` 
    : "";

  const defaultExcerpt = targetKeyword 
    ? `Everything you need to know about ${targetKeyword}. Discover the best wording ideas, free templates, and tips for creating a professional award in minutes.` 
    : "";

  const defaultContent = targetKeyword 
    ? `# The Ultimate Guide to ${targetKeyword}

Creating a **${targetKeyword}** doesn't have to be complicated. Whether you are recognizing an employee, a student, or a volunteer, a well-designed certificate makes all the difference.

In this guide, we will cover:
* Why a ${targetKeyword} matters
* Best wording and text ideas
* How to design one for free

## Why use a ${targetKeyword}?
Recognition is a powerful motivator. Giving a **${targetKeyword}** shows appreciation and provides a tangible memory of the achievement. It is a simple gesture that builds loyalty and pride.

## Best Wording Ideas
If you are stuck on what to write on your **${targetKeyword}**, here are a few professional options:

* **Formal:** "In recognition of outstanding dedication and service."
* **Simple:** "Presented to [Name] for successfully completing the requirements."
* **Creative:** "Awarded for going above and beyond expectations."

## How to create one instantly
You don't need Photoshop or expensive software. You can use our free tool to generate a professional **${targetKeyword}** in seconds.

1. **Choose a Template:** Select a design that matches your style (Modern, Classic, or Fun).
2. **Enter Details:** Type the recipient's name and the reason for the award.
3. **Download:** Get a high-quality PDF instantly.

[Click here to create your certificate now](/create)

## Conclusion
A **${targetKeyword}** is more than just a piece of paper—it's a memory. By taking the time to create a personalized award, you are making someone feel truly valued. Start designing yours today!` 
    : "";

  const { data: posts, total } = await getBlogPosts(currentPage, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-end">
            <div>
                <Link href="/admin/tasks" className="flex items-center text-slate-500 hover:text-slate-800 mb-2 transition-colors text-sm font-medium">
                    <ArrowLeft size={16} className="mr-2" /> Back to Mission Control
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Blog Manager</h1>
            </div>
            <div className="text-xs text-slate-400 font-mono">
                {total} Articles • Page {currentPage}/{totalPages || 1}
            </div>
        </div>

        {/* LAYOUT GRID: 3 Columns Total (Form takes 2, List takes 1) */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: CREATE FORM (Big Area) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600"/> Write New Post
            </h2>
            
            {targetKeyword && (
                <div className="mb-6 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm font-bold border border-blue-100 flex justify-between items-center shadow-sm">
                    <span className="flex items-center gap-2">🎯 Mission: <span className="underline decoration-blue-300 underline-offset-4">"{targetKeyword}"</span></span>
                    <span className="text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-500 shadow-sm">Auto-Filled</span>
                </div>
            )}

            <form action={createBlogPost as any} className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Article Title</label>
                <input 
                    name="title" 
                    required 
                    defaultValue={defaultTitle} 
                    placeholder="e.g. How to create a school certificate" 
                    className="w-full p-3 border border-slate-300 rounded-lg font-bold text-slate-900 text-lg shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Image URL</label>
                    <input 
                      name="cover_image" 
                      placeholder="https://..." 
                      className="w-full p-2 border border-slate-200 rounded-md text-sm text-slate-600 focus:border-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Slug (Optional)</label>
                    <input 
                      name="slug" 
                      placeholder="Auto-generated if empty" 
                      className="w-full p-2 border border-slate-200 rounded-md text-sm text-slate-600 focus:border-blue-500 outline-none" 
                    />
                  </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Excerpt</label>
                <textarea 
                    name="excerpt" 
                    required 
                    rows={2} 
                    defaultValue={defaultExcerpt}
                    placeholder="SEO Description..." 
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm leading-relaxed focus:border-blue-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Content (Markdown)</label>
                <textarea 
                    name="content" 
                    required 
                    rows={20} 
                    defaultValue={defaultContent}
                    placeholder="# Heading 1..." 
                    className="w-full p-6 border border-slate-200 rounded-xl font-mono text-sm bg-slate-50 leading-relaxed focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 outline-none transition-all" 
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="is_published" id="pub" className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                    <label htmlFor="pub" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                        Publish immediately
                    </label>
                  </div>

                  <button type="submit" className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    Save Post
                  </button>
              </div>
            </form>
          </div>

          {/* RIGHT: COMPACT SIDEBAR LIST */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Recent Articles</h3>
            
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic text-sm">No posts yet.</div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {posts.map((post: any) => (
                    <li key={post.id} className="p-3 hover:bg-slate-50 transition-colors group">
                      <div className="flex justify-between items-start gap-2 mb-1">
                          <Link 
                            href={`/blog/${post.slug}`} 
                            target="_blank" 
                            className="font-bold text-slate-700 text-sm hover:text-blue-600 truncate leading-tight block flex-1"
                            title={post.title}
                          >
                            {post.title}
                          </Link>
                          
                          {/* Tiny Actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <form action={togglePostStatus as any}>
                                  <input type="hidden" name="id" value={post.id} />
                                  <input type="hidden" name="current_status" value={String(post.is_published)} />
                                  <button type="submit" className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600">
                                      {post.is_published ? 'Unpub' : 'Pub'}
                                  </button>
                              </form>
                              <form action={deleteBlogPost as any}>
                                <input type="hidden" name="id" value={post.id} />
                                <button type="submit" className="text-slate-300 hover:text-red-500 px-1">
                                  <Trash2 size={12} />
                                </button>
                              </form>
                          </div>
                      </div>

                      <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${post.is_published ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                            <span className="text-[10px] font-medium text-slate-400 uppercase">
                                {post.is_published ? 'Live' : 'Draft'}
                            </span>
                            <span className="text-[10px] text-slate-300">• {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
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
                  className={`flex items-center px-3 py-1.5 rounded border bg-white text-xs font-medium ${
                    currentPage <= 1 ? 'text-slate-300 border-slate-200 pointer-events-none' : 'text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <ChevronLeft size={12} className="mr-1" /> Prev
                </Link>
                <Link
                  href={`/admin/blog?page=${currentPage + 1}`}
                  className={`flex items-center px-3 py-1.5 rounded border bg-white text-xs font-medium ${
                    currentPage >= totalPages ? 'text-slate-300 border-slate-200 pointer-events-none' : 'text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Next <ChevronRight size={12} className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}