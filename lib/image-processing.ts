export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'avif' | 'bmp' | 'gif' | 'ico';

export type ProcessedImage = {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
};

export type LoadedImage = {
  file: File;
  image: HTMLImageElement;
  url: string;
  width: number;
  height: number;
  size: number;
  type: string;
  name: string;
};

const MIME: Record<ImageFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  bmp: 'image/bmp',
  gif: 'image/gif',
  ico: 'image/x-icon',
};

export const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/svg+xml',
];

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function loadImageFromFile(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      reject(new Error(`Unsupported file type: ${file.type}`));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`File too large. Max size is ${formatBytes(MAX_FILE_SIZE)}.`));
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({
        file,
        image,
        url,
        width: image.naturalWidth,
        height: image.naturalHeight,
        size: file.size,
        type: file.type,
        name: file.name,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image. The file may be corrupted.'));
    };
    image.src = url;
  });
}

export function loadImageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image.'));
    image.src = src;
  });
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mime = MIME[format] || 'image/png';
    const q = quality !== undefined ? Math.min(1, Math.max(0, quality)) : undefined;
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`Failed to export as ${format.toUpperCase()}.`));
      },
      mime,
      q
    );
  });
}

export type ResizeOptions = {
  width?: number;
  height?: number;
  percentage?: number;
  maintainAspect: boolean;
  format: ImageFormat;
  quality: number;
  removeMetadata: boolean;
};

export async function resizeImage(
  source: HTMLImageElement,
  opts: ResizeOptions
): Promise<ProcessedImage> {
  let { width, height } = opts;
  const srcW = source.naturalWidth;
  const srcH = source.naturalHeight;

  if (opts.percentage && opts.percentage !== 100) {
    width = Math.round((srcW * opts.percentage) / 100);
    height = Math.round((srcH * opts.percentage) / 100);
  }

  if (opts.maintainAspect && width && height) {
    const ratio = srcW / srcH;
    if (width / height > ratio) {
      width = Math.round(height * ratio);
    } else {
      height = Math.round(width / ratio);
    }
  }

  width = width || srcW;
  height = height || srcH;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, opts.format, opts.quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width,
    height,
    size: blob.size,
    format: opts.format,
  };
}

export type CompressOptions = {
  format: ImageFormat;
  quality: number;
};

export async function compressImage(
  source: HTMLImageElement,
  opts: CompressOptions
): Promise<ProcessedImage> {
  const canvas = createCanvas(source.naturalWidth, source.naturalHeight);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0);

  const blob = await canvasToBlob(canvas, opts.format, opts.quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: source.naturalWidth,
    height: source.naturalHeight,
    size: blob.size,
    format: opts.format,
  };
}

export type RotateOptions = {
  angle: number;
  format: ImageFormat;
  quality: number;
};

export async function rotateImage(
  source: HTMLImageElement,
  opts: RotateOptions
): Promise<ProcessedImage> {
  const rad = (opts.angle * Math.PI) / 180;
  const srcW = source.naturalWidth;
  const srcH = source.naturalHeight;

  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const newW = Math.round(srcW * cos + srcH * sin);
  const newH = Math.round(srcW * sin + srcH * cos);

  const canvas = createCanvas(newW, newH);
  const ctx = canvas.getContext('2d')!;
  ctx.translate(newW / 2, newH / 2);
  ctx.rotate(rad);
  ctx.drawImage(source, -srcW / 2, -srcH / 2);

  const blob = await canvasToBlob(canvas, opts.format, opts.quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: newW,
    height: newH,
    size: blob.size,
    format: opts.format,
  };
}

export type FlipOptions = {
  horizontal: boolean;
  vertical: boolean;
  format: ImageFormat;
  quality: number;
};

export async function flipImage(
  source: HTMLImageElement,
  opts: FlipOptions
): Promise<ProcessedImage> {
  const w = source.naturalWidth;
  const h = source.naturalHeight;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d')!;

  ctx.translate(opts.horizontal ? w : 0, opts.vertical ? h : 0);
  ctx.scale(opts.horizontal ? -1 : 1, opts.vertical ? -1 : 1);
  ctx.drawImage(source, 0, 0);

  const blob = await canvasToBlob(canvas, opts.format, opts.quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: w,
    height: h,
    size: blob.size,
    format: opts.format,
  };
}

export type CropOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  format: ImageFormat;
  quality: number;
};

export async function cropImage(
  source: HTMLImageElement,
  opts: CropOptions
): Promise<ProcessedImage> {
  const canvas = createCanvas(opts.width, opts.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    source,
    opts.x,
    opts.y,
    opts.width,
    opts.height,
    0,
    0,
    opts.width,
    opts.height
  );

  const blob = await canvasToBlob(canvas, opts.format, opts.quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: opts.width,
    height: opts.height,
    size: blob.size,
    format: opts.format,
  };
}

export type ConvertOptions = {
  format: ImageFormat;
  quality: number;
};

export async function convertImage(
  source: HTMLImageElement,
  opts: ConvertOptions
): Promise<ProcessedImage> {
  const canvas = createCanvas(source.naturalWidth, source.naturalHeight);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);

  const blob = await canvasToBlob(canvas, opts.format, opts.quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: source.naturalWidth,
    height: source.naturalHeight,
    size: blob.size,
    format: opts.format,
  };
}

export type WatermarkTextOptions = {
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  rotation: number;
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: ImageFormat;
  quality: number;
};

export async function addTextWatermark(
  source: HTMLImageElement,
  opts: WatermarkTextOptions
): Promise<ProcessedImage> {
  const w = source.naturalWidth;
  const h = source.naturalHeight;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);

  const scale = Math.min(w, h) / 500;
  const fontSize = opts.fontSize * scale;
  ctx.font = `bold ${fontSize}px ${interFontStack()}`;
  ctx.fillStyle = opts.color;
  ctx.globalAlpha = opts.opacity;
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(opts.text);
  const textW = metrics.width;
  const textH = fontSize;
  const padding = 20 * scale;

  const pos = computePosition(opts.position, w, h, textW, textH, padding);

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate((opts.rotation * Math.PI) / 180);
  ctx.fillText(opts.text, -textW / 2, 0);
  ctx.restore();

  const blob = await canvasToBlob(canvas, opts.format, opts.quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: w,
    height: h,
    size: blob.size,
    format: opts.format,
  };
}

function interFontStack() {
  return 'Inter, system-ui, -apple-system, sans-serif';
}

function computePosition(
  position: WatermarkTextOptions['position'],
  canvasW: number,
  canvasH: number,
  textW: number,
  textH: number,
  padding: number
): { x: number; y: number } {
  const halfW = textW / 2;
  const halfH = textH / 2;
  switch (position) {
    case 'top-left': return { x: padding + halfW, y: padding + halfH };
    case 'top-center': return { x: canvasW / 2, y: padding + halfH };
    case 'top-right': return { x: canvasW - padding - halfW, y: padding + halfH };
    case 'center-left': return { x: padding + halfW, y: canvasH / 2 };
    case 'center': return { x: canvasW / 2, y: canvasH / 2 };
    case 'center-right': return { x: canvasW - padding - halfW, y: canvasH / 2 };
    case 'bottom-left': return { x: padding + halfW, y: canvasH - padding - halfH };
    case 'bottom-center': return { x: canvasW / 2, y: canvasH - padding - halfH };
    case 'bottom-right': return { x: canvasW - padding - halfW, y: canvasH - padding - halfH };
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function getFilenameWithoutExt(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx > 0 ? name.substring(0, idx) : name;
}

export function supportsFormat(format: ImageFormat): boolean {
  if (typeof document === 'undefined') return true;
  const canvas = createCanvas(1, 1);
  return canvas.toDataURL(MIME[format]).startsWith(`data:${MIME[format]}`);
}
