'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command as CommandPrimitive } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { TOOLS, NAV_LINKS } from '@/lib/site-config';

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl">
        <CommandPrimitive className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-input]]:h-12">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandPrimitive.Input
              placeholder="Search tools and pages..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandPrimitive.List className="max-h-[400px] overflow-y-auto p-1">
            <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </CommandPrimitive.Empty>
            <CommandPrimitive.Group heading="Tools">
              {TOOLS.map((tool) => (
                <CommandPrimitive.Item
                  key={tool.href}
                  onSelect={() => navigate(tool.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm aria-selected:bg-accent/10"
                >
                  <tool.icon className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">{tool.title}</div>
                    <div className="text-xs text-muted-foreground">{tool.short}</div>
                  </div>
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.Group>
            <CommandPrimitive.Group heading="Pages">
              {NAV_LINKS.map((link) => (
                <CommandPrimitive.Item
                  key={link.href}
                  onSelect={() => navigate(link.href)}
                  className="cursor-pointer rounded-md px-2 py-2 text-sm aria-selected:bg-accent/10"
                >
                  {link.label}
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.Group>
          </CommandPrimitive.List>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}
