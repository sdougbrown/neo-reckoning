import type { DateRange } from '@daywatch/cal';

import { RANGE_KEYS, rangeInputUmp } from './ruleset.js';
import type {
  DateRangeInput,
  IndexedRangeValidationResult,
  RangeValidationIssue,
  RangeValidationIssueCode,
  RangeValidationMode,
  RangeValidationOptions,
  RangeValidationResult,
} from './types.js';

const RANGE_KEYS_SET = new Set<string>(RANGE_KEYS);

function toRequiredDisabledFoulInvalidIssues(
  candidate: DateRangeInput,
): RangeValidationIssue[] {
  const availability = rangeInputUmp.check(candidate);
  const issues: RangeValidationIssue[] = [];

  for (const field of Object.keys(availability) as Array<keyof DateRange>) {
    const status = availability[field];

    if (status.enabled && status.required && !status.satisfied) {
      issues.push({
        field,
        code: 'required',
        message: status.reason ?? `${field} is required`,
      });
      continue;
    }

    if (status.satisfied && !status.enabled) {
      issues.push({
        field,
        code: 'disabled',
        message: status.reason ?? `${field} is disabled`,
      });
      continue;
    }

    if (status.satisfied && status.enabled && !status.fair) {
      issues.push({
        field,
        code: 'foul',
        message: status.reason ?? `${field} is foul`,
      });
      continue;
    }

    if (status.satisfied && status.enabled && status.valid === false) {
      issues.push({
        field,
        code: 'invalid',
        message: status.error ?? `${field} is invalid`,
      });
    }
  }

  return issues;
}

function toUnknownKeyIssues(
  candidate: DateRangeInput,
  mode: RangeValidationMode,
): RangeValidationIssue[] {
  if (mode !== 'strict') {
    return [];
  }

  return Object.keys(candidate)
    .filter((key) => !RANGE_KEYS_SET.has(key))
    .map((key) => ({
      field: '$' as const,
      code: 'unknown_key' as RangeValidationIssueCode,
      message: `Unknown key "${key}"`,
    }));
}

function optionsToMode(options: RangeValidationOptions): RangeValidationMode {
  return options.mode ?? 'lenient';
}

function toResult(
  candidate: DateRangeInput,
  issues: RangeValidationIssue[],
): RangeValidationResult {
  return {
    ok: issues.length === 0,
    candidate,
    issues,
  };
}

export function validateRangeCreate(
  candidate: DateRangeInput,
  options: RangeValidationOptions = {},
): RangeValidationResult {
  const mode = optionsToMode(options);

  return toResult(candidate, [
    ...toRequiredDisabledFoulInvalidIssues(candidate),
    ...toUnknownKeyIssues(candidate, mode),
  ]);
}

export function validateRangePatch(
  existing: DateRangeInput,
  patch: DateRangeInput,
  options: RangeValidationOptions = {},
): RangeValidationResult {
  const mode = optionsToMode(options);
  const candidate = { ...existing, ...patch };

  const issues = [
    ...toRequiredDisabledFoulInvalidIssues(candidate),
    ...toUnknownKeyIssues(candidate, mode),
  ];

  const fouls = rangeInputUmp.play({ values: existing }, { values: candidate });

  for (const foul of fouls) {
    issues.push({
      field: foul.field as keyof DateRange,
      code: 'foul',
      message: foul.reason,
    });
  }

  return toResult(candidate, issues);
}

export function validateRanges(
  ranges: DateRangeInput[],
  options: RangeValidationOptions = {},
): IndexedRangeValidationResult[] {
  return ranges.map((candidate, index) => ({
    index,
    ...validateRangeCreate(candidate, options),
  }));
}
