import { createMemo, type Accessor } from 'solid-js';
import { buildSpansModel } from '@neo-reckoning/models';
import type { SpansModelConfig } from '@neo-reckoning/models';
import type { SpanInfo } from '@neo-reckoning/core';
import { toAccessor, type MaybeAccessor } from './utils.js';

export function createSpans(
  config: MaybeAccessor<SpansModelConfig>,
): Accessor<SpanInfo[]> {
  const resolvedConfig = toAccessor(config);
  return createMemo(() => buildSpansModel(resolvedConfig()));
}
