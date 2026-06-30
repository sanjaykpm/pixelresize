'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadBlob, getFilenameWithoutExt, type ProcessedImage } from '@/lib/image-processing';
import { toast } from 'sonner';

type DownloadButtonProps = {
  result: ProcessedImage | null;
  filename?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'lg' | 'sm';
  className?: string;
};

export function DownloadButton({
  result,
  filename = 'image',
  variant = 'default',
  size = 'lg',
  className,
}: DownloadButtonProps) {
  if (!result) return null;

  const handleDownload = () => {
    const base = getFilenameWithoutExt(filename);
    downloadBlob(result.blob, `${base}.${result.format}`);
    toast.success('Image downloaded');
  };

  return (
    <Button
      onClick={handleDownload}
      variant={variant}
      size={size}
      className={className}
    >
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  );
}
