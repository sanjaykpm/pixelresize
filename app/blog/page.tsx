import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Image processing tips, tutorials, and guides from the PixelResize team.',
};

const POSTS = [
  {
    slug: 'png-vs-jpeg-vs-webp',
    title: 'PNG vs JPEG vs WEBP: Which Format Should You Use?',
    excerpt: 'A practical guide to choosing the right image format for your needs, with real-world examples and file size comparisons.',
    date: '2025-01-15',
    readTime: '8 min',
    category: 'Guides',
  },
  {
    slug: 'how-to-compress-images-without-losing-quality',
    title: 'How to Compress Images Without Losing Quality',
    excerpt: 'Learn the techniques behind lossless and lossy compression, and how to find the perfect balance between file size and quality.',
    date: '2025-01-10',
    readTime: '6 min',
    category: 'Tutorials',
  },
  {
    slug: 'image-resize-best-practices',
    title: 'Image Resize Best Practices for the Web',
    excerpt: 'Optimize your images for the web with these resizing best practices that improve load times and Core Web Vitals.',
    date: '2025-01-05',
    readTime: '5 min',
    category: 'Web Performance',
  },
  {
    slug: 'understanding-aspect-ratios',
    title: 'Understanding Aspect Ratios for Social Media',
    excerpt: 'A complete reference for the correct aspect ratios across Instagram, YouTube, LinkedIn, Facebook, and more.',
    date: '2024-12-28',
    readTime: '7 min',
    category: 'Guides',
  },
  {
    slug: 'why-browser-based-image-processing',
    title: 'Why Browser-Based Image Processing Is the Future',
    excerpt: 'Discover the privacy, speed, and cost benefits of processing images locally in the browser versus server-side.',
    date: '2024-12-20',
    readTime: '4 min',
    category: 'Technology',
  },
  {
    slug: 'watermarking-images-for-copyright-protection',
    title: 'Watermarking Images for Copyright Protection',
    excerpt: 'How to add effective watermarks to your images to protect your intellectual property online.',
    date: '2024-12-15',
    readTime: '5 min',
    category: 'Tutorials',
  },
];

export default function BlogPage() {
  return (
    <div className="container max-w-6xl py-12 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            PixelResize Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tips, tutorials, and guides on image processing and optimization.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group glass-card flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-chart-2/20" />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="mb-2 font-display text-lg font-semibold leading-snug group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{post.readTime} read</span>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          ))}
        </div>
    </div>
  );
}
