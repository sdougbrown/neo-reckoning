import { YearGrid } from '@neo-reckoning/core';
import type { DateRange, YearMonth } from '@neo-reckoning/core';

export interface YearGridModelConfig {
  /** The year to generate (e.g. 2026) */
  year: number;
  /** DateRanges to evaluate against the grid */
  ranges: DateRange[];
  /** IANA timezone for the user viewing the calendar */
  userTimezone?: string;
}

export interface YearGridModel {
  /** Per-month activity data for heatmap-style rendering */
  months: YearMonth[];
}

export function buildYearGridModel(config: YearGridModelConfig): YearGridModel {
  const { year, ranges, userTimezone } = config;

  return {
    months: new YearGrid({
      year,
      ranges,
      userTimezone,
    }).months,
  };
}
