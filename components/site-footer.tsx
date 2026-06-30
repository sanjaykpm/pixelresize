import Link from 'next/link';
import { Image as ImageIcon, Github, Twitter } from 'lucide-react';
import { FOOTER_LINKS } from '@/lib/site-config';

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2 text-primary-foreground">
                <ImageIcon className="h-4 w-4" />
              </div>
              <span className="font-display text-lg tracking-tight">PixelResize</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Fast, secure, free image processing that runs entirely in your browser.
              No uploads, no sign-up, no quality loss.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-semibold">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PixelResize. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with privacy in mind. Your images never leave your device.
          </p>
        </div>
      </div>
    </footer>
  );
}
