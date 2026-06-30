import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crop Images Online — Free Image Cropper',
  description: 'Crop images online with custom ratios for Instagram, YouTube, LinkedIn, Facebook, and passport photos. Free, private, no upload.',
};

export default function CropLayout({ children }: { children: React.ReactNode }) {
  return children;
}
