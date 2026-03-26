import { createMemo, type Accessor } from 'solid-js';
import { buildFreeSlotsModel } from '@neo-reckoning/models';
import type { FreeSlotsModelConfig } from '@neo-reckoning/models';
import type { FreeSlot } from '@neo-reckoning/core';
import { toAccessor, type MaybeAccessor } from './utils.js';

export function createFreeSlots(
  config: MaybeAccessor<FreeSlotsModelConfig>,
): Accessor<FreeSlot[]> {
  const resolvedConfig = toAccessor(config);
  return createMemo(() => buildFreeSlotsModel(resolvedConfig()));
}
