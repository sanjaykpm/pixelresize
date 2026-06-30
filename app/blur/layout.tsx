import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Blur — Free Online Tool',
  'Free online blur tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/blur'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
