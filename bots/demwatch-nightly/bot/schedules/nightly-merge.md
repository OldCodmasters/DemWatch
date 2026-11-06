---
cron: "0 4,5 * * *"
---

Run the DemWatch nightly merge for **11:00 PM America/Chicago**.

Agent SDK schedules are UTC-only. This cron fires at 04:00 and 05:00 UTC so one hit lands on 23:00 Central (CDT or CST).

1. Call `chicago_time_check`. If `isElevenPmChicago` is false, reply exactly `skipped: not 11pm CT` and stop.
2. Otherwise follow your instructions: list batches → merge_ingest → sync_site_calendars → write_run_report.
3. Keep the final reply to a short run report (counts + blockers). Do not invent events.
