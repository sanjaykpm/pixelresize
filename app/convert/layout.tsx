import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Images Online — Free Image Converter',
  description: 'Convert images between PNG, JPEG, WEBP, AVIF, BMP, GIF, and ICO formats. Preserve transparency where supported. Free, private, no upload.',
};

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return children;
}
