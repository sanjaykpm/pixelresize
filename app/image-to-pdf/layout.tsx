import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Image To Pdf — Free Online Tool',
  'Free online image to pdf tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/image-to-pdf'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
