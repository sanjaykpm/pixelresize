'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type QualitySliderProps = {
  value: number;
  onChange: (v: number) => void;
  label?: string;
};

export function QualitySlider({ value, onChange, label = 'Quality' }: QualitySliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-medium tabular-nums text-primary">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={10}
        max={100}
        step={5}
      />
    </div>
  );
}
