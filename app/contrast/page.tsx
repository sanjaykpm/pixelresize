'use client';

import { FilterTool } from '@/components/filter-tool';
import { TOOLS } from '@/lib/site-config';

export default function ContrastPage() {
  const tool = TOOLS.find((t) => t.href === '/contrast')!;
  return (
    <FilterTool
      tool={tool}
      controls={[
        { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 5, unit: '%', default: 100 },
      ]}
    />
  );
}
