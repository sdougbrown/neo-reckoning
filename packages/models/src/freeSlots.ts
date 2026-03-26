import { RangeEvaluator } from '@neo-reckoning/core';
import type { DateRange, FreeSlot } from '@neo-reckoning/core';

export interface FreeSlotsModelConfig {
  ranges: DateRange[];
  date: string;
  minDuration?: number;
  dayStart?: string;
  dayEnd?: string;
  userTimezone?: string;
}

export function buildFreeSlotsModel(config: FreeSlotsModelConfig): FreeSlot[] {
  const { ranges, date, minDuration, dayStart, dayEnd, userTimezone } = config;
  const evaluator = new RangeEvaluator(userTimezone);

  return evaluator.findFreeSlots(ranges, date, {
    minDuration,
    dayStart,
    dayEnd,
  });
}
