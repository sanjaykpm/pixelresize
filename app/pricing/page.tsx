import type { Metadata } from 'next';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'PixelResize is free forever. See what is included and what is coming soon.',
};

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to process images.',
    features: [
      'All 8 image tools',
      'Unlimited processing',
      'Batch processing (up to 50)',
      'All output formats',
      'No watermarks',
      'No sign-up required',
    ],
    cta: 'Start Free',
    href: '/resize',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: 'per month',
    description: 'For power users and professionals.',
    features: [
      'Everything in Free',
      'Batch processing (up to 500)',
      'API access',
      'Priority processing',
      'Custom presets',
      'Email support',
    ],
    cta: 'Coming Soon',
    href: '#',
    highlighted: false,
    badge: 'Coming Soon',
  },
  {
    name: 'Team',
    price: '$19.99',
    period: 'per month',
    description: 'For teams and businesses.',
    features: [
      'Everything in Pro',
      'Unlimited batch processing',
      'Team workspace',
      'Shared presets',
      'Usage analytics',
      'Priority support',
    ],
    cta: 'Coming Soon',
    href: '#',
    highlighted: false,
    badge: 'Coming Soon',
  },
];

export default function PricingPage() {
  return (
    <div className="container max-w-6xl py-12 md:py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Simple, honest pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          PixelResize is free forever. Paid plans add power features for professionals and teams.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'glass-card relative rounded-2xl p-8',
              plan.highlighted && 'gradient-border glow'
            )}
          >
            {plan.badge && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                {plan.badge}
              </Badge>
            )}
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-chart-2">
                Most Popular
              </Badge>
            )}
            <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{plan.price}</span>
              <span className="text-sm text-muted-foreground">/{plan.period}</span>
            </div>
            <Button
              asChild
              className="mt-6 w-full"
              variant={plan.highlighted ? 'default' : 'outline'}
              disabled={plan.badge === 'Coming Soon'}
            >
              <a href={plan.href}>{plan.cta}</a>
            </Button>
            <ul className="mt-8 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-border bg-muted/30 p-8 text-center">
        <h2 className="font-display text-xl font-semibold">Frequently asked pricing questions</h2>
        <div className="mt-6 space-y-4 text-left">
          <div>
            <p className="font-medium">Is the free plan really free?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Yes. All core tools are free forever with no limits, no watermarks, and no sign-up.
            </p>
          </div>
          <div>
            <p className="font-medium">When will paid plans be available?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pro and Team plans are coming soon. They will add API access, larger batch limits, and team features.
            </p>
          </div>
          <div>
            <p className="font-medium">Can I cancel anytime?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Yes. Paid plans are month-to-month with no long-term commitment. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
