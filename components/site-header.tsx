'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun, Image as ImageIcon, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { TOOLS, NAV_LINKS } from '@/lib/site-config';

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2 text-primary-foreground glow">
              <ImageIcon className="h-4 w-4" />
            </div>
            <span className="font-display text-lg tracking-tight">PixelResize</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isActive(link.href) && 'text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="group relative">
              <button className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Tools
              </button>
              <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="glass-card w-64 rounded-xl p-2">
                  {TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent/10"
                    >
                      <tool.icon className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{tool.title}</div>
                        <div className="text-xs text-muted-foreground">{tool.short}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
              window.dispatchEvent(event);
            }}
            className="hidden items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/10 md:flex"
          >
            <Command className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/resize">Get Started</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetTitle className="mb-4 text-lg font-bold">Navigation</SheetTitle>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                      isActive(link.href) && 'bg-accent/10 text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tools
                </div>
                {TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <tool.icon className="h-4 w-4 text-primary" />
                    {tool.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
