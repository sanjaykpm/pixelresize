import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Contrast — Free Online Tool',
  'Free online contrast tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/contrast'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
