import type { Metadata } from 'next';
import { Lock, Zap, Shield, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about PixelResize — our mission, values, and the team behind the tools.',
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-20">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          About PixelResize
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We believe image processing should be fast, private, and free for everyone.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2 className="font-display text-2xl font-bold">Our mission</h2>
        <p className="mt-4 text-muted-foreground">
          PixelResize was built on a simple idea: image editing tools should not require
          uploading your personal photos to a stranger&apos;s server. Every tool on this site
          runs entirely in your browser using the HTML Canvas API. Your images never leave
          your device, which means complete privacy and zero upload time.
        </p>

        <h2 className="mt-12 font-display text-2xl font-bold">What we value</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="glass-card rounded-2xl p-6">
            <Lock className="mb-3 h-8 w-8 text-primary" />
            <h3 className="font-semibold">Privacy first</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your images are processed locally. We do not have servers that receive or store them.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <Zap className="mb-3 h-8 w-8 text-warning" />
            <h3 className="font-semibold">Speed</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No upload means no waiting. Processing happens in milliseconds.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <Shield className="mb-3 h-8 w-8 text-success" />
            <h3 className="font-semibold">Quality</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              High-quality resampling algorithms preserve your image quality.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <Heart className="mb-3 h-8 w-8 text-rose-500" />
            <h3 className="font-semibold">Free forever</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Core tools are and always will be free. No watermarks, no sign-up, no limits.
            </p>
          </div>
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold">How it works</h2>
        <p className="mt-4 text-muted-foreground">
          PixelResize uses the browser&apos;s native Canvas API to manipulate images.
          When you upload an image, it is loaded into memory and drawn onto a canvas element.
          We then apply transformations — resize, crop, rotate, compress — directly on the
          canvas pixels, and export the result in your chosen format. Nothing is sent over
          the network.
        </p>

        <h2 className="mt-12 font-display text-2xl font-bold">Get in touch</h2>
        <p className="mt-4 text-muted-foreground">
          Have a feature request or found a bug? We would love to hear from you.
          Visit our <a href="/contact" className="text-primary hover:underline">contact page</a> to send us a message.
        </p>
      </div>
    </div>
  );
}
