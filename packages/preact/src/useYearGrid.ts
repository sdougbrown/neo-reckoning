import { useMemo } from 'preact/hooks';
import { buildYearGridModel } from '@neo-reckoning/models';
import type { YearGridModelConfig } from '@neo-reckoning/models';
import type { YearMonth } from '@neo-reckoning/core';

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
