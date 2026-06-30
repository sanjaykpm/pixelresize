import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://pixelresize.app';
  const routes = [
    '',
    '/resize',
    '/compress',
    '/crop',
    '/rotate',
    '/flip',
    '/convert',
    '/watermark',
    '/batch',
    '/pricing',
    '/blog',
    '/faq',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
