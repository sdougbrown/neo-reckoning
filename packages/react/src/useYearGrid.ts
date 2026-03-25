import { useMemo } from 'react';
import { YearGrid } from '@neo-reckoning/core';
import type { DateRange, YearMonth } from '@neo-reckoning/core';

export interface UseYearGridConfig {
  /** The year to generate (e.g. 2026) */
  year: number;
  /** DateRanges to evaluate against the grid */
  ranges: DateRange[];
  /** IANA timezone for the user viewing the calendar */
  userTimezone?: string;
}

export interface UseYearGridResult {
  /** Per-month activity data for heatmap-style rendering */
  months: YearMonth[];
}

/**
 * Year grid hook — computes lightweight per-day activity data for an entire year.
 * Returns rangeCount and rangeIds per day for heatmap-style rendering.
 */
export function useYearGrid(config: UseYearGridConfig): UseYearGridResult {
  const { year, ranges, userTimezone } = config;

  const months = useMemo(
    () =>
      new YearGrid({
        year,
        ranges,
        userTimezone,
      }).months,
    [year, ranges, userTimezone],
  );

  return { months };
}
