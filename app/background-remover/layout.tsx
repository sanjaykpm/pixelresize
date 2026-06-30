import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Background Remover — Free Online Tool',
  'Free online background remover tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/background-remover'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
