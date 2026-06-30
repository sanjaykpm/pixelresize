'use client';

import * as React from 'react';
import { Repeat2, ArrowRight } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { DownloadButton } from '@/components/download-button';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

const FORMAT_INFO: Record<string, { label: string; desc: string; transparency: boolean }> = {
  png: { label: 'PNG', desc: 'Lossless, supports transparency', transparency: true },
  jpeg: { label: 'JPEG', desc: 'Best for photos, no transparency', transparency: false },
  webp: { label: 'WEBP', desc: 'Modern, small files, transparency', transparency: true },
  avif: { label: 'AVIF', desc: 'Best compression, modern', transparency: true },
  bmp: { label: 'BMP', desc: 'Uncompressed, large files', transparency: false },
  gif: { label: 'GIF', desc: '256 colors, animations', transparency: true },
  ico: { label: 'ICO', desc: 'Favicon format', transparency: true },
};

export default function ConvertPage() {
  const tool = TOOLS[5];
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [format, setFormat] = React.useState<ImageFormat>('webp');
  const [quality, setQuality] = React.useState(90);

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setResult(null);
      const ext = img.name.split('.').pop()?.toLowerCase() || '';
      if (ext === 'png') setFormat('webp');
      else if (ext === 'jpg' || ext === 'jpeg') setFormat('webp');
      else if (ext === 'webp') setFormat('png');
      else setFormat('png');
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
      toast.success(`Converted to ${format.toUpperCase()}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const sourceFormat = loaded?.name.split('.').pop()?.toUpperCase() || 'IMG';
  const info = FORMAT_INFO[format];

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
                <h3 className="mb-3 text-sm font-semibold">Converted result</h3>
                <div className="overflow-hidden rounded-xl border border-border checkerboard">
                  <img src={result.url} alt="Converted" className="block w-full" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Conversion</h3>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                <Badge variant="secondary" className="text-base">{sourceFormat}</Badge>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <Badge className="text-base">{format.toUpperCase()}</Badge>
              </div>
              <div className="space-y-2">
                <Label>Target format</Label>
                <FormatSelector value={format} onChange={setFormat} />
              </div>
              {info && (
                <div className="rounded-lg bg-muted/30 p-3 text-sm">
                  <p className="font-medium">{info.label}</p>
                  <p className="text-xs text-muted-foreground">{info.desc}</p>
                  <div className="mt-1">
                    {info.transparency ? (
                      <span className="text-xs text-success">Supports transparency</span>
                    ) : (
                      <span className="text-xs text-warning">No transparency (white background)</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Quality settings</h3>
              {(format === 'jpeg' || format === 'webp' || format === 'avif') ? (
                <QualitySlider value={quality} onChange={setQuality} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {format.toUpperCase()} is a lossless format — quality slider does not apply.
                </p>
              )}
            </div>

            <Button onClick={process} disabled={processing} size="lg" className="w-full">
              <Repeat2 className="mr-2 h-4 w-4" />
              {processing ? 'Converting...' : `Convert to ${format.toUpperCase()}`}
            </Button>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    {formatBytes(loaded.size)} → {formatBytes(result.size)}
                  </p>
                  <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                    {loaded.size > result.size
                      ? `${Math.round((1 - result.size / loaded.size) * 100)}% smaller`
                      : `${Math.round((result.size / loaded.size - 1) * 100)}% larger`}
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
