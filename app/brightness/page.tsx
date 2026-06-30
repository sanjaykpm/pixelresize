'use client';

import { FilterTool } from '@/components/filter-tool';
import { TOOLS } from '@/lib/site-config';

export default function BrightnessPage() {
  const tool = TOOLS.find((t) => t.href === '/brightness')!;
  return (
    <FilterTool
      tool={tool}
      controls={[
        { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 5, unit: '%', default: 100 },
      ]}
    />
  );
}
