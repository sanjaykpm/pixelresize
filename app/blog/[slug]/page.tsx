import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Blog Post',
  description: 'Image processing tips and tutorials from PixelResize.',
};

const POSTS: Record<string, { title: string; excerpt: string; date: string; readTime: string; category: string; content: string[] }> = {
  'png-vs-jpeg-vs-webp': {
    title: 'PNG vs JPEG vs WEBP: Which Format Should You Use?',
    excerpt: 'A practical guide to choosing the right image format for your needs.',
    date: '2025-01-15',
    readTime: '8 min',
    category: 'Guides',
    content: [
      'Choosing the right image format can dramatically affect your website performance, file sizes, and visual quality. In this guide, we break down the three most popular formats and when to use each.',
      'PNG (Portable Network Graphics) is a lossless format that supports transparency. It is ideal for logos, icons, screenshots, and any image with sharp edges or text. The downside is larger file sizes compared to compressed formats.',
      'JPEG (Joint Photographic Experts Group) is a lossy format best suited for photographs and complex images with many colors. It does not support transparency, but achieves much smaller file sizes than PNG.',
      'WEBP is a modern format developed by Google that supports both lossy and lossless compression, plus transparency. It typically produces files 25-35% smaller than equivalent JPEGs or PNGs. It is now supported by all modern browsers.',
      'As a general rule: use PNG for graphics with transparency, JPEG for photographs, and WEBP when you want the best of both worlds with smaller file sizes.',
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];
  if (!post) notFound();

  return (
    <div className="container max-w-3xl py-12 md:py-16">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <Badge variant="secondary">{post.category}</Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-xs text-muted-foreground">· {post.readTime} read</span>
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
      <div className="mt-8 space-y-6 leading-relaxed">
        {post.content.map((para, i) => (
          <p key={i} className="text-foreground/90">{para}</p>
        ))}
      </div>
      <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary to-chart-2 p-8 text-center text-primary-foreground">
        <h2 className="font-display text-xl font-bold">Try it yourself</h2>
        <p className="mt-2 text-primary-foreground/80">Process your images for free, right in your browser.</p>
        <Button asChild variant="secondary" className="mt-4">
          <Link href="/convert">Convert an Image</Link>
        </Button>
      </div>
    </div>
  );
}
