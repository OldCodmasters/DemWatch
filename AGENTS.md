# DemWatch — agent instructions

This repository is the **DemWatch** monorepo.

| Path | Purpose |
|------|---------|
| `/` (root) | Vite + React website (election / incumbent tracker) |
| `bots/` | Reserved for future bots (separate worker) |
| `docs/` | Coverage notes + Project preferences mirror |
| `.cursor/rules/` | Cursor project rules (always apply) |

## Must follow

Read and obey:

1. `.cursor/rules/demwatch.mdc`
2. `docs/preferences.md`

Highlights:

- Map-first home; no big DemWatch hero banner.
- Full voting House Democratic Caucus for “Already in office.”
- Sourced claims only; hard-quote **Pursuing** (no filler).
- Controversy calendars with dates + sources (no invented events).
- Titles only under modules — no how-to subtitles.

## Local site

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
