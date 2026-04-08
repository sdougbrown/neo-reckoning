import { RangeEvaluator } from '@daywatch/cal';
import type { DateRange, SpanInfo } from '@daywatch/cal';

export interface SpansModelConfig {
  /** DateRanges to compute spans for */
  ranges: DateRange[];
  /** Start of the window */
  from: Date;
  /** End of the window */
  to: Date;
  /** User's timezone for range evaluation */
  userTimezone?: string;
}

export function buildSpansModel(config: SpansModelConfig): SpanInfo[] {
  const { ranges, from, to, userTimezone } = config;
  const evaluator = new RangeEvaluator(userTimezone);
  return evaluator.computeSpans(ranges, from, to);
}
