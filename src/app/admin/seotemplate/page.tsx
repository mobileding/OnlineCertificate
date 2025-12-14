import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

import { createSeoTemplate, getSeoTemplates, deleteSeoTemplate } from '../../actions/admin';

// Define Props for Search Params (Query String)
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CreateTemplatePage({ searchParams }: PageProps) {
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

  // 2. PAGINATION LOGIC
  // Await the searchParams (Next.js 15 requirement)
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const PAGE_SIZE = 10;

  // 3. FETCH DATA
  const { data: templates, total } = await getSeoTemplates(currentPage, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="flex items-center text-slate-500 hover:text-slate-800 mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">SEO Template Manager</h1>
              <p className="text-slate-500">Managing {total} total landing pages</p>
            </div>
            <div className="text-sm text-slate-500 font-medium bg-white px-3 py-1 rounded border border-slate-200">
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: CREATE FORM (Stays fixed) */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-fit sticky top-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Template</h2>
            <form action={createSeoTemplate} className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Page Title (H1)</label>
                <input name="title" required placeholder="e.g. Best Certificate for Schools" className="w-full p-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
                <textarea name="description" required rows={2} placeholder="Meta description..." className="w-full p-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">AI Prompt</label>
                <textarea name="prompt" required rows={3} placeholder="AI Instructions..." className="w-full p-2 border rounded-md font-mono text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <select name="color" className="w-full p-2 border rounded-md bg-white">
                    <option value="blue">Blue</option>
                    <option value="gold">Gold</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="slate">Slate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Design</label>
                  <select name="design" className="w-full p-2 border rounded-md bg-white">
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="ornate">Ornate</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition-all">
                Create Page
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: EXISTING LIST */}
          <div className="space-y-4">
            
            {/* List Container */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {templates.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic">No templates found on this page.</div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {templates.map((t: any) => (
                    <li key={t.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{t.title}</div>
                        <Link 
                          href={`/create/${t.slug}`} 
                          target="_blank" 
                          className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1"
                        >
                          <ExternalLink size={12} /> /create/{t.slug}
                        </Link>
                      </div>
                      <form action={deleteSeoTemplate}>
                        <input type="hidden" name="id" value={t.id} />
                        <button type="submit" className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors">
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
                  href={`/admin/seotemplate?page=${currentPage - 1}`}
                  className={`flex items-center px-4 py-2 rounded border bg-white ${
                    currentPage <= 1 
                      ? 'text-slate-300 border-slate-200 pointer-events-none' 
                      : 'text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <ChevronLeft size={16} className="mr-1" /> Prev
                </Link>
                
                <Link
                  href={`/admin/seotemplate?page=${currentPage + 1}`}
                  className={`flex items-center px-4 py-2 rounded border bg-white ${
                    currentPage >= totalPages 
                      ? 'text-slate-300 border-slate-200 pointer-events-none' 
                      : 'text-slate-700 border-slate-300 hover:bg-slate-50'
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