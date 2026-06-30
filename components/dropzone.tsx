'use client';

import * as React from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ACCEPTED_TYPES, MAX_FILE_SIZE, formatBytes } from '@/lib/image-processing';
import { toast } from 'sonner';

type DropzoneProps = {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
  compact?: boolean;
};

export function Dropzone({ onFiles, multiple = false, className, compact }: DropzoneProps) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const valid: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large (max ${formatBytes(MAX_FILE_SIZE)}).`);
        continue;
      }
      valid.push(file);
    }
    if (valid.length > 0) onFiles(multiple ? valid : [valid[0]]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all',
        compact ? 'min-h-[160px] p-6' : 'min-h-[320px] p-10',
        dragging
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border hover:border-primary/50 hover:bg-accent/5',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary/10 text-primary transition-transform',
          compact ? 'h-12 w-12' : 'h-16 w-16',
          dragging && 'scale-110'
        )}
      >
        <Upload className={compact ? 'h-5 w-5' : 'h-7 w-7'} />
      </div>
      <p className={cn('mt-4 font-semibold', compact ? 'text-sm' : 'text-lg')}>
        {dragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {multiple ? 'Multiple images supported' : 'PNG, JPEG, WEBP, AVIF, BMP, GIF, SVG'}
      </p>
      {!compact && (
        <p className="mt-2 text-xs text-muted-foreground">
          Max {formatBytes(MAX_FILE_SIZE)} · Processed locally in your browser
        </p>
      )}
    </div>
  );
}
