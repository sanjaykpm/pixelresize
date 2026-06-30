'use client';

import * as React from 'react';
import { Eraser } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { DownloadButton } from '@/components/download-button';
import { ImageInfoPanel } from '@/components/image-info-panel';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  loadImageFromFile,
  convertImage,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function ExifRemoverPage() {
  const tool = TOOLS.find((t) => t.href === '/exif-remover')!;
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [format, setFormat] = React.useState<ImageFormat>('jpeg');
  const [quality, setQuality] = React.useState(95);

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

  const process = async () => {
    if (!loaded) return;
    setProcessing(true);
    try {
      const r = await convertImage(loaded.image, { format, quality });
      setResult(r);
      toast.success('Metadata removed successfully');
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
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">How it works</h3>
              <p className="text-sm text-muted-foreground">
                This tool strips all EXIF metadata — including GPS location, camera model, date taken,
                and software used — from your image by re-encoding it. The visual quality is preserved.
              </p>
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

            <Button onClick={process} disabled={processing} size="lg" className="w-full">
              <Eraser className="mr-2 h-4 w-4" />
              {processing ? 'Removing metadata...' : 'Remove Metadata'}
            </Button>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    {formatBytes(loaded.size)} → {formatBytes(result.size)}
                  </p>
                  <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                    Metadata removed
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
