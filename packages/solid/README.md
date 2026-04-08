# @daywatch/cal-solid

Reactive Solid primitives for calendar state management. Built on [@daywatch/cal](https://www.npmjs.com/package/@daywatch/cal) and [@daywatch/cal-models](https://www.npmjs.com/package/@daywatch/cal-models).

This package exposes idiomatic `create*` helpers backed by Solid's reactive system.

## Install

```
npm install @daywatch/cal-solid @daywatch/cal solid-js
```

If you want framework-neutral derived helpers without reactive wrappers, use `@daywatch/cal-models` directly.

This package also includes `createDateSelection` and `createTimeSelection` for controlled date-range and time-block interactions.

See [examples/solid/](../../examples/solid/) for complete reference components built from those primitives.
