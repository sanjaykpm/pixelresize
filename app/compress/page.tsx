'use client';

import * as React from 'react';
import { Minimize2, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { DownloadButton } from '@/components/download-button';
import { BeforeAfter } from '@/components/before-after';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  loadImageFromFile,
  compressImage,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function CompressPage() {
  const tool = TOOLS[1];
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [format, setFormat] = React.useState<ImageFormat>('jpeg');
  const [quality, setQuality] = React.useState(80);
  const [autoPreview, setAutoPreview] = React.useState(true);

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setResult(null);
      if (img.type === 'image/png') setFormat('png');
      else setFormat('jpeg');
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const process = React.useCallback(async () => {
    if (!loaded) return;
    setProcessing(true);
    try {
      const r = await compressImage(loaded.image, { format, quality });
      setResult(r);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessing(false);
    }
  }, [loaded, format, quality]);

  React.useEffect(() => {
    if (autoPreview && loaded) {
      const t = setTimeout(process, 300);
      return () => clearTimeout(t);
    }
  }, [autoPreview, loaded, process]);

  const savings = result && loaded ? Math.round((1 - result.size / loaded.size) * 100) : 0;

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

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <h3 className="mb-3 text-sm font-semibold">Before / After</h3>
                <BeforeAfter before={loaded.url} after={result.url} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Compression settings</h3>
              <div className="space-y-2">
                <Label>Output format</Label>
                <FormatSelector value={format} onChange={setFormat} />
              </div>
              <QualitySlider value={quality} onChange={setQuality} label="Compression level" />
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <Label className="cursor-pointer">Live preview</Label>
                <Switch checked={autoPreview} onCheckedChange={setAutoPreview} />
              </div>
              <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                Lower quality = smaller file. 80% is a good balance for photos.
                Use PNG for images with transparency or sharp edges.
              </div>
            </div>

            {!autoPreview && (
              <Button onClick={process} disabled={processing} size="lg" className="w-full">
                <Minimize2 className="mr-2 h-4 w-4" />
                {processing ? 'Compressing...' : 'Compress Image'}
              </Button>
            )}

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Compressed result</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(loaded.size)} → {formatBytes(result.size)}
                    </p>
                  </div>
                  <span className="rounded-full bg-success/10 px-3 py-1 text-sm font-bold text-success">
                    {savings > 0 ? `-${savings}%` : `+${Math.abs(savings)}%`}
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
