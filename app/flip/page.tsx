'use client';

import * as React from 'react';
import { FlipHorizontal, FlipVertical, FlipHorizontal2 } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { DownloadButton } from '@/components/download-button';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  loadImageFromFile,
  flipImage,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function FlipPage() {
  const tool = TOOLS[4];
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [format, setFormat] = React.useState<ImageFormat>('png');
  const [quality, setQuality] = React.useState(90);

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

  const process = async (horizontal: boolean, vertical: boolean) => {
    if (!loaded) return;
    setProcessing(true);
    try {
      const r = await flipImage(loaded.image, { horizontal, vertical, format, quality });
      setResult(r);
      toast.success('Image flipped');
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

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <h3 className="mb-3 text-sm font-semibold">Flipped result</h3>
                <div className="overflow-hidden rounded-xl border border-border checkerboard">
                  <img src={result.url} alt="Flipped" className="block w-full" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Flip direction</h3>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => process(true, false)}
                  disabled={processing}
                  variant="outline"
                  size="lg"
                  className="h-20"
                >
                  <FlipHorizontal className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Flip Horizontal</div>
                    <div className="text-xs text-muted-foreground">Mirror left to right</div>
                  </div>
                </Button>
                <Button
                  onClick={() => process(false, true)}
                  disabled={processing}
                  variant="outline"
                  size="lg"
                  className="h-20"
                >
                  <FlipVertical className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Flip Vertical</div>
                    <div className="text-xs text-muted-foreground">Mirror top to bottom</div>
                  </div>
                </Button>
                <Button
                  onClick={() => process(true, true)}
                  disabled={processing}
                  variant="outline"
                  size="lg"
                  className="h-20"
                >
                  <FlipHorizontal2 className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Flip Both</div>
                    <div className="text-xs text-muted-foreground">Mirror in both directions</div>
                  </div>
                </Button>
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
