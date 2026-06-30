'use client';

import * as React from 'react';
import { RotateCw, RotateCcw, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { DownloadButton } from '@/components/download-button';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  loadImageFromFile,
  rotateImage,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function RotatePage() {
  const tool = TOOLS[3];
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [angle, setAngle] = React.useState(90);
  const [customAngle, setCustomAngle] = React.useState(0);
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

  const process = async (a: number) => {
    if (!loaded || a === 0) {
      if (a === 0) toast.error('Angle must be non-zero.');
      return;
    }
    setProcessing(true);
    try {
      const r = await rotateImage(loaded.image, { angle: a, format, quality });
      setResult(r);
      toast.success(`Rotated ${a}°`);
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
                <h3 className="mb-3 text-sm font-semibold">Rotated result</h3>
                <div className="overflow-hidden rounded-xl border border-border checkerboard">
                  <img src={result.url} alt="Rotated" className="block w-full" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Quick rotate</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => process(90)} variant="outline" size="lg">
                  <RotateCw className="mr-2 h-4 w-4" />
                  90° CW
                </Button>
                <Button onClick={() => process(-90)} variant="outline" size="lg">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  90° CCW
                </Button>
                <Button onClick={() => process(180)} variant="outline" size="lg">
                  <RotateCw className="mr-2 h-4 w-4" />
                  180°
                </Button>
                <Button onClick={() => process(270)} variant="outline" size="lg">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  270°
                </Button>
              </div>
            </div>

            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Custom angle</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Angle (degrees)</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{customAngle}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={customAngle}
                  onChange={(e) => setCustomAngle(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex gap-2">
                  {[-45, -15, 15, 45].map((a) => (
                    <Button
                      key={a}
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomAngle(a)}
                    >
                      {a}°
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={() => process(customAngle)} disabled={processing || customAngle === 0} className="w-full">
                Rotate {customAngle}°
              </Button>
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
