import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// 1. Setup a simple client (No cookies needed for public sitemaps)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE_URL = 'https://onlinecertificate.org'; // Your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 2. Define your Static Pages (The ones that always exist)
  const staticRoutes = [
    '',          // Homepage
    '/blog',     // Blog Index
    '/login',    // Login
    '/pricing',  // Pricing
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));

  // 3. Fetch Dynamic SEO Templates from DB
  const { data: templates } = await supabase
    .from('templates')
    .select('slug, created_at');

  const templateRoutes = (templates || []).map((t) => ({
    url: `${BASE_URL}/create/${t.slug}`,
    lastModified: new Date(t.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8, // Slightly lower priority than homepage
  }));

  // 4. (Optional) Fetch Blog Posts if you want them indexed too
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, created_at')
    .eq('is_published', true);

  const blogRoutes = (posts || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 5. Combine everything
  return [...staticRoutes, ...templateRoutes, ...blogRoutes];
}