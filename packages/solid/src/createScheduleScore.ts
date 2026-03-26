import { createMemo, type Accessor } from 'solid-js';
import { buildScheduleScoreModel } from '@neo-reckoning/models';
import type { ScheduleScoreModelConfig } from '@neo-reckoning/models';
import type { ScheduleScore } from '@neo-reckoning/core';
import { toAccessor, type MaybeAccessor } from './utils.js';

export function createScheduleScore(
  config: MaybeAccessor<ScheduleScoreModelConfig>,
): Accessor<ScheduleScore> {
  const resolvedConfig = toAccessor(config);
  return createMemo(() => buildScheduleScoreModel(resolvedConfig()));
}
