import { createMemo, type Accessor } from 'solid-js';
import { buildTimelineModel } from '@neo-reckoning/models';
import type { TimelineModelConfig, TimelineModel } from '@neo-reckoning/models';
import { toAccessor, type MaybeAccessor } from './utils.js';

export interface CreateTimelineResult {
  slots: Accessor<TimelineModel['slots']>;
}

export function createTimeline(
  config: MaybeAccessor<TimelineModelConfig>,
): CreateTimelineResult {
  const resolvedConfig = toAccessor(config);
  const model = createMemo(() => buildTimelineModel(resolvedConfig()));

  return {
    slots: () => model().slots,
  };
}
