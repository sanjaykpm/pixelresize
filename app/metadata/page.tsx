'use client';

import * as React from 'react';
import { ScanLine } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { Button } from '@/components/ui/button';
import {
  loadImageFromFile,
  getImageMetadata,
  formatBytes,
  type LoadedImage,
  type ImageMetadata,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function MetadataPage() {
  const tool = TOOLS.find((t) => t.href === '/metadata')!;
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [metadata, setMetadata] = React.useState<ImageMetadata | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setMetadata(null);
      setLoading(true);
      const meta = await getImageMetadata(img.file, img.image);
      setMetadata(meta);
      setLoading(false);
    } catch (e) {
      toast.error((e as Error).message);
      setLoading(false);
    }
  };

  const exifEntries = metadata?.exif ? Object.entries(metadata.exif) : [];

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
                    setMetadata(null);
                  }}
                >
                  Change image
                </Button>
              </div>
              <div className="overflow-hidden rounded-xl border border-border checkerboard">
                <img src={loaded.url} alt="Source" className="block w-full" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {loading && (
              <div className="glass-card rounded-2xl p-6">
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${100 - i * 10}%` }} />
                  ))}
                </div>
              </div>
            )}

            {metadata && !loading && (
              <>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="mb-4 text-sm font-semibold">File information</h3>
                  <div className="space-y-2">
                    {[
                      ['File name', metadata.fileName],
                      ['File size', formatBytes(metadata.fileSize)],
                      ['File type', metadata.fileType],
                      ['Width', `${metadata.width} px`],
                      ['Height', `${metadata.height} px`],
                      ['Aspect ratio', metadata.aspectRatio],
                      ['Megapixels', `${metadata.megapixels} MP`],
                      ['Color depth', metadata.colorDepth],
                      ['Has alpha channel', metadata.hasAlpha ? 'Yes' : 'No'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="truncate font-medium" title={value}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {exifEntries.length > 0 && (
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="mb-4 text-sm font-semibold">EXIF data</h3>
                    <div className="space-y-2">
                      {exifEntries.map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-muted-foreground">{key}</span>
                          <span className="truncate font-medium" title={value}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {exifEntries.length === 0 && (
                  <div className="glass-card rounded-2xl p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No EXIF data found in this image. EXIF metadata is typically present in
                      JPEG photos taken with cameras and phones.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
