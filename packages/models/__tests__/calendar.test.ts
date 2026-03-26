import { buildCalendarModel, createCalendarController } from '../src/index.js';

describe('calendar model helpers', () => {
  it('builds a calendar model from controlled inputs', () => {
    const model = buildCalendarModel({
      focusDate: '2026-03-15',
      numberOfMonths: 1,
      ranges: [],
      fidelity: 'month',
    });

    expect(model.focusDate).toBe('2026-03-15');
    expect(model.numberOfMonths).toBe(1);
    expect(model.months[0]?.month).toBe(2);
  });

  it('creates navigation helpers that return the next controlled focus date', () => {
    const controller = createCalendarController({
      focusDate: '2026-03-31',
    });

    expect(controller.next()).toBe('2026-04-30');
    expect(controller.prev()).toBe('2026-02-28');
    expect(controller.goTo('2026-12-25')).toBe('2026-12-25');
  });
});
