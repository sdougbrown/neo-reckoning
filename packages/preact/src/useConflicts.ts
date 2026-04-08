import { useMemo } from 'preact/hooks';
import { buildConflictsModel } from '@daywatch/cal-models';
import type { ConflictsModelConfig } from '@daywatch/cal-models';
import type { Conflict } from '@daywatch/cal';

export interface UseConflictsConfig extends ConflictsModelConfig {}

export function useConflicts(config: UseConflictsConfig): Conflict[] {
  const { ranges, from, to, userTimezone } = config;

  return useMemo(
    () => buildConflictsModel({ ranges, from, to, userTimezone }),
    [ranges, from, to, userTimezone],
  );
}
