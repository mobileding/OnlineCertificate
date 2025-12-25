import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, ExternalLink, ChevronLeft, ChevronRight, LayoutTemplate } from 'lucide-react';

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

  // 2. PAGINATION & PRE-FILL LOGIC
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const PAGE_SIZE = 8; // Reduced slightly to fit sidebar better

  // --- NEW: CATCH KEYWORD FROM MISSION CONTROL ---
  const targetKeyword = params?.keyword as string | undefined;

  const defaultTitle = targetKeyword ? `Free ${targetKeyword} Template` : "";
  const defaultDesc = targetKeyword 
    ? `Create and download a professional ${targetKeyword} in minutes. Fully customizable, printable, and free to use.` 
    : "";
  const defaultPrompt = targetKeyword 
    ? `Create a certificate design for "${targetKeyword}". Use a professional and encouraging tone. The action text should be relevant to this specific achievement.` 
    : "";
  // -----------------------------------------------

  // 3. FETCH DATA
  const { data: templates, total } = await getSeoTemplates(currentPage, PAGE_SIZE);
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
            <h1 className="text-2xl font-bold text-slate-900">SEO Template Manager</h1>
          </div>
          <div className="text-xs text-slate-400 font-mono">
                {total} Pages • Page {currentPage}/{totalPages || 1}
          </div>
        </div>

        {/* LAYOUT GRID: 3 Columns Total (Form takes 2, List takes 1) */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: CREATE FORM (Big Area) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-purple-600"/> Create New Template
            </h2>
            
            {/* ALERT: If a keyword is active, show a badge */}
            {targetKeyword && (
                <div className="mb-6 bg-purple-50 text-purple-700 px-4 py-3 rounded-lg text-sm font-bold border border-purple-100 flex justify-between items-center shadow-sm">
                    <span className="flex items-center gap-2">🎯 Mission: <span className="underline decoration-purple-300 underline-offset-4">"{targetKeyword}"</span></span>
                    <span className="text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-500 shadow-sm">Auto-Filled</span>
                </div>
            )}

            <form action={createSeoTemplate as any} className="space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Page Title (H1)</label>
                <input 
                    name="title" 
                    required 
                    defaultValue={defaultTitle} // <--- PRE-FILL
                    placeholder="e.g. Best Certificate for Schools" 
                    className="w-full p-3 border border-slate-300 rounded-lg font-bold text-slate-900 text-lg shadow-sm focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SEO Description</label>
                <textarea 
                    name="description" 
                    required 
                    rows={2} 
                    defaultValue={defaultDesc} // <--- PRE-FILL
                    placeholder="Meta description..." 
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm leading-relaxed focus:border-purple-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Prompt</label>
                <textarea 
                    name="prompt" 
                    required 
                    rows={4} 
                    defaultValue={defaultPrompt} // <--- PRE-FILL
                    placeholder="AI Instructions..." 
                    className="w-full p-4 border border-slate-200 rounded-lg font-mono text-sm bg-slate-50 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-50/50 outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Color Theme</label>
                  <div className="relative">
                      <select name="color" className="w-full p-3 border border-slate-200 rounded-lg bg-white appearance-none focus:border-purple-500 outline-none cursor-pointer">
                        <option value="blue">Blue</option>
                        <option value="gold">Gold</option>
                        <option value="red">Red</option>
                        <option value="green">Green</option>
                        <option value="slate">Slate</option>
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                        <ChevronLeft className="-rotate-90" size={12} />
                      </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Design Style</label>
                  <div className="relative">
                      <select name="design" className="w-full p-3 border border-slate-200 rounded-lg bg-white appearance-none focus:border-purple-500 outline-none cursor-pointer">
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="ornate">Ornate</option>
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                        <ChevronLeft className="-rotate-90" size={12} />
                      </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    Create Landing Page
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: COMPACT SIDEBAR LIST */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Recent Templates</h3>
            
            {/* List Container */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {templates.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic text-sm">No templates found.</div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {templates.map((t: any) => (
                    <li key={t.id} className="p-3 hover:bg-slate-50 transition-colors group">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-700 text-sm truncate leading-tight mb-1" title={t.title}>
                                {t.title}
                            </div>
                            <Link 
                                href={`/create/${t.slug}`} 
                                target="_blank" 
                                className="text-[10px] text-purple-500 hover:text-purple-700 flex items-center gap-1 w-fit font-mono bg-purple-50 px-1.5 py-0.5 rounded"
                            >
                                <ExternalLink size={10} /> /{t.slug}
                            </Link>
                        </div>
                        
                        {/* Delete Action */}
                        <form action={deleteSeoTemplate as any} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <input type="hidden" name="id" value={t.id} />
                            <button type="submit" className="text-slate-300 hover:text-red-500 p-1 hover:bg-red-50 rounded transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </form>
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
                  href={`/admin/seotemplate?page=${currentPage - 1}`}
                  className={`flex items-center px-3 py-1.5 rounded border bg-white text-xs font-medium ${
                    currentPage <= 1 
                      ? 'text-slate-300 border-slate-200 pointer-events-none' 
                      : 'text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <ChevronLeft size={12} className="mr-1" /> Prev
                </Link>
                
                <Link
                  href={`/admin/seotemplate?page=${currentPage + 1}`}
                  className={`flex items-center px-3 py-1.5 rounded border bg-white text-xs font-medium ${
                    currentPage >= totalPages 
                      ? 'text-slate-300 border-slate-200 pointer-events-none' 
                      : 'text-slate-600 border-slate-300 hover:bg-slate-50'
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