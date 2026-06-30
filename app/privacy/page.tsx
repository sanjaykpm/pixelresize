import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PixelResize handles your data and protects your privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12 md:py-20">
      <h1 className="font-display text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2025</p>

      <div className="mt-8 space-y-8 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">1. Overview</h2>
          <p className="mt-3">
            PixelResize is committed to your privacy. Our image processing tools run entirely
            in your browser. We do not upload, store, or transmit your images to any server.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">2. Image Data</h2>
          <p className="mt-3">
            All image processing — resizing, compressing, cropping, rotating, converting, and
            watermarking — happens locally on your device using the browser&apos;s Canvas API.
            Your images never leave your browser. We have no access to your image data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">3. Analytics</h2>
          <p className="mt-3">
            We may use privacy-friendly analytics to understand how the site is used and improve
            our tools. We do not use tracking cookies or sell any data to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">4. Contact Form</h2>
          <p className="mt-3">
            If you contact us through our contact form, we use the information you provide solely
            to respond to your inquiry. We do not add you to any mailing list without consent.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">5. Cookies</h2>
          <p className="mt-3">
            PixelResize uses a single cookie to remember your theme preference (light or dark mode).
            No tracking or advertising cookies are used.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">6. Changes</h2>
          <p className="mt-3">
            We may update this policy from time to time. Any changes will be posted on this page
            with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">7. Contact</h2>
          <p className="mt-3">
            If you have questions about this privacy policy, please contact us at
            privacy@pixelresize.app.
          </p>
        </section>
      </div>
    </div>
  );
}
