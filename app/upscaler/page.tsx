'use client';

import * as React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { DownloadButton } from '@/components/download-button';
import { BeforeAfter } from '@/components/before-after';
import { ImageInfoPanel } from '@/components/image-info-panel';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  loadImageFromFile,
  resizeImage,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function UpscalerPage() {
  const tool = TOOLS.find((t) => t.href === '/upscaler')!;
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [scale, setScale] = React.useState(2);
  const [format, setFormat] = React.useState<ImageFormat>('png');

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setResult(null);
      if (img.type === 'image/jpeg') setFormat('jpeg');
      else if (img.type === 'image/webp') setFormat('webp');
      else setFormat('png');
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const process = async () => {
    if (!loaded) return;
    setProcessing(true);
    try {
      const r = await resizeImage(loaded.image, {
        width: loaded.width * scale,
        height: loaded.height * scale,
        maintainAspect: true,
        format,
        quality: 95,
        removeMetadata: false,
      });
      setResult(r);
      toast.success(`Upscaled to ${r.width}×${r.height}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessing(false);
    }
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
              <div className="overflow-hidden rounded-xl border border-border checkerboard">
                <img src={loaded.url} alt="Source" className="block w-full" />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <ImageInfoPanel image={loaded} />
            </div>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <h3 className="mb-3 text-sm font-semibold">Before / After</h3>
                <BeforeAfter before={loaded.url} after={result.url} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Upscale settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Scale factor</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{scale}x</span>
                </div>
                <input
                  type="range"
                  min={1.5}
                  max={4}
                  step={0.5}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                Result: {Math.round(loaded.width * scale)}×{Math.round(loaded.height * scale)} px
              </div>
            </div>

            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Output format</h3>
              <Label>Format</Label>
              <div className="flex gap-2">
                {(['png', 'jpeg', 'webp'] as ImageFormat[]).map((f) => (
                  <Button
                    key={f}
                    variant={format === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormat(f)}
                  >
                    {f.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-warning">Note:</span> This tool uses
                high-quality bicubic resampling. AI-powered upscaling for sharper results is
                coming soon with the Pro plan.
              </p>
            </div>

            <Button onClick={process} disabled={processing} size="lg" className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {processing ? 'Upscaling...' : `Upscale ${scale}x`}
            </Button>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    {result.width}×{result.height} · {formatBytes(result.size)}
                  </p>
                  <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                    {scale}x larger
                  </span>
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
