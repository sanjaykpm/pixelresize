import type { Metadata } from 'next';
import { toolMetadata } from '@/lib/seo';

export const metadata: Metadata = toolMetadata(
  'Color Picker — Free Online Tool',
  'Free online color picker tool. Process images in your browser with no uploads, no sign-up, and no quality loss.',
  '/color-picker'
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
