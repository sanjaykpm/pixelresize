'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Search, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blog-data';
import { cn } from '@/lib/utils';

export default function BlogPage() {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('All');

  const filtered = BLOG_POSTS.filter((post) => {
    const matchesCategory = category === 'All' || post.category === category;
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featured = BLOG_POSTS.find((p) => p.featured);

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

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group glass-card mb-8 flex flex-col overflow-hidden rounded-2xl md:flex-row"
        >
          <div className="aspect-video bg-gradient-to-br from-primary/30 to-chart-2/30 md:w-1/2" />
          <div className="flex flex-1 flex-col justify-center p-8">
            <Badge className="mb-3 w-fit" variant="secondary">Featured</Badge>
            <h2 className="font-display text-2xl font-bold leading-snug group-hover:text-primary">
              {featured.title}
            </h2>
            <p className="mt-2 text-muted-foreground">{featured.excerpt}</p>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{featured.author}</span>
              <span>·</span>
              <span>{featured.readTime} read</span>
            </div>
          </div>
        </Link>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent/10'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No articles found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
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
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{post.readTime} read</span>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary to-chart-2 p-8 text-center text-primary-foreground">
        <h2 className="font-display text-2xl font-bold">Subscribe to our newsletter</h2>
        <p className="mt-2 text-primary-foreground/80">Get the latest image processing tips delivered to your inbox.</p>
        <div className="mx-auto mt-6 flex max-w-md gap-2">
          <Input placeholder="you@example.com" className="bg-background/90 text-foreground" />
          <Button variant="secondary">Subscribe</Button>
        </div>
      </div>
    </div>
  );
}
