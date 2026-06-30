'use client';

import * as React from 'react';
import { Laugh } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
import { Dropzone } from '@/components/dropzone';
import { DownloadButton } from '@/components/download-button';
import { BeforeAfter } from '@/components/before-after';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  loadImageFromFile,
  generateMeme,
  formatBytes,
  type LoadedImage,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function MemeGeneratorPage() {
  const tool = TOOLS.find((t) => t.href === '/meme-generator')!;
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [topText, setTopText] = React.useState('ONE DOES NOT SIMPLY');
  const [bottomText, setBottomText] = React.useState('RESIZE AN IMAGE');
  const [fontSize, setFontSize] = React.useState(48);
  const [color, setColor] = React.useState('#ffffff');
  const [strokeColor, setStrokeColor] = React.useState('#000000');
  const [format, setFormat] = React.useState<ImageFormat>('jpeg');

  const handleFile = async (files: File[]) => {
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
      setResult(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const generate = async () => {
    if (!loaded) return;
    setProcessing(true);
    try {
      const r = await generateMeme(loaded.image, {
        topText,
        bottomText,
        fontSize,
        color,
        strokeColor,
        format,
        quality: 95,
      });
      setResult(r);
      toast.success('Meme generated');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (loaded) {
      const t = setTimeout(generate, 300);
      return () => clearTimeout(t);
    }
  }, [topText, bottomText, fontSize, color, strokeColor, loaded]);

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
                <h3 className="mb-3 text-sm font-semibold">Preview</h3>
                <div className="overflow-hidden rounded-xl border border-border">
                  <img src={result.url} alt="Meme" className="block w-full" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Meme text</h3>
              <div className="space-y-2">
                <Label>Top text</Label>
                <Input
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="TOP TEXT"
                />
              </div>
              <div className="space-y-2">
                <Label>Bottom text</Label>
                <Input
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="BOTTOM TEXT"
                />
              </div>
            </div>

            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h3 className="text-sm font-semibold">Text style</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Font size</Label>
                  <span className="text-sm font-medium tabular-nums text-primary">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Text color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-md border border-input"
                    />
                    <Input value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Outline color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-md border border-input"
                    />
                    <Input value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="flex-1" />
                  </div>
                </div>
              </div>
            </div>

            {result && (
              <div className="glass-card rounded-2xl p-4">
                <p className="mb-3 text-sm font-semibold">
                  {result.width}×{result.height} · {formatBytes(result.size)}
                </p>
                <DownloadButton result={result} filename={`meme-${Date.now()}`} className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
