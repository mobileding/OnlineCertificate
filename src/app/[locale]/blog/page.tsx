import { createClient } from "@supabase/supabase-js";
import { Link } from "@/i18n/routing";
import { Calendar, ArrowRight } from "lucide-react";

// Initialize Supabase (Public Read is fine here)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata = {
  title: "OnlineCertificate.org Blog",
  description: "Tips, tutorials, and guides on certification and recognition.",
};

// Revalidate this page every 60 seconds (so new posts show up fast)
export const revalidate = 60;

export default async function BlogIndex() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Latest Articles
          </h1>
          <p className="text-slate-500 text-lg">
            Insights on digital credentials, design, and recognition.
          </p>
        </div>

        <div className="grid gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="block bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-500 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400">No articles published yet.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}