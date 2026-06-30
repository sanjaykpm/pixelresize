import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';
import { CommandPalette } from '@/components/command-palette';

export const metadata: Metadata = {
  title: {
    default: 'PixelResize — Resize Images Online Instantly & Free',
    template: '%s | PixelResize',
  },
  description:
    'Fast, secure, free image resizing and editing in your browser. Resize, compress, crop, rotate, flip, convert, and watermark images without losing quality.',
  keywords: [
    'image resizer',
    'compress image',
    'crop image',
    'image converter',
    'resize png',
    'resize jpg',
    'webp converter',
    'online image editor',
  ],
  authors: [{ name: 'PixelResize' }],
  creator: 'PixelResize',
  metadataBase: new URL('https://pixelresize.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pixelresize.app',
    title: 'PixelResize — Resize Images Online Instantly & Free',
    description:
      'Fast, secure, free image resizing and editing in your browser. No uploads, no sign-up, no quality loss.',
    siteName: 'PixelResize',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PixelResize — Resize Images Online Instantly',
    description:
      'Fast, secure, free image resizing and editing in your browser.',
    creator: '@pixelresize',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1c' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <CommandPalette />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
