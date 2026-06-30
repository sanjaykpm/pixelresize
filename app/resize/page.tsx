'use client';

import * as React from 'react';
import { Maximize2, RefreshCw, Link2, Unlink } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { DownloadButton } from '@/components/download-button';
import { BeforeAfter } from '@/components/before-after';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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

export default function ResizePage() {
  const tool = TOOLS[0];
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [mode, setMode] = React.useState<'dimensions' | 'percentage'>('dimensions');
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [percentage, setPercentage] = React.useState(50);
  const [maintainAspect, setMaintainAspect] = React.useState(true);
  const [format, setFormat] = React.useState<ImageFormat>('png');
  const [quality, setQuality] = React.useState(90);
  const [removeMetadata, setRemoveMetadata] = React.useState(true);

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setWidth(img.width);
      setHeight(img.height);
      setResult(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const onWidthChange = (v: number) => {
    setWidth(v);
    if (maintainAspect && loaded && v > 0) {
      setHeight(Math.round((v / loaded.width) * loaded.height));
    }
  };

  const onHeightChange = (v: number) => {
    setHeight(v);
    if (maintainAspect && loaded && v > 0) {
      setWidth(Math.round((v / loaded.height) * loaded.width));
    }
  };

  const process = async () => {
    if (!loaded) return;
    setProcessing(true);
    try {
      const r = await resizeImage(loaded.image, {
        width: mode === 'dimensions' ? width : undefined,
        height: mode === 'dimensions' ? height : undefined,
        percentage: mode === 'percentage' ? percentage : undefined,
        maintainAspect,
        format,
        quality,
        removeMetadata,
      });
      setResult(r);
      toast.success(`Resized to ${r.width}×${r.height}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    if (loaded) {
      setWidth(loaded.width);
      setHeight(loaded.height);
    }
    setPercentage(50);
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
            <div className="glass-card rounded-2xl p-6">
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'dimensions' | 'percentage')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                  <TabsTrigger value="percentage">Percentage</TabsTrigger>
                </TabsList>
                <TabsContent value="dimensions" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Width (px)</Label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => onWidthChange(Number(e.target.value))}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => onHeightChange(Number(e.target.value))}
                        min={1}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2">
                      {maintainAspect ? (
                        <Link2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Unlink className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Label className="cursor-pointer">Maintain aspect ratio</Label>
                    </div>
                    <Switch checked={maintainAspect} onCheckedChange={setMaintainAspect} />
                  </div>
                </TabsContent>
                <TabsContent value="percentage" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Scale percentage</Label>
                      <span className="text-sm font-medium tabular-nums text-primary">{percentage}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={200}
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex gap-2">
                      {[25, 50, 75, 100, 150].map((p) => (
                        <Button
                          key={p}
                          variant={percentage === p ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPercentage(p)}
                        >
                          {p}%
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    Result: {Math.round((loaded.width * percentage) / 100)}×
                    {Math.round((loaded.height * percentage) / 100)} px
                  </div>
                </TabsContent>
              </Tabs>
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
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <Label className="cursor-pointer">Remove metadata</Label>
                <Switch checked={removeMetadata} onCheckedChange={setRemoveMetadata} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={process} disabled={processing} size="lg" className="flex-1">
                <Maximize2 className="mr-2 h-4 w-4" />
                {processing ? 'Processing...' : 'Resize Image'}
              </Button>
              <Button onClick={reset} variant="outline" size="lg">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Result</p>
                    <p className="text-xs text-muted-foreground">
                      {result.width}×{result.height} · {formatBytes(result.size)}
                    </p>
                  </div>
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
