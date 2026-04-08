import { useMemo } from 'preact/hooks';
import { buildSpansModel } from '@daywatch/cal-models';
import type { SpansModelConfig } from '@daywatch/cal-models';
import type { SpanInfo } from '@daywatch/cal';

export interface UseSpansConfig extends SpansModelConfig {}

export function useSpans(config: UseSpansConfig): SpanInfo[] {
  const { ranges, from, to, userTimezone } = config;

  return useMemo(
    () => buildSpansModel({ ranges, from, to, userTimezone }),
    [ranges, from, to, userTimezone],
  );
}
