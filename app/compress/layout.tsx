import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress Images Online — Free Image Compressor',
  description: 'Compress images online with lossless or lossy compression. Reduce file size with a quality slider. PNG, JPEG, WEBP supported. Free, private, no upload.',
};

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
