'use client';

import * as React from 'react';
import { Layers, X, Download, FileArchive } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  loadImageFromFile,
  resizeImage,
  compressImage,
  convertImage,
  formatBytes,
  downloadBlob,
  getFilenameWithoutExt,
  type LoadedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

type BatchMode = 'resize' | 'compress' | 'convert';
type BatchItem = {
  loaded: LoadedImage;
  status: 'pending' | 'processing' | 'done' | 'error';
  resultBlob?: Blob;
  resultSize?: number;
  error?: string;
};

export default function BatchPage() {
  const tool = TOOLS[7];
  const [items, setItems] = React.useState<BatchItem[]>([]);
  const [mode, setMode] = React.useState<BatchMode>('resize');
  const [processing, setProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // resize options
  const [percentage, setPercentage] = React.useState(50);
  // compress options
  const [compressQuality, setCompressQuality] = React.useState(80);
  // convert options
  const [convertFormat, setConvertFormat] = React.useState<ImageFormat>('webp');
  // shared
  const [format, setFormat] = React.useState<ImageFormat>('png');
  const [quality, setQuality] = React.useState(90);

  const handleFiles = async (files: File[]) => {
    try {
      const loaded = await Promise.all(files.map((f) => loadImageFromFile(f)));
      setItems((prev) => [...prev, ...loaded.map((l) => ({ loaded: l, status: 'pending' as const }))]);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const processAll = async () => {
    if (items.length === 0) return;
    setProcessing(true);
    setProgress(0);
    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      updated[i] = { ...updated[i], status: 'processing' };
      setItems([...updated]);
      try {
        let blob: Blob;
        if (mode === 'resize') {
          const r = await resizeImage(updated[i].loaded.image, {
            percentage,
            maintainAspect: true,
            format,
            quality,
            removeMetadata: true,
          });
          blob = r.blob;
        } else if (mode === 'compress') {
          const r = await compressImage(updated[i].loaded.image, { format, quality: compressQuality });
          blob = r.blob;
        } else {
          const r = await convertImage(updated[i].loaded.image, { format: convertFormat, quality });
          blob = r.blob;
        }
        updated[i] = { ...updated[i], status: 'done', resultBlob: blob, resultSize: blob.size };
      } catch (e) {
        updated[i] = { ...updated[i], status: 'error', error: (e as Error).message };
      }
      setItems([...updated]);
      setProgress(Math.round(((i + 1) / updated.length) * 100));
    }
    setProcessing(false);
    const done = updated.filter((i) => i.status === 'done').length;
    toast.success(`Processed ${done} of ${updated.length} images`);
  };

  const downloadZip = async () => {
    const done = items.filter((i) => i.resultBlob);
    if (done.length === 0) return;
    toast.info('Creating ZIP file...');
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const usedNames = new Set<string>();
    for (const item of done) {
      const base = getFilenameWithoutExt(item.loaded.name);
      const ext = mode === 'convert' ? convertFormat : format;
      let name = `${base}.${ext}`;
      let n = 1;
      while (usedNames.has(name)) {
        name = `${base}-${n}.${ext}`;
        n++;
      }
      usedNames.add(name);
      zip.file(name, item.resultBlob!);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `pixelresize-batch-${Date.now()}.zip`);
    toast.success('ZIP downloaded');
  };

  const doneCount = items.filter((i) => i.status === 'done').length;
  const totalSize = items.reduce((s, i) => s + i.loaded.size, 0);
  const resultSize = items.reduce((s, i) => s + (i.resultSize || 0), 0);

  return (
    <ToolLayout icon={tool.icon} title={tool.title} description={tool.description}>
      {items.length === 0 ? (
        <Dropzone onFiles={handleFiles} multiple />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{items.length} images loaded</p>
                  <p className="text-xs text-muted-foreground">
                    Total: {formatBytes(totalSize)}
                    {resultSize > 0 && ` → ${formatBytes(resultSize)}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dropzone onFiles={handleFiles} multiple compact className="!min-h-0 border-solid py-2 px-4" />
                </div>
              </div>

              {processing && (
                <div className="mb-4 space-y-2">
                  <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    Processing {progress}% · {doneCount} of {items.length} done
                  </p>
                </div>
              )}

              <div className="max-h-[500px] space-y-2 overflow-y-auto">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-border p-2"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border checkerboard">
                      <img src={item.loaded.url} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.loaded.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.loaded.width}×{item.loaded.height} · {formatBytes(item.loaded.size)}
                        {item.resultSize !== undefined && (
                          <span className="ml-2 text-success">
                            → {formatBytes(item.resultSize)}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === 'done' && (
                        <Badge variant="secondary" className="bg-success/10 text-success">Done</Badge>
                      )}
                      {item.status === 'processing' && (
                        <Badge variant="secondary" className="animate-pulse">Processing</Badge>
                      )}
                      {item.status === 'error' && (
                        <Badge variant="destructive">Error</Badge>
                      )}
                      {!processing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeItem(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Batch operation</h3>
              <Tabs value={mode} onValueChange={(v) => setMode(v as BatchMode)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resize">Resize</TabsTrigger>
                  <TabsTrigger value="compress">Compress</TabsTrigger>
                  <TabsTrigger value="convert">Convert</TabsTrigger>
                </TabsList>
                <TabsContent value="resize" className="mt-4 space-y-2">
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
                    {[25, 50, 75, 100].map((p) => (
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
                </TabsContent>
                <TabsContent value="compress" className="mt-4">
                  <QualitySlider value={compressQuality} onChange={setCompressQuality} label="Compression" />
                </TabsContent>
                <TabsContent value="convert" className="mt-4 space-y-2">
                  <Label>Target format</Label>
                  <FormatSelector value={convertFormat} onChange={setConvertFormat} />
                </TabsContent>
              </Tabs>
            </div>

            {mode !== 'convert' && (
              <div className="glass-card space-y-4 rounded-2xl p-6">
                <h3 className="text-sm font-semibold">Output format</h3>
                <FormatSelector value={format} onChange={setFormat} />
                {(format === 'jpeg' || format === 'webp' || format === 'avif') && (
                  <QualitySlider value={quality} onChange={setQuality} />
                )}
              </div>
            )}

            <Button onClick={processAll} disabled={processing || items.length === 0} size="lg" className="w-full">
              <Layers className="mr-2 h-4 w-4" />
              {processing ? 'Processing...' : `Process ${items.length} Images`}
            </Button>

            {doneCount > 0 && (
              <Button onClick={downloadZip} variant="outline" size="lg" className="w-full">
                <FileArchive className="mr-2 h-4 w-4" />
                Download {doneCount} as ZIP
              </Button>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
