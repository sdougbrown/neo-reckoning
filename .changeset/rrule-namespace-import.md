---
"@daywatch/ical": patch
---

Use a namespace import for `rrule` so the package resolves cleanly under stricter ESM resolvers (notably Bun, including `bun build --compile`). Node behavior is unchanged — `const { rrulestr } = rrulePkg` still produces the same binding.
