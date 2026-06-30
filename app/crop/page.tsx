'use client';

import * as React from 'react';
import { Crop, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { DownloadButton } from '@/components/download-button';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  loadImageFromFile,
  cropImage,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';
import { cn } from '@/lib/utils';

type RatioKey = 'free' | '1:1' | '4:3' | '3:4' | '16:9' | '9:16' | '3:2' | '2:3';

const RATIOS: { key: RatioKey; label: string; value: number | null }[] = [
  { key: 'free', label: 'Free', value: null },
  { key: '1:1', label: 'Square 1:1', value: 1 },
  { key: '4:3', label: '4:3', value: 4 / 3 },
  { key: '3:4', label: '3:4', value: 3 / 4 },
  { key: '16:9', label: '16:9 YouTube', value: 16 / 9 },
  { key: '9:16', label: '9:16 Story', value: 9 / 16 },
  { key: '3:2', label: '3:2 Photo', value: 3 / 2 },
  { key: '2:3', label: '2:3 Portrait', value: 2 / 3 },
];

const PRESETS: { label: string; ratio: RatioKey }[] = [
  { label: 'Instagram Post', ratio: '1:1' },
  { label: 'Instagram Story', ratio: '9:16' },
  { label: 'YouTube Thumbnail', ratio: '16:9' },
  { label: 'LinkedIn Cover', ratio: '4:3' },
  { label: 'Facebook Post', ratio: '1:1' },
  { label: 'Passport (3.5:4.5)', ratio: '3:4' },
];

export default function CropPage() {
  const tool = TOOLS[2];
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [ratio, setRatio] = React.useState<RatioKey>('free');
  const [format, setFormat] = React.useState<ImageFormat>('png');
  const [quality, setQuality] = React.useState(90);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [sel, setSel] = React.useState({ x: 0, y: 0, w: 0, h: 0 });
  const [drag, setDrag] = React.useState<{ startX: number; startY: number } | null>(null);

  const ratioVal = RATIOS.find((r) => r.key === ratio)?.value ?? null;

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setResult(null);
      setSel({ x: 0, y: 0, w: img.width, h: img.height });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !loaded) return;
    const scaleX = loaded.width / rect.width;
    const scaleY = loaded.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setDrag({ startX: x, startY: y });
    setSel({ x, y, w: 0, h: 0 });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag || !loaded) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = loaded.width / rect.width;
    const scaleY = loaded.height / rect.height;
    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;
    x = Math.max(0, Math.min(x, loaded.width));
    y = Math.max(0, Math.min(y, loaded.height));
    let w = Math.abs(x - drag.startX);
    let h = Math.abs(y - drag.startY);
    const sx = Math.min(drag.startX, x);
    const sy = Math.min(drag.startY, y);

    if (ratioVal) {
      if (w / h > ratioVal) {
        w = h * ratioVal;
      } else {
        h = w / ratioVal;
      }
    }

    setSel({
      x: sx,
      y: sy,
      w: Math.max(1, Math.min(w, loaded.width - sx)),
      h: Math.max(1, Math.min(h, loaded.height - sy)),
    });
  };

  const onPointerUp = () => setDrag(null);

  const process = async () => {
    if (!loaded || sel.w < 1 || sel.h < 1) {
      toast.error('Please draw a crop area on the image.');
      return;
    }
    setProcessing(true);
    try {
      const r = await cropImage(loaded.image, {
        x: Math.round(sel.x),
        y: Math.round(sel.y),
        width: Math.round(sel.w),
        height: Math.round(sel.h),
        format,
        quality,
      });
      setResult(r);
      toast.success(`Cropped to ${r.width}×${r.height}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    if (loaded) setSel({ x: 0, y: 0, w: loaded.width, h: loaded.height });
    setResult(null);
  };

  return (
    <ToolLayout icon={tool.icon} title={tool.title} description={tool.description}>
      {!loaded ? (
        <Dropzone onFiles={handleFile} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
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
                    setResult(null);
                  }}
                >
                  Change image
                </Button>
              </div>
              <div
                ref={containerRef}
                className="relative select-none overflow-hidden rounded-xl border border-border checkerboard"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{ cursor: 'crosshair' }}
              >
                <img src={loaded.url} alt="Source" className="block w-full pointer-events-none" />
                {sel.w > 0 && sel.h > 0 && (
                  <div
                    className="absolute border-2 border-primary bg-primary/20"
                    style={{
                      left: `${(sel.x / loaded.width) * 100}%`,
                      top: `${(sel.y / loaded.height) * 100}%`,
                      width: `${(sel.w / loaded.width) * 100}%`,
                      height: `${(sel.h / loaded.height) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="border border-white/30" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Click and drag on the image to select crop area
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Aspect ratio</h3>
              <div className="grid grid-cols-4 gap-2">
                {RATIOS.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setRatio(r.key)}
                    className={cn(
                      'rounded-lg border px-2 py-2 text-xs font-medium transition-colors',
                      ratio === r.key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-accent/5'
                    )}
                  >
                    {r.label.split(' ')[0]}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <Label>Quick presets</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <Button
                      key={p.label}
                      variant={ratio === p.ratio ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRatio(p.ratio)}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Output settings</h3>
              <div className="space-y-2">
                <Label>Format</Label>
                <FormatSelector value={format} onChange={setFormat} />
              </div>
              {(format === 'jpeg' || format === 'webp' || format === 'avif') && (
                <QualitySlider value={quality} onChange={setQuality} />
              )}
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Crop area: </span>
              <span className="font-medium tabular-nums">
                {Math.round(sel.w)}×{Math.round(sel.h)} px
              </span>
            </div>

            <div className="flex gap-3">
              <Button onClick={process} disabled={processing} size="lg" className="flex-1">
                <Crop className="mr-2 h-4 w-4" />
                {processing ? 'Cropping...' : 'Crop Image'}
              </Button>
              <Button onClick={reset} variant="outline" size="lg">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <p className="mb-3 text-sm font-semibold">
                  Result: {result.width}×{result.height} · {formatBytes(result.size)}
                </p>
                <div className="mb-3 overflow-hidden rounded-xl border border-border checkerboard">
                  <img src={result.url} alt="Cropped" className="block w-full" />
                </div>
                <DownloadButton result={result} filename={loaded.name} className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
