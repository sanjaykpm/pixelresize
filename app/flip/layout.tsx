import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flip Images Online — Free Image Flipper',
  description: 'Flip images horizontally or vertically to create mirror effects. Free, private, no upload. PNG, JPEG, WEBP supported.',
};

export default function FlipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
