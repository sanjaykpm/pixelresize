'use client';

import * as React from 'react';
import { Eye, Copy } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { Button } from '@/components/ui/button';
import {
  loadImageFromFile,
  getAverageColor,
  getPixelColor,
  formatBytes,
  rgbToHex,
  type LoadedImage,
  type ColorInfo,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function ColorPickerPage() {
  const tool = TOOLS.find((t) => t.href === '/color-picker')!;
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [avgColor, setAvgColor] = React.useState<ColorInfo | null>(null);
  const [pickedColor, setPickedColor] = React.useState<ColorInfo | null>(null);
  const [hoverPos, setHoverPos] = React.useState<{ x: number; y: number } | null>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setAvgColor(getAverageColor(img.image));
      setPickedColor(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handlePick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!loaded || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const scaleX = loaded.width / rect.width;
    const scaleY = loaded.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const color = getPixelColor(loaded.image, x, y);
    setPickedColor(color);
    setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const copyColor = (color: ColorInfo) => {
    navigator.clipboard.writeText(color.hex);
    toast.success(`Copied ${color.hex}`);
  };

  const ColorSwatch = ({ color, label }: { color: ColorInfo; label: string }) => (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div
        className="h-12 w-12 shrink-0 rounded-lg border border-border"
        style={{ backgroundColor: color.hex }}
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="space-y-0.5 text-sm">
          <p className="font-mono">HEX: {color.hex}</p>
          <p className="font-mono text-muted-foreground">RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</p>
          <p className="font-mono text-muted-foreground">HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => copyColor(color)}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );

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
                    setPickedColor(null);
                  }}
                >
                  Change image
                </Button>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-border checkerboard">
                <img
                  ref={imgRef}
                  src={loaded.url}
                  alt="Source"
                  className="block w-full cursor-crosshair"
                  onClick={handlePick}
                />
                {hoverPos && pickedColor && (
                  <div
                    className="pointer-events-none absolute h-6 w-6 rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: hoverPos.x - 12,
                      top: hoverPos.y - 12,
                      backgroundColor: pickedColor.hex,
                    }}
                  />
                )}
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Click anywhere on the image to pick a color
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {pickedColor && (
              <div className="glass-card space-y-3 rounded-2xl p-6">
                <h3 className="text-sm font-semibold">Picked color</h3>
                <ColorSwatch color={pickedColor} label="Selected pixel" />
              </div>
            )}

            {avgColor && (
              <div className="glass-card space-y-3 rounded-2xl p-6">
                <h3 className="text-sm font-semibold">Average color</h3>
                <ColorSwatch color={avgColor} label="Average of entire image" />
              </div>
            )}

            <div className="glass-card rounded-2xl p-6">
              <h3 className="mb-3 text-sm font-semibold">How it works</h3>
              <p className="text-sm text-muted-foreground">
                Click on any pixel in the image to extract its exact color. The color is shown in
                HEX, RGB, and HSL formats. Click the copy button to copy the HEX value to your clipboard.
                The average color of the entire image is also calculated automatically.
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
