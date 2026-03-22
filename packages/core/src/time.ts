/**
 * Internal time/date utilities for neo-reckoning.
 * Uses Intl.DateTimeFormat for timezone conversion — no external dependencies.
 */

/** Parse "HH:mm" into { hour, minute } */
export function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: h, minute: m };
}

/** Format { hour, minute } into "HH:mm" */
export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** Convert minutes since midnight to "HH:mm" */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return formatTime(h, m);
}

/** Convert "HH:mm" to minutes since midnight */
export function timeToMinutes(time: string): number {
  const { hour, minute } = parseTime(time);
  return hour * 60 + minute;
}

/** Add minutes to a time string, clamping at 24:00. Returns null if result >= 24:00. */
export function addMinutes(time: string, minutes: number): string | null {
  const total = timeToMinutes(time) + minutes;
  if (total >= 1440) return null; // past midnight
  return minutesToTime(total);
}

/** Parse "YYYY-MM-DD" into { year, month, day } */
export function parseDate(date: string): { year: number; month: number; day: number } {
  const [y, m, d] = date.split('-').map(Number);
  return { year: y, month: m - 1, day: d }; // month is 0-indexed like JS Date
}

/** Format a Date to "YYYY-MM-DD" */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get the day of week (0=Sunday) for a "YYYY-MM-DD" string */
export function getDayOfWeek(dateStr: string): number {
  const { year, month, day } = parseDate(dateStr);
  return new Date(year, month, day).getDay();
}

/** Get the number of days in a given month (0-indexed month) */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Compare two "YYYY-MM-DD" strings. Returns -1, 0, or 1. */
export function compareDates(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Generate all dates (as "YYYY-MM-DD") between from and to, inclusive. */
export function dateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const { year: fy, month: fm, day: fd } = parseDate(from);
  const { year: ty, month: tm, day: td } = parseDate(to);
  const start = new Date(fy, fm, fd);
  const end = new Date(ty, tm, td);

  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/** Get today's date as "YYYY-MM-DD" in a given timezone (or local if not specified). */
export function getToday(timezone?: string): string {
  if (timezone) {
    return formatDateInTimezone(new Date(), timezone);
  }
  return formatDate(new Date());
}

/**
 * Format a Date as "YYYY-MM-DD" in a specific timezone using Intl.DateTimeFormat.
 */
export function formatDateInTimezone(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // en-CA gives YYYY-MM-DD format
  return formatter.format(date);
}

/**
 * Get the hour and minute of a Date in a specific timezone.
 */
export function getTimeInTimezone(date: Date, timezone: string): { hour: number; minute: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hour = Number(parts.find(p => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find(p => p.type === 'minute')?.value ?? 0);
  return { hour, minute };
}

/**
 * Convert a time from one timezone to another on a given date.
 * Returns the converted time as "HH:mm", or null if the time doesn't exist
 * (e.g., spring-forward DST gap).
 */
export function convertTime(
  dateStr: string,
  time: string,
  fromTimezone: string,
  toTimezone: string,
): string | null {
  if (fromTimezone === toTimezone) return time;

  const { year, month, day } = parseDate(dateStr);
  const { hour, minute } = parseTime(time);

  // Create a Date in the source timezone by using a known UTC offset approach.
  // We build a UTC date then adjust based on the source timezone offset.
  const utcDate = new Date(Date.UTC(year, month, day, hour, minute));

  // Get the offset of the source timezone at this time
  const sourceOffset = getTimezoneOffset(utcDate, fromTimezone);
  // Adjust to actual UTC
  const actualUtc = new Date(utcDate.getTime() + sourceOffset * 60000);

  // Now get the time in the target timezone
  const targetTime = getTimeInTimezone(actualUtc, toTimezone);

  // Check if the source time actually exists (DST spring-forward gap)
  const verifyTime = getTimeInTimezone(actualUtc, fromTimezone);
  if (verifyTime.hour !== hour || verifyTime.minute !== minute) {
    return null; // Time doesn't exist in source timezone (DST gap)
  }

  return formatTime(targetTime.hour, targetTime.minute);
}

/**
 * Get the UTC offset of a timezone in minutes at a given instant.
 * Positive means behind UTC (e.g., UTC-5 returns 300).
 */
function getTimezoneOffset(date: Date, timezone: string): number {
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr = date.toLocaleString('en-US', { timeZone: timezone });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (utcDate.getTime() - tzDate.getTime()) / 60000;
}

/**
 * Build a Date object from a date string and time string in a given timezone.
 * If timezone is null/undefined (floating), uses local time.
 */
export function buildDate(dateStr: string, time: string | null, timezone?: string | null): Date {
  const { year, month, day } = parseDate(dateStr);

  if (!time) {
    return new Date(year, month, day);
  }

  const { hour, minute } = parseTime(time);

  if (!timezone) {
    // Floating — local time
    return new Date(year, month, day, hour, minute);
  }

  if (timezone === 'UTC') {
    return new Date(Date.UTC(year, month, day, hour, minute));
  }

  // Specific timezone — build via UTC offset
  const utcGuess = new Date(Date.UTC(year, month, day, hour, minute));
  const offset = getTimezoneOffset(utcGuess, timezone);
  return new Date(utcGuess.getTime() + offset * 60000);
}
