// Types
export type {
  DateRange,
  Occurrence,
  TimeSlot,
  DayRangeInfo,
  Day,
  Week,
  Month,
  CalendarEvent,
  PositionedEvent,
  TimelineSlot,
  CalendarGridConfig,
  TimelineGridConfig,
  CacheAdapter,
} from './types.js';

// Core classes
export { RangeEvaluator } from './evaluator.js';
export { CalendarGrid } from './grid.js';
export { TimelineGrid, computeEventPositions } from './timeline.js';

// Event normalization
export { fromDateRange, expandToEvents } from './events.js';

// Time utilities (exposed for consumers that need them)
export {
  parseTime,
  formatTime,
  timeToMinutes,
  minutesToTime,
  parseDate,
  formatDate,
  getDayOfWeek,
  daysInMonth,
  dateRange,
  getToday,
  convertTime,
  buildDate,
} from './time.js';
