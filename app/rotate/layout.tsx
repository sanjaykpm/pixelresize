import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotate Images Online — Free Image Rotator',
  description: 'Rotate images by 90, 180, 270 degrees or a custom angle. Free, private, no upload. PNG, JPEG, WEBP supported.',
};

export default function RotateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
