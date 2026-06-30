'use client';

import * as React from 'react';
import { FileText, X, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
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
  imageToPDF,
  formatBytes,
  downloadBlob,
  type LoadedImage,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function ImageToPDFPage() {
  const tool = TOOLS.find((t) => t.href === '/image-to-pdf')!;
  const [images, setImages] = React.useState<LoadedImage[]>([]);
  const [pageSize, setPageSize] = React.useState<'a4' | 'letter' | 'fit'>('fit');
  const [processing, setProcessing] = React.useState(false);

  const handleFiles = async (files: File[]) => {
    try {
      const loaded = await Promise.all(files.map((f) => loadImageFromFile(f)));
      setImages((prev) => [...prev, ...loaded]);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const generate = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    try {
      const blob = await imageToPDF(images.map((i) => i.image), pageSize);
      downloadBlob(blob, `images-${Date.now()}.pdf`);
      toast.success('PDF created successfully');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout icon={tool.icon} title={tool.title} description={tool.description}>
      {images.length === 0 ? (
        <Dropzone onFiles={handleFiles} multiple />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">{images.length} image{images.length !== 1 ? 's' : ''} loaded</p>
                <Button variant="ghost" size="sm" onClick={() => setImages([])}>
                  Clear all
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((img, idx) => (
                  <div key={idx} className="group relative">
                    <div className="aspect-square overflow-hidden rounded-lg border border-border checkerboard">
                      <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                    </div>
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{img.name}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Dropzone onFiles={handleFiles} multiple compact className="!min-h-0 border-solid py-3" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">PDF settings</h3>
              <div className="space-y-2">
                <Label>Page size</Label>
                <Select value={pageSize} onValueChange={(v) => setPageSize(v as 'a4' | 'letter' | 'fit')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fit">Fit to image</SelectItem>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">US Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                {images.length} page{images.length !== 1 ? 's' : ''} will be created.
                Total size: {formatBytes(images.reduce((s, i) => s + i.size, 0))}
              </div>
            </div>

            <Button onClick={generate} disabled={processing || images.length === 0} size="lg" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              {processing ? 'Creating PDF...' : 'Create PDF'}
            </Button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
