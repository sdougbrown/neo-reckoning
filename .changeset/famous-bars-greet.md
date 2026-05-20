---
"@daywatch/cal-rules": patch
"@daywatch/cal": patch
"@daywatch/ical": patch
---

`addMinutes("23:00", 120)` previously returned `null`, silently dropping end times that crossed midnight. Downstream, `endTime` became `null`, causing broken conflict detection, free-slot finding, and scoring.
