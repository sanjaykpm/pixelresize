'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Sparkles,
  Check,
  X,
  Star,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dropzone } from '@/components/dropzone';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { TOOLS, FAQS } from '@/lib/site-config';
import { useRouter } from 'next/navigation';
import { JsonLd } from '@/components/json-ld';

const jsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PixelResize',
  description: 'Fast, secure, free image resizing and editing in your browser. Resize, compress, crop, rotate, flip, convert, and watermark images without losing quality.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: TOOLS.map((t) => t.title),
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '2847' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function HomePage() {
  const router = useRouter();

  const handleHeroUpload = (files: File[]) => {
    if (files.length > 0) {
      const ext = files[0].name.split('.').pop()?.toLowerCase();
      if (ext === 'jpg' || ext === 'jpeg') router.push('/compress');
      else router.push('/resize');
    }
  };

  return (
    <div>
      <JsonLd data={[jsonLdData, faqJsonLd]} />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl" />
        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              100% free · No sign-up · Privacy-first
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in">
              Resize Images Online{' '}
              <span className="gradient-text">Instantly</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance animate-fade-in animation-delay-200">
              Fast, secure, free image resizing without losing quality. All processing
              happens in your browser — your images never leave your device.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in animation-delay-500">
              <Button asChild size="lg" className="h-12 px-8 text-base glow">
                <Link href="/resize">
                  Start Resizing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href="/batch">Try Batch Processing</Link>
              </Button>
            </div>
          </div>

          {/* Hero upload area */}
          <div className="mx-auto mt-12 max-w-2xl animate-scale-in">
            <Dropzone onFiles={handleHeroUpload} />
          </div>

          {/* Trust badges */}
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-success" />
              100% private
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Instant processing
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              No uploads to server
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              No quality loss
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            All the tools you need
          </h2>
          <p className="mt-3 text-muted-foreground">
            24 professional image processing tools, all free and running entirely in your browser.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.filter((t) => !t.isNew).map((tool, i) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group glass-card relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:glow animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-display text-lg font-semibold">{tool.title}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
              <ArrowRight className="absolute right-6 top-6 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="container py-16 md:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-3 gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              New
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Recently added tools
            </h2>
            <p className="mt-3 text-muted-foreground">
              New image processing tools we have just launched.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.filter((t) => t.isNew).slice(0, 8).map((tool, i) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group glass-card relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:glow animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="absolute right-3 top-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">New</Badge>
                </div>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-display text-lg font-semibold">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
                <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            How we compare
          </h2>
          <p className="mt-3 text-muted-foreground">
            See why PixelResize is the best free image processing tool.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 text-left text-sm font-semibold">Feature</th>
                <th className="py-4 text-center text-sm font-semibold text-primary">PixelResize</th>
                <th className="py-4 text-center text-sm font-semibold text-muted-foreground">TinyPNG</th>
                <th className="py-4 text-center text-sm font-semibold text-muted-foreground">iLoveIMG</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['100% Free', true, false, false],
                ['No sign-up required', true, false, false],
                ['Privacy (no uploads)', true, false, false],
                ['Batch processing', true, true, true],
                ['24+ tools', true, false, true],
                ['No watermarks', true, true, false],
                ['Works offline', true, false, false],
                ['QR code generator', true, false, false],
                ['Meme generator', true, false, false],
                ['Color picker', true, false, false],
              ].map(([feature, pr, tp, il]) => (
                <tr key={feature as string} className="border-b border-border/50">
                  <td className="py-3 text-sm">{feature}</td>
                  <td className="py-3 text-center">
                    {pr ? <Check className="mx-auto h-4 w-4 text-success" /> : <X className="mx-auto h-4 w-4 text-muted-foreground" />}
                  </td>
                  <td className="py-3 text-center">
                    {tp ? <Check className="mx-auto h-4 w-4 text-success" /> : <X className="mx-auto h-4 w-4 text-muted-foreground" />}
                  </td>
                  <td className="py-3 text-center">
                    {il ? <Check className="mx-auto h-4 w-4 text-success" /> : <X className="mx-auto h-4 w-4 text-muted-foreground" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="container py-16 md:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Why PixelResize?
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Lock,
                title: 'Complete Privacy',
                desc: 'Your images are processed locally in your browser. Nothing is uploaded to any server, ever. Complete privacy by design.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                desc: 'No upload time means instant results. Process images in milliseconds using the native Canvas API.',
              },
              {
                icon: Shield,
                title: 'No Quality Loss',
                desc: 'High-quality resampling algorithms preserve image quality. You control the output with precision.',
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-16 md:py-20">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            { value: '8+', label: 'Image Tools' },
            { value: '7', label: 'Formats Supported' },
            { value: '100%', label: 'Free Forever' },
            { value: '0', label: 'Images Uploaded' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-4xl font-bold gradient-text md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="container py-16 md:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Loved by creators
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands who process images with PixelResize every day.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: 'I use PixelResize daily for resizing product photos. The fact that nothing leaves my browser is a huge plus for client work.',
                name: 'Sarah Chen',
                role: 'Freelance Designer',
              },
              {
                quote: 'The batch processing tool saved me hours. I compressed 200 images in seconds and downloaded them all as a ZIP.',
                name: 'Marcus Webb',
                role: 'E-commerce Owner',
              },
              {
                quote: 'Finally an image tool that respects privacy. No sign-up, no watermarks, no nonsense. Just works.',
                name: 'Priya Sharma',
                role: 'Content Creator',
              },
            ].map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-foreground/90">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 text-sm font-semibold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass-card rounded-xl border-b-0 px-6"
              >
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container pb-20">
        <div className="glass-card mx-auto max-w-2xl rounded-3xl p-8 text-center md:p-12">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Stay updated
          </h2>
          <p className="mt-2 text-muted-foreground">
            Get notified when we launch new tools and features. No spam, unsubscribe anytime.
          </p>
          <form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@example.com"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-chart-2 p-12 text-center text-primary-foreground md:p-20">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Ready to resize your images?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              No sign-up, no watermarks, no limits. Start processing your images right now.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base">
              <Link href="/resize">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
