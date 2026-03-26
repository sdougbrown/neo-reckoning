import { createMemo, type Accessor } from 'solid-js';
import { buildYearGridModel } from '@neo-reckoning/models';
import type { YearGridModel, YearGridModelConfig } from '@neo-reckoning/models';
import { toAccessor, type MaybeAccessor } from './utils.js';

export interface CreateYearGridResult {
  months: Accessor<YearGridModel['months']>;
}

export function createYearGrid(
  config: MaybeAccessor<YearGridModelConfig>,
): CreateYearGridResult {
  const resolvedConfig = toAccessor(config);
  const model = createMemo(() => buildYearGridModel(resolvedConfig()));

  return {
    months: () => model().months,
  };
}
