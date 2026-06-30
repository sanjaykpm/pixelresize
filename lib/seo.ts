import type { Metadata } from 'next';

export function toolMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `https://pixelresize.app${path}`,
    },
    openGraph: {
      title: `${title} | PixelResize`,
      description,
      url: `https://pixelresize.app${path}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | PixelResize`,
      description,
    },
  };
}
