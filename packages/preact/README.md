# @daywatch/cal-preact

Headless Preact hooks for calendar state management. Built on [@daywatch/cal](https://www.npmjs.com/package/@daywatch/cal) and [@daywatch/cal-models](https://www.npmjs.com/package/@daywatch/cal-models).

All hooks return data structures only. No DOM, no components, no CSS.

## Install

```
npm install @daywatch/cal-preact @daywatch/cal preact
```

If you want framework-neutral derived helpers without hooks, use `@daywatch/cal-models` directly.

This package also includes controlled selection hooks: `useDateSelection` for date-range picking and `useTimeSelection` for time-block picking.

See [examples/preact/](../../examples/preact/) for complete reference components built from those hooks.
