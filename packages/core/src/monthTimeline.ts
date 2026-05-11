import type { DateRange, MonthSpanInfo, MonthTimelineConfig, TimelineMonth } from './types.js';
import { RangeEvaluator } from './evaluator.js';
import { buildDate, compareDates, daysInMonth, formatDate, parseDate } from './time.js';

interface ResolvedMonth {
  year: number;
  month: number;
}

interface RawMonthSpan {
  rangeId: string;
  label: string;
  displayType?: string;
  startDate: string;
  endDate: string;
  startMonthIndex: number;
  endMonthIndex: number;
  clippedStart: boolean;
  clippedEnd: boolean;
}

/**
 * MonthTimeline — month-column layout data for horizontal timeline views.
 */
export class MonthTimeline {
  months: TimelineMonth[];
  spans: MonthSpanInfo[];

  constructor(config: MonthTimelineConfig) {
    const resolvedMonths = this.resolveWindow(config);
    const evaluator = new RangeEvaluator(config.userTimezone);

    this.months = this.generateMonths(resolvedMonths, config.locale);
    this.spans = this.computeMonthSpans(config.ranges, evaluator);
  }

  /**
   * Returns the column index and fractional offset (0–1) for a specific date
   * within the timeline. Returns null if the date falls outside the window.
   *
   * The fraction is a start-of-day offset: first day → 0.0, last day → (N-1)/N.
   */
  getDatePosition(date: string): { monthIndex: number; fraction: number } | null {
    const month = this.months.find((m) => date >= m.startDate && date <= m.endDate);
    if (!month) return null;

    const { year, month: monthIndex, day } = parseDate(date);
    const total = daysInMonth(year, monthIndex);

    return {
      monthIndex: month.index,
      // Start-of-day offset: first day is 0, last day is (total - 1) / total.
      fraction: (day - 1) / total,
    };
  }

  private resolveWindow(config: MonthTimelineConfig): ResolvedMonth[] {
    const { startDate, numberOfMonths, endDate } = config;

    if (numberOfMonths === undefined && endDate === undefined) {
      throw new Error('MonthTimeline: provide numberOfMonths or endDate (or both)');
    }

    if (numberOfMonths !== undefined && numberOfMonths < 1) {
      throw new Error('MonthTimeline: numberOfMonths must be >= 1');
    }

    const { year: startYear, month: startMonth } = parseDate(startDate);

    if (endDate !== undefined) {
      const { year: endYear, month: endMonth } = parseDate(endDate);
      const count = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

      if (count < 1) {
        throw new Error('MonthTimeline: endDate must be on or after startDate');
      }

      return this.monthRange(startYear, startMonth, count);
    }

    return this.monthRange(startYear, startMonth, numberOfMonths!);
  }

  private monthRange(startYear: number, startMonth: number, count: number): ResolvedMonth[] {
    const result: ResolvedMonth[] = [];

    for (let i = 0; i < count; i++) {
      const totalMonths = startMonth + i;
      result.push({
        year: startYear + Math.floor(totalMonths / 12),
        month: totalMonths % 12,
      });
    }

    return result;
  }

  private generateMonths(window: ResolvedMonth[], locale?: string): TimelineMonth[] {
    const shortFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
    const longFormatter = new Intl.DateTimeFormat(locale, { month: 'long' });

    return window.map(({ year, month }, index) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = daysInMonth(year, month);

      return {
        index,
        month,
        year,
        label: shortFormatter.format(firstDay),
        fullLabel: longFormatter.format(firstDay),
        startDate: formatDate(firstDay),
        endDate: formatDate(new Date(year, month, lastDay)),
      };
    });
  }

  private computeMonthSpans(ranges: DateRange[], evaluator: RangeEvaluator): MonthSpanInfo[] {
    if (this.months.length === 0 || ranges.length === 0) return [];

    const windowStart = this.months[0].startDate;
    const windowEnd = this.months[this.months.length - 1].endDate;
    const rawSpans: RawMonthSpan[] = [];
    const rangesById = new Map(ranges.map((range) => [range.id, range]));
    const resolved = evaluator.computeSpans(
      ranges,
      buildDate(windowStart, null),
      buildDate(windowEnd, null),
    );

    for (const span of resolved) {
      const sourceRange = rangesById.get(span.rangeId);
      if (!sourceRange) continue;

      const startMonthIndex = this.dateToMonthIndex(span.startDate);
      const endMonthIndex = this.dateToMonthIndex(span.endDate);

      if (startMonthIndex === null || endMonthIndex === null) continue;

      rawSpans.push({
        rangeId: span.rangeId,
        label: span.label,
        ...(span.displayType !== undefined ? { displayType: span.displayType } : {}),
        startDate: span.startDate,
        endDate: span.endDate,
        startMonthIndex,
        endMonthIndex,
        clippedStart: this.isClippedStart(sourceRange, span.startDate, windowStart),
        clippedEnd: this.isClippedEnd(sourceRange, span.endDate, windowEnd),
      });
    }

    if (rawSpans.length === 0) return [];

    const sortedSpans = [...rawSpans].sort((a, b) => {
      const startCmp = compareDates(a.startDate, b.startDate);
      if (startCmp !== 0) return startCmp;
      return compareDates(a.endDate, b.endDate);
    });
    const laneEndDates: string[] = [];

    return sortedSpans.map((span) => {
      let lane = laneEndDates.findIndex((endDate) => compareDates(endDate, span.startDate) < 0);

      if (lane === -1) {
        lane = laneEndDates.length;
        laneEndDates.push(span.endDate);
      } else {
        laneEndDates[lane] = span.endDate;
      }

      return {
        rangeId: span.rangeId,
        label: span.label,
        ...(span.displayType !== undefined ? { displayType: span.displayType } : {}),
        startMonthIndex: span.startMonthIndex,
        endMonthIndex: span.endMonthIndex,
        clippedStart: span.clippedStart,
        clippedEnd: span.clippedEnd,
        lane,
      };
    });
  }

  private dateToMonthIndex(date: string): number | null {
    const { year, month } = parseDate(date);
    return this.months.find((m) => m.year === year && m.month === month)?.index ?? null;
  }

  private isClippedStart(range: DateRange, spanStart: string, windowStart: string): boolean {
    if (compareDates(spanStart, windowStart) !== 0) return false;

    if (range.fromDate) {
      return compareDates(range.fromDate, windowStart) < 0;
    }

    if (range.dates) {
      return range.dates.some((date) => compareDates(date, windowStart) < 0);
    }

    return true;
  }

  private isClippedEnd(range: DateRange, spanEnd: string, windowEnd: string): boolean {
    if (compareDates(spanEnd, windowEnd) !== 0) return false;

    if (range.toDate) {
      return compareDates(range.toDate, windowEnd) > 0;
    }

    if (range.dates) {
      return range.dates.some((date) => compareDates(date, windowEnd) > 0);
    }

    return true;
  }
}
