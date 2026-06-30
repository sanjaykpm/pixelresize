'use client';

import { FilterTool } from '@/components/filter-tool';
import { TOOLS } from '@/lib/site-config';

export default function BlurPage() {
  const tool = TOOLS.find((t) => t.href === '/blur')!;
  return (
    <FilterTool
      tool={tool}
      controls={[
        { key: 'blur', label: 'Blur amount', min: 0, max: 20, step: 0.5, unit: 'px', default: 0 },
      ]}
    />
  );
}
