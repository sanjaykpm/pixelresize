import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Grayscale — Free Online Tool',
  'Free online grayscale tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/grayscale'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
