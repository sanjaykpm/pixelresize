import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Saturation — Free Online Tool',
  'Free online saturation tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/saturation'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
