import { useMemo } from 'preact/hooks';
import { buildFreeSlotsModel } from '@daywatch/cal-models';
import type { FreeSlotsModelConfig } from '@daywatch/cal-models';
import type { FreeSlot } from '@daywatch/cal';

export function useFreeSlots(config: FreeSlotsModelConfig): FreeSlot[] {
  const { ranges, date, minDuration, dayStart, dayEnd, userTimezone } = config;

  return useMemo(
    () => buildFreeSlotsModel({ ranges, date, minDuration, dayStart, dayEnd, userTimezone }),
    [ranges, date, minDuration, dayStart, dayEnd, userTimezone],
  );
}
