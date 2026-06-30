'use client';

import { FilterTool } from '@/components/filter-tool';
import { TOOLS } from '@/lib/site-config';

export default function SaturationPage() {
  const tool = TOOLS.find((t) => t.href === '/saturation')!;
  return (
    <FilterTool
      tool={tool}
      controls={[
        { key: 'saturation', label: 'Saturation', min: 0, max: 200, step: 5, unit: '%', default: 100 },
        { key: 'hueRotate', label: 'Hue rotation', min: 0, max: 360, step: 5, unit: '°', default: 0 },
      ]}
    />
  );
}
