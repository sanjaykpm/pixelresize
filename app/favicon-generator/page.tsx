'use client';

import * as React from 'react';
import { Image as ImageIcon, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  loadImageFromFile,
  generateFavicon,
  formatBytes,
  downloadBlob,
  type LoadedImage,
  type ProcessedImage,
  type FaviconSize,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

const SIZES: { value: FaviconSize; label: string; desc: string }[] = [
  { value: 16, label: '16×16', desc: 'Browser tab' },
  { value: 32, label: '32×32', desc: 'Taskbar' },
  { value: 48, label: '48×48', desc: 'Desktop' },
  { value: 64, label: '64×64', desc: 'Desktop' },
  { value: 128, label: '128×128', desc: 'App icon' },
  { value: 180, label: '180×180', desc: 'Apple Touch' },
  { value: 192, label: '192×192', desc: 'Android' },
  { value: 512, label: '512×512', desc: 'PWA' },
];

export default function FaviconGeneratorPage() {
  const tool = TOOLS.find((t) => t.href === '/favicon-generator')!;
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [results, setResults] = React.useState<Record<number, ProcessedImage>>({});
  const [borderRadius, setBorderRadius] = React.useState(0);
  const [processing, setProcessing] = React.useState(false);

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setResults({});
      generateAll(img, borderRadius);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const generateAll = async (img: LoadedImage, radius: number) => {
    setProcessing(true);
    const newResults: Record<number, ProcessedImage> = {};
    for (const s of SIZES) {
      try {
        const r = await generateFavicon(img.image, s.value, 'png', 100, radius);
        newResults[s.value] = r;
      } catch {
        // skip
      }
    }
    setResults(newResults);
    setProcessing(false);
  };

  React.useEffect(() => {
    if (loaded) generateAll(loaded, borderRadius);
  }, [borderRadius]);

  return (
    <ToolLayout icon={tool.icon} title={tool.title} description={tool.description}>
      {!loaded ? (
        <Dropzone onFiles={handleFile} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{loaded.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {loaded.width}×{loaded.height} · {formatBytes(loaded.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLoaded(null);
                    setResults({});
                  }}
                >
                  Change image
                </Button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="mb-4 text-sm font-semibold">Generated favicons</h3>
              {processing ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {SIZES.map((s) => {
                    const r = results[s.value];
                    return (
                      <div key={s.value} className="rounded-xl border border-border p-4 text-center">
                        {r && (
                          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center bg-muted/30 rounded-lg">
                            <img src={r.url} alt={`${s.label}`} className="max-h-full max-w-full" />
                          </div>
                        )}
                        <p className="text-sm font-medium">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                        {r && (
                          <button
                            onClick={() => {
                              downloadBlob(r.blob, `favicon-${s.value}.png`);
                              toast.success(`Downloaded ${s.label}`);
                            }}
                            className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Border radius</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{borderRadius}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Round corners for modern app-style icons.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="mb-2 text-sm font-semibold">Tips</h3>
              <p className="text-sm text-muted-foreground">
                Use a square image for best results. PNG with transparency works best.
                Download all sizes and reference them in your HTML head.
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
