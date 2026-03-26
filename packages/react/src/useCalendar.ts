import { useMemo, useCallback } from 'react';
import { CalendarGrid } from '@neo-reckoning/core';
import type { DateRange, Month, ViewFidelity } from '@neo-reckoning/core';

export interface UseCalendarConfig {
  /** Current focus date (YYYY-MM-DD) */
  focusDate: string;
  /** Called when navigation changes the focus date */
  onFocusDateChange: (date: string) => void;
  /** Number of months to display */
  numberOfMonths: number;
  /** DateRanges to evaluate */
  ranges: DateRange[];
  /** Week start day: 0=Sunday, 1=Monday */
  weekStartsOn?: number;
  /** BCP 47 locale for formatting */
  locale?: string;
  /** User's timezone for range evaluation */
  userTimezone?: string;
  /** View fidelity level — controls detail computed per day. Default: 'month' */
  fidelity?: ViewFidelity;
}

export interface UseCalendarResult {
  /** The generated month grid data */
  months: Month[];
  /** Current focus date */
  focusDate: string;
  /** Number of months displayed */
  numberOfMonths: number;
  /** Navigate forward one month */
  next: () => void;
  /** Navigate backward one month */
  prev: () => void;
  /** Jump to a specific date */
  goTo: (date: string) => void;
}

/**
 * Core calendar hook — manages grid state and navigation.
 * Returns data structures only — no DOM rendering.
 */
export function useCalendar(config: UseCalendarConfig): UseCalendarResult {
  const grid = useMemo(() => {
    return new CalendarGrid({
      focusDate: config.focusDate,
      numberOfMonths: config.numberOfMonths,
      ranges: config.ranges,
      weekStartsOn: config.weekStartsOn,
      locale: config.locale,
      userTimezone: config.userTimezone,
      fidelity: config.fidelity,
    });
  }, [
    config.focusDate,
    config.numberOfMonths,
    config.ranges,
    config.weekStartsOn,
    config.locale,
    config.userTimezone,
    config.fidelity,
  ]);

  const next = useCallback(() => {
    config.onFocusDateChange(shiftMonth(config.focusDate, 1));
  }, [config.focusDate, config.onFocusDateChange]);

  const prev = useCallback(() => {
    config.onFocusDateChange(shiftMonth(config.focusDate, -1));
  }, [config.focusDate, config.onFocusDateChange]);

  const goTo = useCallback((date: string) => {
    config.onFocusDateChange(date);
  }, [config.onFocusDateChange]);

  return {
    months: grid.months,
    focusDate: config.focusDate,
    numberOfMonths: config.numberOfMonths,
    next,
    prev,
    goTo,
  };
}

function shiftMonth(dateStr: string, delta: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  const maxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, maxDay));

  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}
