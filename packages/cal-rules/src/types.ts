import type { DateRange } from '@daywatch/cal';

export type RangeValidationMode = 'lenient' | 'strict';

export type RangeValidationIssueCode =
  | 'required'
  | 'disabled'
  | 'foul'
  | 'invalid'
  | 'unknown_key';

export interface RangeValidationIssue {
  code: RangeValidationIssueCode;
  field: keyof DateRange | '$';
  message: string;
}

export interface RangeValidationOptions {
  mode?: RangeValidationMode;
}

export interface RangeValidationResult {
  ok: boolean;
  candidate: DateRangeInput;
  issues: RangeValidationIssue[];
}

export type DateRangeInput = Partial<DateRange> & Record<string, unknown>;

export type IndexedRangeValidationResult = RangeValidationResult & {
  index: number;
};
