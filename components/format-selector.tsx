'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ImageFormat } from '@/lib/image-processing';

const FORMATS: { value: ImageFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'avif', label: 'AVIF' },
  { value: 'bmp', label: 'BMP' },
  { value: 'gif', label: 'GIF' },
  { value: 'ico', label: 'ICO' },
];

type FormatSelectorProps = {
  value: ImageFormat;
  onChange: (v: ImageFormat) => void;
  exclude?: ImageFormat[];
};

export function FormatSelector({ value, onChange, exclude = [] }: FormatSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ImageFormat)}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {FORMATS.filter((f) => !exclude.includes(f.value)).map((f) => (
          <SelectItem key={f.value} value={f.value}>
            {f.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
