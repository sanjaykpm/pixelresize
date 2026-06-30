import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Upscaler — Free Online Tool',
  'Free online upscaler tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/upscaler'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
