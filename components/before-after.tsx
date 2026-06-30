'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type BeforeAfterProps = {
  before: string;
  after: string;
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export function BeforeAfter({
  before,
  after,
  className,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterProps) {
  const [pos, setPos] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const update = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, x)));
  };

  React.useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      update(clientX);
    };
    const stop = () => (dragging.current = false);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none overflow-hidden rounded-xl border border-border checkerboard',
        className
      )}
    >
      <img src={after} alt={afterLabel} className="block w-full" draggable={false} />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={before}
          alt={beforeLabel}
          className="block h-full w-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
          draggable={false}
        />
        <span className="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur">
          {beforeLabel}
        </span>
      </div>
      <span className="absolute right-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur">
        {afterLabel}
      </span>
      <div
        className="absolute inset-y-0 z-10 w-1 cursor-ew-resize bg-primary"
        style={{ left: `calc(${pos}% - 2px)` }}
        onMouseDown={() => (dragging.current = true)}
        onTouchStart={() => (dragging.current = true)}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-background shadow-lg">
          <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 7l-4 5 4 5M16 7l4 5-4 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
