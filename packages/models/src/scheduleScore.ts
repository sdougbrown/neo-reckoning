import { RangeEvaluator, scoreSchedule } from '@neo-reckoning/core';
import type { DateRange, ScheduleScore } from '@neo-reckoning/core';

export interface ScheduleScoreModelConfig {
  ranges: DateRange[];
  from: Date;
  to: Date;
  focusBlockMinutes?: number;
  dayStart?: string;
  dayEnd?: string;
  userTimezone?: string;
}

export function buildScheduleScoreModel(config: ScheduleScoreModelConfig): ScheduleScore {
  const {
    ranges,
    from,
    to,
    focusBlockMinutes,
    dayStart,
    dayEnd,
    userTimezone,
  } = config;

  const evaluator = new RangeEvaluator(userTimezone);

  return scoreSchedule(evaluator, ranges, from, to, {
    focusBlockMinutes,
    dayStart,
    dayEnd,
  });
}
