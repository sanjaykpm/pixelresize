import type { Metadata } from 'next';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { FAQS } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about PixelResize image processing tools.',
};

export default function FAQPage() {
  return (
    <div className="container max-w-3xl py-12 md:py-20">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to know about PixelResize.
        </p>
      </div>
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
  );
}
