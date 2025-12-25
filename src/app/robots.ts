import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/'], // Don't index admin or private dashboard
    },
    sitemap: 'https://onlinecertificate.org/sitemap.xml', // <--- TELL BOTS HERE
  };
}