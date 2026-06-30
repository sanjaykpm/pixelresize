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

// ─── Resize Presets ──────────────────────────────────────────────

export type ResizePreset = {
  label: string;
  group: string;
  width: number;
  height: number;
};

export const RESIZE_PRESETS: ResizePreset[] = [
  { label: 'Instagram Square', group: 'Instagram', width: 1080, height: 1080 },
  { label: 'Instagram Portrait', group: 'Instagram', width: 1080, height: 1350 },
  { label: 'Instagram Story', group: 'Instagram', width: 1080, height: 1920 },
  { label: 'Facebook Cover', group: 'Facebook', width: 820, height: 312 },
  { label: 'Facebook Post', group: 'Facebook', width: 1200, height: 630 },
  { label: 'Facebook Story', group: 'Facebook', width: 1080, height: 1920 },
  { label: 'YouTube Thumbnail', group: 'YouTube', width: 1280, height: 720 },
  { label: 'YouTube Shorts', group: 'YouTube', width: 1080, height: 1920 },
  { label: 'LinkedIn Banner', group: 'LinkedIn', width: 1584, height: 396 },
  { label: 'LinkedIn Post', group: 'LinkedIn', width: 1200, height: 627 },
  { label: 'Pinterest Pin', group: 'Pinterest', width: 1000, height: 1500 },
  { label: 'Twitter Header', group: 'Twitter', width: 1500, height: 500 },
  { label: 'TikTok', group: 'TikTok', width: 1080, height: 1920 },
  { label: 'Discord Banner', group: 'Discord', width: 600, height: 240 },
  { label: 'WhatsApp Status', group: 'WhatsApp', width: 1080, height: 1920 },
  { label: 'Telegram Post', group: 'Telegram', width: 1280, height: 720 },
];

// ─── Image Watermark ─────────────────────────────────────────────

export type ImageWatermarkOptions = {
  watermarkImage: HTMLImageElement;
  scale: number;
  opacity: number;
  rotation: number;
  position: WatermarkTextOptions['position'];
  padding: number;
  format: ImageFormat;
  quality: number;
};

export async function addImageWatermark(
  source: HTMLImageElement,
  opts: ImageWatermarkOptions
): Promise<ProcessedImage> {
  const w = source.naturalWidth;
  const h = source.naturalHeight;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);

  const scale = Math.min(w, h) / 500;
  const wmW = opts.watermarkImage.naturalWidth * opts.scale * scale;
  const wmH = opts.watermarkImage.naturalHeight * opts.scale * scale;
  const padding = opts.padding * scale;

  const pos = computePosition(opts.position, w, h, wmW, wmH, padding);

  ctx.save();
  ctx.globalAlpha = opts.opacity;
  ctx.translate(pos.x, pos.y);
  ctx.rotate((opts.rotation * Math.PI) / 180);
  ctx.drawImage(opts.watermarkImage, -wmW / 2, -wmH / 2, wmW, wmH);
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

// ─── Image Filters ────────────────────────────────────────────────

export type FilterOptions = {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpen: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  invert: number;
  format: ImageFormat;
  quality: number;
};

export const DEFAULT_FILTERS: Omit<FilterOptions, 'format' | 'quality'> = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sharpen: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
};

export async function applyFilters(
  source: HTMLImageElement,
  opts: FilterOptions
): Promise<ProcessedImage> {
  const w = source.naturalWidth;
  const h = source.naturalHeight;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d')!;

  const parts: string[] = [];
  if (opts.brightness !== 100) parts.push(`brightness(${opts.brightness}%)`);
  if (opts.contrast !== 100) parts.push(`contrast(${opts.contrast}%)`);
  if (opts.saturation !== 100) parts.push(`saturate(${opts.saturation}%)`);
  if (opts.blur > 0) parts.push(`blur(${opts.blur}px)`);
  if (opts.grayscale > 0) parts.push(`grayscale(${opts.grayscale}%)`);
  if (opts.sepia > 0) parts.push(`sepia(${opts.sepia}%)`);
  if (opts.hueRotate !== 0) parts.push(`hue-rotate(${opts.hueRotate}deg)`);
  if (opts.invert > 0) parts.push(`invert(${opts.invert}%)`);

  ctx.filter = parts.length > 0 ? parts.join(' ') : 'none';
  ctx.drawImage(source, 0, 0);
  ctx.filter = 'none';

  if (opts.sharpen > 0) {
    applySharpen(ctx, w, h, opts.sharpen / 100);
  }

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

function applySharpen(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const copy = new Uint8ClampedArray(data);
  const strength = Math.min(1, amount);
  const center = 1 + 4 * strength;
  const adjacent = -strength;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const val =
          copy[idx + c] * center +
          copy[idx - 4 + c] * adjacent +
          copy[idx + 4 + c] * adjacent +
          copy[idx - w * 4 + c] * adjacent +
          copy[idx + w * 4 + c] * adjacent;
        data[idx + c] = Math.max(0, Math.min(255, val));
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// ─── Circle Crop ─────────────────────────────────────────────────

export type CircleCropOptions = {
  format: ImageFormat;
  quality: number;
};

export async function circleCropImage(
  source: HTMLImageElement,
  opts: CircleCropOptions
): Promise<ProcessedImage> {
  const size = Math.min(source.naturalWidth, source.naturalHeight);
  const offsetX = (source.naturalWidth - size) / 2;
  const offsetY = (source.naturalHeight - size) / 2;

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d')!;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(source, offsetX, offsetY, size, size, 0, 0, size, size);

  const blob = await canvasToBlob(canvas, opts.format, opts.quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: size,
    height: size,
    size: blob.size,
    format: opts.format,
  };
}

// ─── Color Picker ────────────────────────────────────────────────

export type ColorInfo = {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
};

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function getAverageColor(source: HTMLImageElement): ColorInfo {
  const canvas = createCanvas(1, 1);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  const r = data[0];
  const g = data[1];
  const b = data[2];
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b),
  };
}

export function getPixelColor(source: HTMLImageElement, x: number, y: number): ColorInfo {
  const canvas = createCanvas(source.naturalWidth, source.naturalHeight);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);
  const pixel = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b),
  };
}

// ─── Image Metadata / EXIF ───────────────────────────────────────

export type ImageMetadata = {
  fileName: string;
  fileSize: number;
  fileType: string;
  width: number;
  height: number;
  aspectRatio: string;
  megapixels: number;
  colorDepth: string;
  hasAlpha: boolean;
  exif: Record<string, string>;
};

export async function getImageMetadata(file: File, image: HTMLImageElement): Promise<ImageMetadata> {
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(w, h);

  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  let hasAlpha = false;
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 255) {
      hasAlpha = true;
      break;
    }
  }

  const exif: Record<string, string> = {};
  try {
    if (file.type === 'image/jpeg') {
      const buffer = await file.arrayBuffer();
      const exifData = parseExif(buffer);
      Object.assign(exif, exifData);
    }
  } catch {
    // EXIF parsing is best-effort
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    width: w,
    height: h,
    aspectRatio: `${w / divisor}:${h / divisor}`,
    megapixels: Math.round((w * h) / 1_000_000 * 100) / 100,
    colorDepth: '8-bit',
    hasAlpha,
    exif,
  };
}

function parseExif(buffer: ArrayBuffer): Record<string, string> {
  const result: Record<string, string> = {};
  const view = new DataView(buffer);

  if (view.byteLength < 4) return result;
  if (view.getUint16(0) !== 0xffd8) return result;

  let offset = 2;
  while (offset < view.byteLength - 1) {
    const marker = view.getUint16(offset);
    offset += 2;

    if (marker === 0xffe1) {
      const length = view.getUint16(offset);
      if (view.getUint32(offset + 2) === 0x45786966) {
        return parseExifIFD(view, offset + 8, length - 8);
      }
      offset += length;
    } else if ((marker & 0xff00) === 0xff00 && marker !== 0xffda) {
      if (offset + 1 >= view.byteLength) break;
      const length = view.getUint16(offset);
      offset += length;
    } else {
      break;
    }
  }
  return result;
}

function parseExifIFD(view: DataView, tiffOffset: number, _length: number): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    const byteOrder = view.getUint16(tiffOffset);
    const littleEndian = byteOrder === 0x4949;
    const ifdOffset = tiffOffset + view.getUint32(tiffOffset + 4, littleEndian);
    const entries = view.getUint16(ifdOffset, littleEndian);

    const tagNames: Record<number, string> = {
      0x010e: 'ImageDescription',
      0x010f: 'Make',
      0x0110: 'Model',
      0x0112: 'Orientation',
      0x011a: 'XResolution',
      0x011b: 'YResolution',
      0x0131: 'Software',
      0x0132: 'DateTime',
      0x8298: 'Copyright',
      0x829a: 'ExposureTime',
      0x829d: 'FNumber',
      0x8827: 'ISOSpeedRatings',
      0x9003: 'DateTimeOriginal',
      0x9004: 'DateTimeDigitized',
      0x9201: 'ShutterSpeedValue',
      0x9202: 'ApertureValue',
      0x9204: 'ExposureBiasValue',
      0x9207: 'MeteringMode',
      0x9209: 'Flash',
      0x920a: 'FocalLength',
      0xa002: 'PixelXDimension',
      0xa003: 'PixelYDimension',
    };

    for (let i = 0; i < entries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      const tag = view.getUint16(entryOffset, littleEndian);
      const type = view.getUint16(entryOffset + 2, littleEndian);
      const count = view.getUint32(entryOffset + 4, littleEndian);
      const valueOffset = entryOffset + 8;
      const name = tagNames[tag];
      if (!name) continue;

      if (type === 2) {
        const strOffset = count <= 4 ? valueOffset : tiffOffset + view.getUint32(valueOffset, littleEndian);
        let str = '';
        for (let j = 0; j < count - 1; j++) {
          str += String.fromCharCode(view.getUint8(strOffset + j));
        }
        result[name] = str;
      } else if (type === 3 && count === 1) {
        result[name] = String(view.getUint16(valueOffset, littleEndian));
      } else if (type === 4 && count === 1) {
        result[name] = String(view.getUint32(valueOffset, littleEndian));
      } else if (type === 5 && count === 1) {
        const num = view.getUint32(valueOffset, littleEndian);
        const den = view.getUint32(valueOffset + 4, littleEndian);
        result[name] = den === 0 ? '0' : (num / den).toFixed(1);
      }
    }
  } catch {
    // Best-effort parsing
  }
  return result;
}

// ─── QR Code Generator ────────────────────────────────────────────

export async function generateQRCode(
  text: string,
  size: number,
  opts: { format: ImageFormat; quality: number; margin: number; dark: string; light: string }
): Promise<ProcessedImage> {
  const matrix = encodeQR(text);
  const modules = matrix.length;
  const totalSize = modules + opts.margin * 2;
  const pixelSize = Math.max(1, Math.floor(size / totalSize));
  const canvasSize = pixelSize * totalSize;

  const canvas = createCanvas(canvasSize, canvasSize);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = opts.light;
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = opts.dark;

  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      if (matrix[y][x]) {
        ctx.fillRect((x + opts.margin) * pixelSize, (y + opts.margin) * pixelSize, pixelSize, pixelSize);
      }
    }
  }

  const blob = await canvasToBlob(canvas, opts.format, opts.quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvasSize,
    height: canvasSize,
    size: blob.size,
    format: opts.format,
  };
}

function encodeQR(text: string): boolean[][] {
  const data = new TextEncoder().encode(text);
  const version = selectVersion(data.length);
  const codewords = encodeData(data, version);
  const modules = 17 + version * 4;
  const matrix: (boolean | null)[][] = Array.from({ length: modules }, () => Array(modules).fill(null));
  placeFinderPatterns(matrix);
  placeAlignmentPatterns(matrix, version);
  placeTimingPatterns(matrix);
  placeFormatInfo(matrix, 0, 0);
  placeData(matrix, codewords);
  return matrix.map((row) => row.map((c) => c === true));
}

function selectVersion(dataLength: number): number {
  const capacities = [17, 32, 53, 78, 106, 134, 154, 192, 230, 271];
  for (let v = 0; v < capacities.length; v++) {
    if (dataLength <= capacities[v]) return v + 1;
  }
  return 10;
}

function encodeData(data: Uint8Array, _version: number): number[] {
  const codewords: number[] = [];
  for (let i = 0; i < data.length; i++) {
    codewords.push(data[i]);
  }
  const totalCodewords = (17 + _version * 4) * (17 + _version * 4) / 8;
  codewords.push(0);
  while (codewords.length < totalCodewords) {
    codewords.push(codewords.length % 2 === 0 ? 236 : 17);
  }
  return codewords.slice(0, Math.floor(totalCodewords));
}

function placeFinderPatterns(matrix: (boolean | null)[][]) {
  const size = matrix.length;
  const positions = [0, size - 7];
  for (const r of positions) {
    for (const c of positions) {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
          const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          matrix[r + y][c + x] = isBorder || isInner;
        }
      }
    }
  }
}

function placeAlignmentPatterns(matrix: (boolean | null)[][], version: number) {
  if (version < 2) return;
  const positions = alignmentPositions(version);
  for (const r of positions) {
    for (const c of positions) {
      if (matrix[r][c] !== null) continue;
      for (let y = -2; y <= 2; y++) {
        for (let x = -2; x <= 2; x++) {
          const isOuter = Math.abs(x) === 2 || Math.abs(y) === 2;
          const isCenter = x === 0 && y === 0;
          matrix[r + y][c + x] = isOuter || isCenter;
        }
      }
    }
  }
}

function alignmentPositions(version: number): number[] {
  if (version === 1) return [];
  const intervals = Math.floor(version / 7) + 1;
  const size = 17 + version * 4;
  const step = Math.floor((size - 14) / intervals);
  const positions = [6];
  for (let i = 1; i <= intervals; i++) {
    positions.push(size - 7 - (intervals - i) * step);
  }
  return positions;
}

function placeTimingPatterns(matrix: (boolean | null)[][]) {
  const size = matrix.length;
  for (let i = 8; i < size - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
    if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
  }
}

function placeFormatInfo(matrix: (boolean | null)[][], _ecLevel: number, _mask: number) {
  const size = matrix.length;
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
  }
  for (let i = 0; i < 8; i++) {
    if (matrix[8][size - 1 - i] === null) matrix[8][size - 1 - i] = false;
    if (matrix[size - 1 - i][8] === null) matrix[size - 1 - i][8] = false;
  }
  matrix[size - 8][8] = true;
}

function placeData(matrix: (boolean | null)[][], codewords: number[]) {
  const size = matrix.length;
  let bitIndex = 0;
  let byteIndex = 0;
  let direction = -1;
  let col = size - 1;

  while (col > 0) {
    if (col === 6) col--;
    for (let i = 0; i < size; i++) {
      const row = direction === -1 ? size - 1 - i : i;
      for (let j = 0; j < 2; j++) {
        const x = col - j;
        if (matrix[row][x] !== null) continue;
        let bit = false;
        if (byteIndex < codewords.length) {
          bit = ((codewords[byteIndex] >> (7 - bitIndex)) & 1) === 1;
        }
        matrix[row][x] = bit;
        bitIndex++;
        if (bitIndex === 8) {
          bitIndex = 0;
          byteIndex++;
        }
      }
    }
    col -= 2;
    direction = -direction;
  }
}

// ─── Favicon Generator ────────────────────────────────────────────

export type FaviconSize = 16 | 32 | 48 | 64 | 128 | 180 | 192 | 512;

export async function generateFavicon(
  source: HTMLImageElement,
  size: FaviconSize,
  format: ImageFormat,
  quality: number,
  borderRadius = 0
): Promise<ProcessedImage> {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d')!;

  if (borderRadius > 0) {
    const r = (borderRadius / 100) * (size / 2);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(size, 0, size, size, r);
    ctx.arcTo(size, size, 0, size, r);
    ctx.arcTo(0, size, 0, 0, r);
    ctx.arcTo(0, 0, size, 0, r);
    ctx.closePath();
    ctx.clip();
  }

  const srcW = source.naturalWidth;
  const srcH = source.naturalHeight;
  const scale = Math.max(size / srcW, size / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const dx = (size - drawW) / 2;
  const dy = (size - drawH) / 2;
  ctx.drawImage(source, dx, dy, drawW, drawH);

  const blob = await canvasToBlob(canvas, format, quality / 100);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: size,
    height: size,
    size: blob.size,
    format,
  };
}

// ─── Meme Generator ───────────────────────────────────────────────

export type MemeOptions = {
  topText: string;
  bottomText: string;
  fontSize: number;
  color: string;
  strokeColor: string;
  format: ImageFormat;
  quality: number;
};

export async function generateMeme(
  source: HTMLImageElement,
  opts: MemeOptions
): Promise<ProcessedImage> {
  const w = source.naturalWidth;
  const h = source.naturalHeight;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);

  const scale = Math.min(w, h) / 500;
  const fontSize = opts.fontSize * scale;
  ctx.font = `bold ${fontSize}px Impact, Inter, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = opts.color;
  ctx.strokeStyle = opts.strokeColor;
  ctx.lineWidth = fontSize * 0.08;

  const drawText = (text: string, y: number, baseline: 'top' | 'bottom') => {
    if (!text) return;
    ctx.textBaseline = baseline;
    const x = w / 2;
    const padding = 20 * scale;
    const actualY = baseline === 'top' ? padding : h - padding;
    const lines = text.toUpperCase().split('\n');
    if (baseline === 'top') {
      lines.forEach((line, i) => {
        const lineY = actualY + i * fontSize * 1.1;
        ctx.strokeText(line, x, lineY);
        ctx.fillText(line, x, lineY);
      });
    } else {
      lines.reverse().forEach((line, i) => {
        const lineY = actualY - (i + 1) * fontSize * 1.1;
        ctx.strokeText(line, x, lineY);
        ctx.fillText(line, x, lineY);
      });
    }
  };

  drawText(opts.topText, 0, 'top');
  drawText(opts.bottomText, h, 'bottom');

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

// ─── Passport Photo Maker ─────────────────────────────────────────

export type PassportOptions = {
  width: number;
  height: number;
  format: ImageFormat;
  quality: number;
};

export async function makePassportPhoto(
  source: HTMLImageElement,
  crop: { x: number; y: number; w: number; h: number },
  opts: PassportOptions
): Promise<ProcessedImage> {
  const canvas = createCanvas(opts.width, opts.height);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, crop.x, crop.y, crop.w, crop.h, 0, 0, opts.width, opts.height);

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

export const PASSPORT_SIZES = [
  { label: 'US Passport', width: 600, height: 600 },
  { label: 'US Visa', width: 600, height: 600 },
  { label: 'UK Passport', width: 600, height: 750 },
  { label: 'EU/Schengen', width: 600, height: 750 },
  { label: 'India Passport', width: 600, height: 750 },
  { label: 'Canada Passport', width: 500, height: 700 },
  { label: 'Australia Passport', width: 600, height: 800 },
  { label: 'Japan Passport', width: 450, height: 600 },
  { label: '2x2 inch (51x51mm)', width: 600, height: 600 },
  { label: '35x45mm (EU)', width: 413, height: 531 },
];

// ─── Image to PDF ────────────────────────────────────────────────

export async function imageToPDF(
  images: HTMLImageElement[],
  pageSize: 'a4' | 'letter' | 'fit'
): Promise<Blob> {
  const pages: Array<string> = [];
  for (const img of images) {
    const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    pages.push(canvas.toDataURL('image/jpeg', 0.92));
  }
  return buildPDF(pages, pageSize);
}

function buildPDF(imageDataUrls: string[], pageSize: 'a4' | 'letter' | 'fit'): Blob {
  const pageW = pageSize === 'a4' ? 595 : pageSize === 'letter' ? 612 : 0;
  const pageH = pageSize === 'a4' ? 842 : pageSize === 'letter' ? 792 : 0;

  const objects: string[] = [];
  let offset = 0;
  const xref: number[] = [];

  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');

  const pageObjIdx = 3;
  const contentObjIdx = 4 + imageDataUrls.length * 2;
  const imageObjIndices: number[] = [];

  for (let i = 0; i < imageDataUrls.length; i++) {
    imageObjIndices.push(5 + i * 2);
  }

  objects.push(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW || 612} ${pageH || 792}] /Resources << /XObject << /Im0 ${imageObjIndices[0]} 0 R >> >> /Contents ${contentObjIdx} 0 R >>`
  );

  for (let i = 0; i < imageDataUrls.length; i++) {
    const dataUrl = imageDataUrls[i];
    const base64 = dataUrl.split(',')[1] || '';
    const binary = atob(base64);
    const imgBytes = new Uint8Array(binary.length);
    for (let j = 0; j < binary.length; j++) imgBytes[j] = binary.charCodeAt(j);

    objects.push(`<< /Type /XObject /Subtype /Image /Width 1 /Height 1 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>`);
    objects.push(`stream\n${binary}\nendstream`);
  }

  const pw = pageW || 612;
  const ph = pageH || 792;
  objects.push(`<< /Length 44 >>\nstream\nq\n${pw} 0 0 ${ph} 0 0 cm\n/Im0 Do\nQ\nendstream`);

  let pdf = '%PDF-1.4\n';
  for (let i = 0; i < objects.length; i++) {
    xref.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  xref.push(pdf.length);
  pdf += `% 0 0 obj\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nendobj\n`;
  pdf += `startxref\n${xref[0]}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

// ─── Clipboard Paste Helper ──────────────────────────────────────

export async function getImagesFromClipboard(): Promise<File[]> {
  const files: File[] = [];
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          const ext = type.split('/')[1] || 'png';
          files.push(new File([blob], `pasted-image-${Date.now()}.${ext}`, { type }));
        }
      }
    }
  } catch {
    // Clipboard API may not be available
  }
  return files;
}

export function getAspectRatio(w: number, h: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}
