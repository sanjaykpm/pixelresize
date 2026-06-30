import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions for using PixelResize.',
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12 md:py-20">
      <h1 className="font-display text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2025</p>

      <div className="mt-8 space-y-8 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">1. Acceptance</h2>
          <p className="mt-3">
            By accessing and using PixelResize, you accept and agree to be bound by these Terms
            of Service. If you do not agree, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">2. Service Description</h2>
          <p className="mt-3">
            PixelResize provides free, browser-based image processing tools including resizing,
            compressing, cropping, rotating, flipping, converting, and watermarking images.
            All processing occurs locally in your browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">3. Acceptable Use</h2>
          <p className="mt-3">You agree to use PixelResize only for lawful purposes. You must not:</p>
          <ul className="mt-3 list-inside list-disc space-y-1">
            <li>Process images that you do not have the right to use</li>
            <li>Use the service to violate any law or regulation</li>
            <li>Attempt to disrupt or compromise the service</li>
            <li>Use automated tools to overload the service</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">4. Intellectual Property</h2>
          <p className="mt-3">
            You retain all rights to the images you process. PixelResize claims no ownership over
            your content. The PixelResize name, logo, and interface design are our intellectual property.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">5. Disclaimer</h2>
          <p className="mt-3">
            PixelResize is provided &quot;as is&quot; without warranties of any kind. We do not
            guarantee that the service will be error-free or available at all times.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
          <p className="mt-3">
            PixelResize shall not be liable for any indirect, incidental, or consequential damages
            arising from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">7. Changes</h2>
          <p className="mt-3">
            We may update these terms at any time. Continued use of the service after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">8. Contact</h2>
          <p className="mt-3">
            Questions about these terms? Contact us at legal@pixelresize.app.
          </p>
        </section>
      </div>
    </div>
  );
}
