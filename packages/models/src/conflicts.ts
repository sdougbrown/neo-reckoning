import { RangeEvaluator } from '@neo-reckoning/core';
import type { DateRange, Conflict } from '@neo-reckoning/core';

export interface ConflictsModelConfig {
  /** DateRanges to check for conflicts */
  ranges: DateRange[];
  /** Start of the window */
  from: Date;
  /** End of the window */
  to: Date;
  /** User's timezone for range evaluation */
  userTimezone?: string;
}

export function buildConflictsModel(config: ConflictsModelConfig): Conflict[] {
  const { ranges, from, to, userTimezone } = config;
  const evaluator = new RangeEvaluator(userTimezone);
  return evaluator.findConflictsInWindow(ranges, from, to);
}
