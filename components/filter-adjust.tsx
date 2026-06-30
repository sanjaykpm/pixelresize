'use client';

import { Label } from '@/components/ui/label';

type FilterAdjustProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
};

export function FilterAdjust({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  defaultValue,
}: FilterAdjustProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tabular-nums text-primary">
            {value}{unit}
          </span>
          {defaultValue !== undefined && value !== defaultValue && (
            <button
              onClick={() => onChange(defaultValue)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}
