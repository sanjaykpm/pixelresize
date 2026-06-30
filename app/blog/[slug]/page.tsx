import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog-data';
import { toolMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Article Not Found' };
  return toolMetadata(post.title, post.excerpt, `/blog/${post.slug}`);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
  ).slice(0, 3);

  const shareUrl = `https://pixelresize.app/blog/${post.slug}`;

  return (
    <div className="container max-w-3xl py-12 md:py-16">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant="secondary">{post.category}</Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-xs text-muted-foreground">· {post.readTime} read</span>
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

      <div className="mt-6 flex items-center justify-between border-y border-border py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 text-sm font-semibold text-primary-foreground">
            {post.author.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold">{post.author}</div>
            <div className="text-xs text-muted-foreground">{post.authorBio}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent/5"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent/5"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent/5"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-8 space-y-6 leading-relaxed">
        {post.content.map((para, i) => (
          <p key={i} className="text-foreground/90">{para}</p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Related articles</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group glass-card flex flex-col rounded-2xl p-5 transition-all hover:-translate-y-1"
              >
                <Badge variant="secondary" className="mb-2 w-fit">{r.category}</Badge>
                <h3 className="font-display text-base font-semibold leading-snug group-hover:text-primary">
                  {r.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{r.readTime} read</p>
              </Link>
            ))}
          </div>
        </div>
      )}

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
