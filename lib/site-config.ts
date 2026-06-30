import {
  Maximize2,
  Minimize2,
  Crop,
  RotateCw,
  FlipHorizontal2,
  Repeat2,
  Stamp,
  Layers,
  type LucideIcon,
} from 'lucide-react';

export type Tool = {
  href: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

export const TOOLS: Tool[] = [
  {
    href: '/resize',
    title: 'Resize',
    short: 'Change dimensions',
    description: 'Resize images to exact dimensions or by percentage while maintaining aspect ratio.',
    icon: Maximize2,
    color: 'from-sky-500 to-blue-600',
  },
  {
    href: '/compress',
    title: 'Compress',
    short: 'Reduce file size',
    description: 'Shrink image file size with lossless or lossy compression and a quality slider.',
    icon: Minimize2,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    href: '/crop',
    title: 'Crop',
    short: 'Trim & frame',
    description: 'Crop images to custom ratios for Instagram, YouTube, LinkedIn, passports, and more.',
    icon: Crop,
    color: 'from-amber-500 to-orange-600',
  },
  {
    href: '/rotate',
    title: 'Rotate',
    short: 'Spin & straighten',
    description: 'Rotate images by 90°, 180°, 270°, or a custom angle with live preview.',
    icon: RotateCw,
    color: 'from-violet-500 to-purple-600',
  },
  {
    href: '/flip',
    title: 'Flip',
    short: 'Mirror images',
    description: 'Flip images horizontally or vertically to create perfect mirror effects.',
    icon: FlipHorizontal2,
    color: 'from-rose-500 to-pink-600',
  },
  {
    href: '/convert',
    title: 'Converter',
    short: 'Change format',
    description: 'Convert between PNG, JPEG, WEBP, AVIF, BMP, GIF, and ICO with transparency support.',
    icon: Repeat2,
    color: 'from-cyan-500 to-sky-600',
  },
  {
    href: '/watermark',
    title: 'Watermark',
    short: 'Protect images',
    description: 'Add text or image watermarks with custom opacity, rotation, position, and scale.',
    icon: Stamp,
    color: 'from-indigo-500 to-blue-600',
  },
  {
    href: '/batch',
    title: 'Batch Process',
    short: 'Process many at once',
    description: 'Resize, compress, or convert multiple images at once and download as a ZIP.',
    icon: Layers,
    color: 'from-fuchsia-500 to-purple-600',
  },
];

export const NAV_LINKS = [
  { href: '/resize', label: 'Resize' },
  { href: '/compress', label: 'Compress' },
  { href: '/crop', label: 'Crop' },
  { href: '/convert', label: 'Convert' },
  { href: '/batch', label: 'Batch' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
];

export const FOOTER_LINKS = {
  Tools: [
    { href: '/resize', label: 'Resize Images' },
    { href: '/compress', label: 'Compress Images' },
    { href: '/crop', label: 'Crop Images' },
    { href: '/rotate', label: 'Rotate Images' },
    { href: '/flip', label: 'Flip Images' },
    { href: '/convert', label: 'Convert Images' },
    { href: '/watermark', label: 'Watermark Images' },
    { href: '/batch', label: 'Batch Processing' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
    { href: '/pricing', label: 'Pricing' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export const FAQS = [
  {
    q: 'Is PixelResize really free?',
    a: 'Yes. All core image tools — resize, compress, crop, rotate, flip, convert, and watermark — are completely free with no watermarks, no sign-up, and no limits on the number of images you process.',
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. All image processing happens entirely in your browser using the HTML Canvas API. Your images never leave your device, which means complete privacy and zero upload time.',
  },
  {
    q: 'What image formats are supported?',
    a: 'PixelResize supports PNG, JPEG, WEBP, AVIF, BMP, GIF, and ICO for conversion. For editing, any format your browser can render (including SVG) works as input.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'Since processing is local, the limit depends on your device memory. Most modern browsers handle images up to 50–100 MB without issue.',
  },
  {
    q: 'Can I process multiple images at once?',
    a: 'Yes. The Batch Processing tool lets you upload multiple images and resize, compress, or convert them all at once, then download the results as a single ZIP file.',
  },
  {
    q: 'Does PixelResize work on mobile?',
    a: 'Absolutely. The entire interface is mobile-first and responsive. You can resize, compress, and edit images on any phone or tablet with a modern browser.',
  },
  {
    q: 'Will I lose image quality?',
    a: 'PixelResize uses high-quality resampling algorithms. For lossless formats like PNG, quality is preserved. For JPEG and WEBP, you control the quality with a slider.',
  },
  {
    q: 'Do you store my processing history?',
    a: 'No. Because everything runs in your browser, we do not store any of your images or processing history. Closing the tab clears everything.',
  },
];
