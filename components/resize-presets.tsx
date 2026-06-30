'use client';

import { RESIZE_PRESETS, type ResizePreset } from '@/lib/image-processing';
import { cn } from '@/lib/utils';

type ResizePresetsProps = {
  onSelect: (preset: ResizePreset) => void;
  selected?: string;
  className?: string;
};

export function ResizePresets({ onSelect, selected, className }: ResizePresetsProps) {
  const groups = RESIZE_PRESETS.reduce<Record<string, ResizePreset[]>>((acc, preset) => {
    (acc[preset.group] = acc[preset.group] || []).push(preset);
    return acc;
  }, {});

  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-semibold">Resize presets</h3>
      <div className="space-y-4">
        {Object.entries(groups).map(([group, presets]) => (
          <div key={group}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group}
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => onSelect(preset)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                    selected === preset.label
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-accent/5'
                  )}
                >
                  {preset.label.replace(group + ' ', '')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
