'use client';

import { FilterTool } from '@/components/filter-tool';
import { TOOLS } from '@/lib/site-config';

export default function SharpenPage() {
  const tool = TOOLS.find((t) => t.href === '/sharpen')!;
  return (
    <FilterTool
      tool={tool}
      controls={[
        { key: 'sharpen', label: 'Sharpen amount', min: 0, max: 100, step: 5, unit: '%', default: 0 },
      ]}
    />
  );
}
