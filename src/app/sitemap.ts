import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// 1. ADD THIS LINE:
// This tells Next.js to regenerate the sitemap at most once every hour (3600 seconds).
// This is perfect for SEO because Googlebot rarely checks more often than that.
export const revalidate = 3600;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL = 'https://onlinecertificate.org';
const LOCALES = ['en', 'es']; // <--- Define your languages

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 1. Fetch Data
  const { data: templates } = await supabase.from('templates').select('slug, created_at');
  const { data: posts } = await supabase.from('posts').select('slug, created_at').eq('is_published', true);

  // 2. Define Base Paths (Static Pages)
  const basePaths = [
    '',          // Homepage
    '/blog',     
    '/login',    
    '/pricing',  
  ];

  // 3. Helper to generate localized entries for a single path
  const generateLocalizedEntries = (path: string, date: Date, priority: number) => {
    return LOCALES.map(locale => ({
      // Generates: /en/pricing, /es/pricing, /zh/pricing
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: date,
      changeFrequency: 'weekly' as const,
      priority: priority
    }));
  };

  // 4. Build the Sitemap
  let allRoutes: MetadataRoute.Sitemap = [];

  // Static Routes
  basePaths.forEach(path => {
    allRoutes.push(...generateLocalizedEntries(path, new Date(), 1.0));
  });

  // Template Routes
  (templates || []).forEach(t => {
    allRoutes.push(...generateLocalizedEntries(`/create/${t.slug}`, new Date(t.created_at), 0.8));
  });

  // Blog Routes
  (posts || []).forEach(post => {
    allRoutes.push(...generateLocalizedEntries(`/blog/${post.slug}`, new Date(post.created_at), 0.9));
  });

  return allRoutes;
}