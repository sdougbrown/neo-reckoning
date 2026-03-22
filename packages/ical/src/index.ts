/**
 * @neo-reckoning/ical — Browser-compatible iCal parsing adapter.
 *
 * This package is Phase 4 of the neo-reckoning build plan.
 * It will parse .ics text (fetched via the day-planner-api proxy)
 * and produce CalendarEvent[] for the rendering pipeline.
 *
 * Dependencies (to be added):
 * - ical.js (Mozilla's browser-compatible parser)
 * - rrule (RRULE expansion)
 *
 * See PLAN-neo-reckoning.md Phase 4 for full spec.
 */

export type { CacheAdapter } from '@neo-reckoning/core';

// Placeholder exports — implementation in Phase 4
// export function parseICS(icsText: string, window: { from: Date; to: Date }): CalendarEvent[];
// export async function fetchAndParse(proxyUrl: string, window: { from: Date; to: Date }, options?: { cache?: CacheAdapter; cacheTTL?: number }): Promise<CalendarEvent[]>;
