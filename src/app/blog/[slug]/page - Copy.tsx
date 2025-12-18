import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic SEO
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data: post } = await supabase.from("posts").select("title, excerpt, cover_image").eq("slug", slug).single();
  
  if (!post) return { title: "Article Not Found" };
  
  return {
    title: post.title,
    description: post.excerpt,
    // Optional: Add OpenGraph image so the picture shows up when shared on Twitter/Facebook
    openGraph: {
      images: post.cover_image ? [post.cover_image] : [],
    }
  };
}

// 2. The Article Page
export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      
      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-4">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
             <Calendar size={16} />
             {new Date(post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </div>
        </div>
      </div>

      {/* NEW: Cover Image Section */}
      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-2xl shadow-xl border-4 border-white bg-slate-100"
          />
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="prose prose-lg prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 mx-auto">
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

    </main>
  );
}