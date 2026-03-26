import { createMemo, type Accessor } from 'solid-js';
import { buildConflictsModel } from '@neo-reckoning/models';
import type { ConflictsModelConfig } from '@neo-reckoning/models';
import type { Conflict } from '@neo-reckoning/core';
import { toAccessor, type MaybeAccessor } from './utils.js';

export function createConflicts(
  config: MaybeAccessor<ConflictsModelConfig>,
): Accessor<Conflict[]> {
  const resolvedConfig = toAccessor(config);
  return createMemo(() => buildConflictsModel(resolvedConfig()));
}
