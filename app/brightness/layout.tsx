import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Brightness — Free Online Tool',
  'Free online brightness tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/brightness'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
