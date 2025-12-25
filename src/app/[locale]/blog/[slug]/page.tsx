import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Ensure you have this installed

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  // 1. GET CURRENT USER (To check if Admin)
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // 2. FETCH POST
  // We do NOT filter by is_published=true here. 
  // We let RLS handle it, or we handle it manually below.
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  // 3. HANDLE 404
  if (!post) {
    notFound();
  }

  // 4. SECURITY CHECK: If Draft + Not Admin -> 404
  if (!post.is_published && !isAdmin) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* DRAFT BANNER (Only visible to Admin) */}
      {!post.is_published && (
        <div className="bg-yellow-100 border-b border-yellow-200 text-yellow-800 text-center py-2 text-xs font-bold uppercase tracking-wider sticky top-0 z-50">
          🚧 Preview Mode: You are viewing an unpublished draft
        </div>
      )}

      {/* COVER IMAGE */}
      {post.cover_image && (
        <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden bg-slate-100">
           <img 
             src={post.cover_image} 
             alt={post.title} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-10 pb-20">
        <Link href="/blog" className="inline-flex items-center text-white/90 hover:text-white mb-6 text-sm font-medium transition-colors">
           <ArrowLeft size={16} className="mr-2" /> Back to Blog
        </Link>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-100">
           {/* META */}
           <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              <span className="flex items-center gap-1">
                 <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1">
                 <User size={12} /> Admin
              </span>
           </div>

           {/* TITLE */}
           <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
             {post.title}
           </h1>

           {/* CONTENT (Markdown) */}
           <article className="prose prose-slate prose-lg max-w-none">
             {/* If you don't have react-markdown, just use simple whitespace handling for now */}
             <ReactMarkdown 
                components={{
                    // Optional: Custom styling for markdown elements
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-slate-600 leading-relaxed" {...props} />,
                    li: ({node, ...props}) => <li className="ml-4 list-disc text-slate-600 mb-2" {...props} />,
                }}
             >
                {post.content}
             </ReactMarkdown>
           </article>
        </div>
      </div>
    </main>
  );
}