import { useMemo } from 'preact/hooks';
import { buildYearGridModel } from '@daywatch/cal-models';
import type { YearGridModelConfig } from '@daywatch/cal-models';
import type { YearMonth } from '@daywatch/cal';

export interface UseYearGridConfig extends YearGridModelConfig {}

export interface UseYearGridResult {
  months: YearMonth[];
}

export function useYearGrid(config: UseYearGridConfig): UseYearGridResult {
  const { year, ranges, userTimezone } = config;

  const months = useMemo(
    () => buildYearGridModel({ year, ranges, userTimezone }).months,
    [year, ranges, userTimezone],
  );

  return { months };
}
