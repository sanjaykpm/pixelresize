import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Passport Photo — Free Online Tool',
  'Free online passport photo tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/passport-photo'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
