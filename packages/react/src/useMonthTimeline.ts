import { useMemo } from 'react';
import { buildMonthTimelineModel } from '@daywatch/cal-models';
import type { MonthTimelineModel, MonthTimelineModelConfig } from '@daywatch/cal-models';

export type UseMonthTimelineConfig = MonthTimelineModelConfig;

/**
 * Computes month-column timeline layout data.
 *
 * @note Stabilize the `ranges` array with `useMemo` or a module-level constant.
 * Inline array literals cause the timeline to recompute on every render.
 */
export function useMonthTimeline(config: UseMonthTimelineConfig): MonthTimelineModel {
  const { startDate, ranges, numberOfMonths, endDate, locale, userTimezone } = config;

  return useMemo(
    () => buildMonthTimelineModel(config),
    [startDate, ranges, numberOfMonths, endDate, locale, userTimezone],
  );
}
