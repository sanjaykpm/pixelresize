'use client';

import { FilterTool } from '@/components/filter-tool';
import { TOOLS } from '@/lib/site-config';

export default function GrayscalePage() {
  const tool = TOOLS.find((t) => t.href === '/grayscale')!;
  return (
    <FilterTool
      tool={tool}
      controls={[
        { key: 'grayscale', label: 'Grayscale amount', min: 0, max: 100, step: 5, unit: '%', default: 0 },
        { key: 'sepia', label: 'Sepia tone', min: 0, max: 100, step: 5, unit: '%', default: 0 },
        { key: 'invert', label: 'Invert colors', min: 0, max: 100, step: 5, unit: '%', default: 0 },
      ]}
    />
  );
}
