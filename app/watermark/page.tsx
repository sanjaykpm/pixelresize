'use client';

import * as React from 'react';
import { Stamp, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { FormatSelector } from '@/components/format-selector';
import { QualitySlider } from '@/components/quality-slider';
import { DownloadButton } from '@/components/download-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  addTextWatermark,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

type Position = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

const POSITIONS: { value: Position; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'center-left', label: 'Center Left' },
  { value: 'center', label: 'Center' },
  { value: 'center-right', label: 'Center Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

export default function WatermarkPage() {
  const tool = TOOLS[6];
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [text, setText] = React.useState('© PixelResize');
  const [fontSize, setFontSize] = React.useState(48);
  const [color, setColor] = React.useState('#ffffff');
  const [opacity, setOpacity] = React.useState(70);
  const [rotation, setRotation] = React.useState(0);
  const [position, setPosition] = React.useState<Position>('bottom-right');
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

  const process = async () => {
    if (!loaded) return;
    if (!text.trim()) {
      toast.error('Please enter watermark text.');
      return;
    }
    setProcessing(true);
    try {
      const r = await addTextWatermark(loaded.image, {
        text,
        fontSize,
        color,
        opacity: opacity / 100,
        rotation,
        position,
        format,
        quality,
      });
      setResult(r);
      toast.success('Watermark added');
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
                <h3 className="mb-3 text-sm font-semibold">Watermarked result</h3>
                <div className="overflow-hidden rounded-xl border border-border checkerboard">
                  <img src={result.url} alt="Watermarked" className="block w-full" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Watermark text</h3>
              <div className="space-y-2">
                <Label>Text content</Label>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="© Your Brand"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Font size</Label>
                  <Input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    min={8}
                    max={200}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-md border border-input"
                    />
                    <Input
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Position & opacity</h3>
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Opacity</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Rotation</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-primary"
                />
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

            <div className="flex gap-3">
              <Button onClick={process} disabled={processing} size="lg" className="flex-1">
                <Stamp className="mr-2 h-4 w-4" />
                {processing ? 'Adding watermark...' : 'Add Watermark'}
              </Button>
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
