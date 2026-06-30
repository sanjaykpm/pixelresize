import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToolLayoutProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function ToolLayout({
  icon: Icon,
  title,
  description,
  children,
  className,
}: ToolLayoutProps) {
  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to home
      </Link>
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-primary-foreground glow">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className={cn('', className)}>{children}</div>
    </div>
  );
}
