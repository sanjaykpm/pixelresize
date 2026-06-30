import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resize Images Online — Free Image Resizer',
  description: 'Resize images online instantly. Change dimensions or scale by percentage while maintaining aspect ratio. PNG, JPEG, WEBP, AVIF supported. Free, private, no upload.',
};

export default function ResizeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
