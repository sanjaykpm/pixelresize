'use client';

import * as React from 'react';
import { QrCode, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tool-layout';
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
  generateQRCode,
  downloadBlob,
  formatBytes,
  type ProcessedImage,
  type ImageFormat,
} from '@/lib/image-processing';
import { toast } from 'sonner';
import { TOOLS } from '@/lib/site-config';

export default function QRGeneratorPage() {
  const tool = TOOLS.find((t) => t.href === '/qr-generator')!;
  const [text, setText] = React.useState('https://pixelresize.app');
  const [size, setSize] = React.useState(512);
  const [margin, setMargin] = React.useState(4);
  const [darkColor, setDarkColor] = React.useState('#000000');
  const [lightColor, setLightColor] = React.useState('#ffffff');
  const [format, setFormat] = React.useState<ImageFormat>('png');
  const [quality, setQuality] = React.useState(100);
  const [result, setResult] = React.useState<ProcessedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const generate = async () => {
    if (!text.trim()) {
      toast.error('Please enter text or a URL.');
      return;
    }
    setProcessing(true);
    try {
      const r = await generateQRCode(text, size, { format, quality, margin, dark: darkColor, light: lightColor });
      setResult(r);
      toast.success('QR code generated');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    if (text.trim()) {
      const t = setTimeout(generate, 300);
      return () => clearTimeout(t);
    }
  }, [text, size, margin, darkColor, lightColor]);

  return (
    <ToolLayout icon={tool.icon} title={tool.title} description={tool.description}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="glass-card space-y-4 rounded-2xl p-6">
            <h3 className="text-sm font-semibold">QR code content</h3>
            <div className="space-y-2">
              <Label>Text or URL</Label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="glass-card space-y-4 rounded-2xl p-6">
            <h3 className="text-sm font-semibold">Appearance</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Size</Label>
                <span className="text-sm font-medium tabular-nums text-primary">{size}px</span>
              </div>
              <input
                type="range"
                min={128}
                max={1024}
                step={64}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Margin</Label>
                <span className="text-sm font-medium tabular-nums text-primary">{margin}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Foreground</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-md border border-input"
                  />
                  <Input value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-md border border-input"
                  />
                  <Input value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card space-y-4 rounded-2xl p-6">
            <h3 className="text-sm font-semibold">Output format</h3>
            <Select value={format} onValueChange={(v) => setFormat(v as ImageFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="webp">WEBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="mb-4 text-sm font-semibold">Preview</h3>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center rounded-xl border border-border bg-white p-8">
                  <img src={result.url} alt="QR Code" className="max-w-full" />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  {result.width}×{result.height} · {formatBytes(result.size)}
                </p>
                <Button
                  onClick={() => {
                    downloadBlob(result.blob, `qr-code.${result.format}`);
                    toast.success('QR code downloaded');
                  }}
                  size="lg"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border">
                <div className="text-center">
                  <QrCode className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {processing ? 'Generating...' : 'Enter text to generate QR code'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
