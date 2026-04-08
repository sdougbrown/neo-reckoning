import { createMemo, type Accessor } from 'solid-js';
import { buildScheduleScoreModel } from '@daywatch/cal-models';
import type { ScheduleScoreModelConfig } from '@daywatch/cal-models';
import type { ScheduleScore } from '@daywatch/cal';
import { toAccessor, type MaybeAccessor } from './utils.js';

export function createScheduleScore(
  config: MaybeAccessor<ScheduleScoreModelConfig>,
): Accessor<ScheduleScore> {
  const resolvedConfig = toAccessor(config);
  return createMemo(() => buildScheduleScoreModel(resolvedConfig()));
}
