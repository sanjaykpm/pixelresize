import Link from 'next/link';
import { Home, ArrowLeft, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <ImageOff className="h-10 w-10" />
      </div>
      <h1 className="font-display text-6xl font-bold tracking-tight md:text-8xl gradient-text">
        404
      </h1>
      <h2 className="mt-4 font-display text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you are looking for does not exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/resize">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Resize an Image
          </Link>
        </Button>
      </div>
    </div>
  );
}
