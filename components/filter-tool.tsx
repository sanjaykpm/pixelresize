'use client';

import * as React from 'react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { DownloadButton } from '@/components/download-button';
import { BeforeAfter } from '@/components/before-after';
import { ImageInfoPanel } from '@/components/image-info-panel';
import { FilterAdjust } from '@/components/filter-adjust';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  loadImageFromFile,
  applyFilters,
  formatBytes,
  DEFAULT_FILTERS,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
  type FilterOptions,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import type { Tool } from '@/lib/site-config';
import type { LucideIcon } from 'lucide-react';

type FilterControl = {
  key: keyof Omit<FilterOptions, 'format' | 'quality'>;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  default: number;
};

type FilterToolProps = {
  tool: Tool;
  controls: FilterControl[];
  defaultFormat?: ImageFormat;
};

export function FilterTool({ tool, controls, defaultFormat = 'png' }: FilterToolProps) {
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [filters, setFilters] = React.useState({ ...DEFAULT_FILTERS });
  const [format, setFormat] = React.useState<ImageFormat>(defaultFormat);
  const [quality, setQuality] = React.useState(90);
  const [autoPreview, setAutoPreview] = React.useState(true);

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setResult(null);
      setFilters({ ...DEFAULT_FILTERS });
      if (img.type === 'image/jpeg') setFormat('jpeg');
      else if (img.type === 'image/webp') setFormat('webp');
      else setFormat(defaultFormat);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const process = React.useCallback(async () => {
    if (!loaded) return;
    setProcessing(true);
    try {
      const r = await applyFilters(loaded.image, { ...filters, format, quality });
      setResult(r);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessing(false);
    }
  }, [loaded, filters, format, quality]);

  React.useEffect(() => {
    if (autoPreview && loaded) {
      const t = setTimeout(process, 300);
      return () => clearTimeout(t);
    }
  }, [autoPreview, loaded, process, filters]);

  const reset = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setResult(null);
  };

  const hasChanges = controls.some((c) => filters[c.key] !== c.default);

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

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <h3 className="mb-3 text-sm font-semibold">Before / After</h3>
                <BeforeAfter before={loaded.url} after={result.url} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Adjustments</h3>
                {hasChanges && (
                  <Button variant="ghost" size="sm" onClick={reset}>
                    Reset all
                  </Button>
                )}
              </div>
              {controls.map((c) => (
                <FilterAdjust
                  key={c.key}
                  label={c.label}
                  value={filters[c.key]}
                  onChange={(v) => setFilters((prev) => ({ ...prev, [c.key]: v }))}
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  unit={c.unit}
                  defaultValue={c.default}
                />
              ))}
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

            {!autoPreview && (
              <Button onClick={process} disabled={processing} size="lg" className="w-full">
                {processing ? 'Processing...' : 'Apply Filters'}
              </Button>
            )}

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    {result.width}×{result.height} · {formatBytes(result.size)}
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
