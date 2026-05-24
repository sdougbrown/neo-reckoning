---
"@daywatch/cal": patch
"@daywatch/ical": patch
"@daywatch/mcp": patch
---

Implement `fixedBetween` semantics in both evaluators

`fixedBetween: true` on a `DateRange` now correctly matches every day between `fromDate` and `toDate`, bypassing recurrence filters (`everyWeekday`, `everyDate`, `everyMonth`) while still respecting exclusions (`exceptDates`, `exceptBetween`). Previously this property was only used by the iCal RRULE mapper and was silently ignored at evaluation time.

Fixes #16.
