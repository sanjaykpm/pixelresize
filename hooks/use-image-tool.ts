'use client';

import * as React from 'react';
import { loadImageFromFile, getImagesFromClipboard, type LoadedImage } from '@/lib/image-processing';
import { toast } from 'sonner';

type UseImageToolOptions = {
  onProcess?: () => void;
  onReset?: () => void;
  processKey?: string;
  resetKey?: string;
};

export function useImageTool(opts: UseImageToolOptions = {}) {
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFiles = React.useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setError(null);
    try {
      const img = await loadImageFromFile(files[0]);
      setLoaded(img);
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toast.error(msg);
    }
  }, []);

  const handlePaste = React.useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (blob) {
          const ext = blob.type.split('/')[1] || 'png';
          const file = new File([blob], `pasted-${Date.now()}.${ext}`, { type: blob.type });
          await handleFiles([file]);
          toast.success('Image pasted from clipboard');
          return;
        }
      }
    }
  }, [handleFiles]);

  const clearImage = React.useCallback(() => {
    setLoaded(null);
    setError(null);
    opts.onReset?.();
  }, [opts]);

  const startProcessing = React.useCallback(() => setProcessing(true), []);
  const stopProcessing = React.useCallback(() => setProcessing(false), []);

  React.useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  React.useEffect(() => {
    if (!opts.processKey && !opts.resetKey) return;
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (opts.processKey && e.key === opts.processKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        opts.onProcess?.();
      }
      if (opts.resetKey && e.key === opts.resetKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        opts.onReset?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [opts]);

  return {
    loaded,
    setLoaded,
    processing,
    setProcessing: startProcessing,
    startProcessing,
    stopProcessing,
    error,
    setError,
    handleFiles,
    handlePaste,
    clearImage,
  };
}
