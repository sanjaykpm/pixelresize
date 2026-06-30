'use client';

import * as React from 'react';
import { Wand2, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { DownloadButton } from '@/components/download-button';
import { BeforeAfter } from '@/components/before-after';
import { ImageInfoPanel } from '@/components/image-info-panel';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  loadImageFromFile,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function BackgroundRemoverPage() {
  const tool = TOOLS.find((t) => t.href === '/background-remover')!;
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [tolerance, setTolerance] = React.useState(30);
  const [bgColor, setBgColor] = React.useState('#ffffff');
  const [sampleX, setSampleX] = React.useState(0);
  const [sampleY, setSampleY] = React.useState(0);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setResult(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const sampleColor = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!loaded || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const scaleX = loaded.width / rect.width;
    const scaleY = loaded.height / rect.height;
    setSampleX(Math.round((e.clientX - rect.left) * scaleX));
    setSampleY(Math.round((e.clientY - rect.top) * scaleY));
    toast.info('Background color sampled. Click "Remove Background" to process.');
  };

  const process = async () => {
    if (!loaded) return;
    setProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = loaded.width;
      canvas.height = loaded.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(loaded.image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const pixel = ctx.getImageData(sampleX, sampleY, 1, 1).data;
      const bgR = pixel[0];
      const bgG = pixel[1];
      const bgB = pixel[2];

      const tol = tolerance * 2.55;

      for (let i = 0; i < data.length; i += 4) {
        const dr = Math.abs(data[i] - bgR);
        const dg = Math.abs(data[i + 1] - bgG);
        const db = Math.abs(data[i + 2] - bgB);
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < tol * 2) {
          const alpha = Math.max(0, Math.min(255, (dist / (tol * 2)) * 255));
          data[i + 3] = alpha;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Failed to export')), 'image/png');
      });

      setResult({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        size: blob.size,
        format: 'png' as ImageFormat,
      });
      toast.success('Background removed');
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
                <img
                  ref={imgRef}
                  src={loaded.url}
                  alt="Source"
                  className="block w-full cursor-crosshair"
                  onClick={sampleColor}
                />
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Click on the background color to sample it
              </p>
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
              <h3 className="text-sm font-semibold">Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tolerance</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{tolerance}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={80}
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Higher tolerance removes more colors similar to the sampled background.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <p className="text-muted-foreground">Sampled at: ({sampleX}, {sampleY})</p>
              </div>
            </div>

            <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-warning">Note:</span> This tool uses
                color-based background removal. For AI-powered automatic background removal
                (like remove.bg), upgrade to the Pro plan when available.
              </p>
            </div>

            <Button onClick={process} disabled={processing} size="lg" className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              {processing ? 'Removing background...' : 'Remove Background'}
            </Button>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <p className="mb-3 text-sm font-semibold">
                  {result.width}×{result.height} · {formatBytes(result.size)}
                </p>
                <DownloadButton result={result} filename={loaded.name} className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
