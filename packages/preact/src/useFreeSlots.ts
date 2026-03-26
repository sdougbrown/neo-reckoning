import { useMemo } from 'preact/hooks';
import { buildFreeSlotsModel } from '@neo-reckoning/models';
import type { FreeSlotsModelConfig } from '@neo-reckoning/models';
import type { FreeSlot } from '@neo-reckoning/core';

export function useFreeSlots(config: FreeSlotsModelConfig): FreeSlot[] {
  const { ranges, date, minDuration, dayStart, dayEnd, userTimezone } = config;

  return useMemo(
    () => buildFreeSlotsModel({ ranges, date, minDuration, dayStart, dayEnd, userTimezone }),
    [ranges, date, minDuration, dayStart, dayEnd, userTimezone],
  );
}
