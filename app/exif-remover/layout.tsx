import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Exif Remover — Free Online Tool',
  'Free online exif remover tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/exif-remover'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
