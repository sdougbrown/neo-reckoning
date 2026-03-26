import { createMemo } from 'solid-js';
import { createRangeCheck as createModelsRangeCheck } from '@neo-reckoning/models';
import type { RangeCheck } from '@neo-reckoning/models';
import type { DateRange } from '@neo-reckoning/core';
import { toAccessor, type MaybeAccessor } from './utils.js';

export interface CreateRangeCheckConfig {
  ranges: DateRange[];
  userTimezone?: string;
}

export function createRangeCheck(
  config: MaybeAccessor<CreateRangeCheckConfig>,
): RangeCheck {
  const resolvedConfig = toAccessor(config);
  const rangeCheck = createMemo(() => {
    const current = resolvedConfig();
    return createModelsRangeCheck(current.ranges, current.userTimezone);
  });

  return {
    isInRange: (datetime: Date) => rangeCheck().isInRange(datetime),
    getOccurrences: (from: Date, to: Date) => rangeCheck().getOccurrences(from, to),
  };
}
