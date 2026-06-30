import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Sharpen — Free Online Tool',
  'Free online sharpen tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/sharpen'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
