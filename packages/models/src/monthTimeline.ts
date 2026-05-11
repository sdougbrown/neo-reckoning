import { MonthTimeline } from '@daywatch/cal';
import type { MonthSpanInfo, MonthTimelineConfig, TimelineMonth } from '@daywatch/cal';

export type MonthTimelineModelConfig = MonthTimelineConfig;

export interface MonthTimelineModel {
  months: TimelineMonth[];
  spans: MonthSpanInfo[];
  getDatePosition: (date: string) => { monthIndex: number; fraction: number } | null;
}

export function buildMonthTimelineModel(config: MonthTimelineModelConfig): MonthTimelineModel {
  const timeline = new MonthTimeline(config);

  return {
    months: timeline.months,
    spans: timeline.spans,
    getDatePosition: timeline.getDatePosition.bind(timeline),
  };
}
