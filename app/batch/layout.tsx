import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Batch Process Images — Free Batch Image Editor',
  description: 'Resize, compress, or convert multiple images at once. Batch process up to 50 images and download as a ZIP. Free, private, no upload.',
};

export default function BatchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
