import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Metadata — Free Online Tool',
  'Free online metadata tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/metadata'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
