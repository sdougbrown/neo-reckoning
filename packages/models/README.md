# @neo-reckoning/models

Framework-neutral derived models and controller helpers built on top of [@neo-reckoning/core](https://www.npmjs.com/package/@neo-reckoning/core).

This package is intended for:

- adapter packages like `@neo-reckoning/react`
- advanced consumers who want ergonomic pure functions without committing to a UI framework adapter

## Install

```
npm install @neo-reckoning/models @neo-reckoning/core
```

## What it provides

- Calendar model builders and navigation helpers
- Event normalization helpers
- Range evaluation helpers
- Timeline/day-detail derived models
- Conflict, free-slot, span, schedule-score, and year-grid derived models

## Example

```typescript
import { buildCalendarModel, createCalendarController } from '@neo-reckoning/models';

const model = buildCalendarModel({
  focusDate: '2026-03-15',
  numberOfMonths: 1,
  ranges: myRanges,
  fidelity: 'month',
});

const controller = createCalendarController({
  focusDate: model.focusDate,
});
```
