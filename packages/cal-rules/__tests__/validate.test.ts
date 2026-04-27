import {
  validateRangeCreate,
  validateRangePatch,
  validateRanges,
} from '../src/index.js';

describe('@daywatch/cal-rules', () => {
  test('accepts a valid create payload', () => {
    const result = validateRangeCreate({
      id: 'r1',
      label: 'Morning block',
      fromDate: '2026-04-01',
      toDate: '2026-04-02',
      startTime: '09:00',
      endTime: '10:00',
    });

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  test('flags missing id', () => {
    const result = validateRangeCreate({ label: 'Missing ID' });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (issue) => issue.code === 'required' && issue.field === 'id',
      ),
    ).toBe(true);
  });

  test('flags everyHour/startTime conflict', () => {
    const result = validateRangeCreate({
      id: 'r1',
      label: 'Conflict',
      everyHour: [9],
      startTime: '09:00',
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (issue) =>
          issue.field === 'everyHour' && issue.code === 'disabled',
      ),
    ).toBe(true);
  });

  test('flags invalid date and time', () => {
    const result = validateRangeCreate({
      id: 'r1',
      label: 'Invalid',
      fromDate: '2026-13-01',
      startTime: '25:00',
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (issue) => issue.code === 'invalid' && issue.field === 'fromDate',
      ),
    ).toBe(true);
    expect(
      result.issues.some(
        (issue) => issue.code === 'invalid' && issue.field === 'startTime',
      ),
    ).toBe(true);
  });

  test('includes foul issues on patch transitions', () => {
    const existing = {
      id: 'r1',
      label: 'Patch',
      startTime: '09:00',
      endTime: '10:00',
    };

    const result = validateRangePatch(existing, { everyHour: [9] });

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'foul')).toBe(true);
  });

  test('flags unknown keys in strict mode', () => {
    const result = validateRangeCreate(
      {
        id: 'r1',
        label: 'Strict',
        extra: true,
      },
      { mode: 'strict' },
    );

    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (issue) => issue.code === 'unknown_key' && issue.field === '$',
      ),
    ).toBe(true);
  });

  test('returns indexed results for validateRanges', () => {
    const results = validateRanges([
      { id: 'r1', label: 'Good' },
      { label: 'Missing ID' },
    ]);

    expect(results).toHaveLength(2);
    expect(results[0].ok).toBe(true);
    expect(results[1].ok).toBe(false);
    expect(results[1].index).toBe(1);
    expect(
      results[1].issues.some(
        (issue) => issue.code === 'required' && issue.field === 'id',
      ),
    ).toBe(true);
  });
});
