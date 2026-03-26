import { useMemo } from 'preact/hooks';
import { buildConflictsModel } from '@neo-reckoning/models';
import type { ConflictsModelConfig } from '@neo-reckoning/models';
import type { Conflict } from '@neo-reckoning/core';

export interface UseConflictsConfig extends ConflictsModelConfig {}

export function useConflicts(config: UseConflictsConfig): Conflict[] {
  const { ranges, from, to, userTimezone } = config;

  return useMemo(
    () => buildConflictsModel({ ranges, from, to, userTimezone }),
    [ranges, from, to, userTimezone],
  );
}
