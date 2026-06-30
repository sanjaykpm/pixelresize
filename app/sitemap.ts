import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pixelresize.app';
  const staticRoutes = [
    '',
    '/pricing',
    '/blog',
    '/faq',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const toolRoutes = TOOLS.map((t) => t.href);
  const blogRoutes = [
    '/blog/png-vs-jpeg-vs-webp',
    '/blog/how-to-compress-images-without-losing-quality',
    '/blog/image-resize-best-practices',
    '/blog/understanding-aspect-ratios',
    '/blog/why-browser-based-image-processing',
    '/blog/watermarking-images-for-copyright-protection',
  ];

  const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

  return allRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/blog/') ? 0.6 : 0.8,
  }));
}
