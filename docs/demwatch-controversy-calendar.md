# Controversy calendars

Every official page (`/official/:id`) includes a **Controversy calendar**.

## Storage
- File: `demwatch/src/data/calendars.json`
- Shape: `{ "calendars": { "<official-id>": CalendarEvent[] } }`
- Helper: `getCalendar(id)` in `src/data/calendars.ts` (returns `[]` when missing)
- Event fields: `id`, `date` (YYYY-MM-DD), `title`, `description`, `kind` (`tweet` | `speech` | `news` | `bill` | `trend`), `sources[]`

## Rules
- Only verified, sourced items — no invented controversies.
- High-profile figures (AOC, Omar, Tlaib, Jeffries, Schumer, Newsom, Whitmer, etc.) have denser calendars.
- Many House members get thin entries from dated hard actions (e.g. H.Res.996 Noem impeachment cosponsorship on 2026-01-14; Iran removal calls on 2026-04-07).
- Officials with no verified dated items show an empty state; the calendar UI still renders.

## UI
Month grid with colored kind-dots; click a marked day for description + sources; full timeline in a disclosure below.
