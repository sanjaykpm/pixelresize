'use client';

import { formatBytes, getAspectRatio, type LoadedImage } from '@/lib/image-processing';
import { FileImage, Ruler, Ratio, HardDrive, FileType } from 'lucide-react';

type ImageInfoPanelProps = {
  image: LoadedImage;
  className?: string;
};

export function ImageInfoPanel({ image, className }: ImageInfoPanelProps) {
  const info = [
    { icon: FileImage, label: 'File name', value: image.name },
    { icon: Ruler, label: 'Dimensions', value: `${image.width} × ${image.height} px` },
    { icon: Ratio, label: 'Aspect ratio', value: getAspectRatio(image.width, image.height) },
    { icon: HardDrive, label: 'File size', value: formatBytes(image.size) },
    { icon: FileType, label: 'Type', value: image.type || 'unknown' },
  ];

  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-semibold">File information</h3>
      <div className="space-y-2">
        {info.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </span>
            <span className="truncate font-medium" title={item.value}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
