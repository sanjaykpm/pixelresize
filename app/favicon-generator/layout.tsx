import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Favicon Generator — Free Online Tool',
  'Free online favicon generator tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/favicon-generator'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
