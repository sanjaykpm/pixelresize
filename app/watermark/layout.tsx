import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watermark Images Online — Free Image Watermarker',
  description: 'Add text watermarks to images with custom opacity, rotation, position, and scale. Protect your images with watermarks. Free, private, no upload.',
};

export default function WatermarkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
