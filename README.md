# neo-reckoning

Headless calendar state management for modern web and mobile apps. A spiritual successor to [reckoning](https://github.com/sdougbrown/reckoning), rebuilt in TypeScript with sub-day time support, timezone handling, and scheduling intelligence.

## Packages

| Package | Description | npm |
|---|---|---|
| [`@neo-reckoning/core`](packages/core) | Zero-dependency computation library. DateRange evaluation, calendar grids, timeline positioning, conflict detection, free slot finding, schedule scoring. | [![npm](https://img.shields.io/npm/v/@neo-reckoning/core)](https://www.npmjs.com/package/@neo-reckoning/core) |
| [`@neo-reckoning/react`](packages/react) | Headless React hooks. 9 hooks wrapping core — no DOM, no CSS. | [![npm](https://img.shields.io/npm/v/@neo-reckoning/react)](https://www.npmjs.com/package/@neo-reckoning/react) |
| [`@neo-reckoning/ical`](packages/ical) | Browser-compatible .ics parsing adapter. Planned — types stubbed. | [![npm](https://img.shields.io/npm/v/@neo-reckoning/ical)](https://www.npmjs.com/package/@neo-reckoning/ical) |

## What this is

Neo-reckoning is a **computation library**, not a UI library. It answers questions like:

- Does this date/time fall within a range?
- What does a month grid look like with these ranges applied?
- Where are the conflicts in this schedule?
- Where can I fit a 30-minute meeting this week?
- How fragmented is this schedule? How many focus blocks are there?

Your app — whether React, React Native, Vue, or vanilla JS — provides the rendering. Neo-reckoning provides the data.

## Key features

- **DateRange model** with day-level recurrence (everyWeekday, everyDate, everyMonth) and sub-day recurrence (everyHour or startTime/repeatEvery)
- **Timezone-aware** — UTC ranges converted to local time via `Intl.DateTimeFormat`, floating times pass through unchanged
- **View fidelity** — compute only what you need: year view skips time slots, month view skips them too, week/day compute everything
- **Span detection** with lane assignment for consistent multi-day bar rendering
- **Conflict detection** and **free slot finding** for scheduling intelligence
- **Schedule scoring** — conflicts, free time, focus blocks, context switches
- **No styling opinions** — outputs range IDs, not colors. Your palette system handles theming.
- **162 tests** covering recurrence edge cases, DST transitions, timezone conversion, overlap detection

## Quick start

```
npm install @neo-reckoning/core @neo-reckoning/react
```

```typescript
import { useCalendar, useConflicts, useFreeSlots } from '@neo-reckoning/react';

// Build a month grid
const { months, next, prev } = useCalendar({
  focusDate: '2026-03-15',
  numberOfMonths: 1,
  ranges: myRanges,
  fidelity: 'month',
});

// Find conflicts
const conflicts = useConflicts({ ranges: myRanges, from, to });

// Find free time
const freeSlots = useFreeSlots({
  ranges: myRanges,
  date: '2026-03-23',
  minDuration: 30,
  dayStart: '09:00',
  dayEnd: '17:00',
});
```

See individual package READMEs for full API documentation.

## Monorepo

Built with Yarn workspaces and Turborepo.

```bash
yarn install          # install all dependencies
yarn turbo run build  # build all packages
yarn turbo run test   # run all 162 tests
```

## License

MIT
