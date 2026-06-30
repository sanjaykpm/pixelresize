'use client';

import * as React from 'react';
import { IdCard, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
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
  makePassportPhoto,
  cropImage,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
  PASSPORT_SIZES,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function PassportPhotoPage() {
  const tool = TOOLS.find((t) => t.href === '/passport-photo')!;
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [offsetX, setOffsetX] = React.useState(0.5);
  const [offsetY, setOffsetY] = React.useState(0.4);
  const [format, setFormat] = React.useState<ImageFormat>('jpeg');

  const size = PASSPORT_SIZES[selectedSize];

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setResult(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const process = async () => {
    if (!loaded) return;
    setProcessing(true);
    try {
      const srcW = loaded.width;
      const srcH = loaded.height;
      const targetRatio = size.width / size.height;
      const srcRatio = srcW / srcH;

      let cropW: number;
      let cropH: number;
      if (srcRatio > targetRatio) {
        cropH = srcH / zoom;
        cropW = cropH * targetRatio;
      } else {
        cropW = srcW / zoom;
        cropH = cropW / targetRatio;
      }

      const maxOffsetX = srcW - cropW;
      const maxOffsetY = srcH - cropH;
      const x = maxOffsetX * offsetX;
      const y = maxOffsetY * offsetY;

      const r = await makePassportPhoto(
        loaded.image,
        { x, y, w: cropW, h: cropH },
        { width: size.width, height: size.height, format, quality: 95 }
      );
      setResult(r);
      toast.success('Passport photo created');
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
              <div className="relative overflow-hidden rounded-xl border border-border checkerboard">
                <img src={loaded.url} alt="Source" className="block w-full" />
                <div
                  className="absolute border-2 border-primary bg-primary/20"
                  style={{
                    left: `${(1 - offsetX) * 50 - (1 / zoom - 1) * 50}%`,
                    top: `${(1 - offsetY) * 50 - (1 / zoom - 1) * 50}%`,
                    width: `${(1 / zoom) * 100}%`,
                    height: `${(1 / zoom) * 100}%`,
                  }}
                />
              </div>
            </div>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <h3 className="mb-3 text-sm font-semibold">Result</h3>
                <div className="flex justify-center rounded-xl border border-border bg-white p-4">
                  <img src={result.url} alt="Passport photo" style={{ maxHeight: '300px' }} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Photo size</h3>
              <div className="space-y-2">
                <Label>Country / format</Label>
                <Select
                  value={String(selectedSize)}
                  onValueChange={(v) => setSelectedSize(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PASSPORT_SIZES.map((s, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {s.label} ({s.width}×{s.height})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Adjust crop</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Zoom</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{zoom}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Horizontal position</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{Math.round(offsetX * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Vertical position</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{Math.round(offsetY * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Output format</h3>
              <Select value={format} onValueChange={(v) => setFormat(v as ImageFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPEG (recommended)</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={process} disabled={processing} size="lg" className="w-full">
              <IdCard className="mr-2 h-4 w-4" />
              {processing ? 'Creating...' : 'Create Passport Photo'}
            </Button>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <p className="mb-3 text-sm font-semibold">
                  {result.width}×{result.height} · {formatBytes(result.size)}
                </p>
                <DownloadButton result={result} filename={`passport-${size.label}`} className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
