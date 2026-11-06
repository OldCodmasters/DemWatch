# DemWatch

Interactive tracker for **2026 midterm Democratic winners** and **Democrats already in office** (Senate, House caucus, governors): map, promises, hard-goal Pursuing, vote history, and sourced controversy calendars.

## Layout

```
/
├── src/                 # Vite + React + TypeScript web app
├── public/              # portraits, map geometry
├── docs/                # preferences + coverage notes
├── .cursor/rules/       # Cursor project rules
├── bots/                # Agent SDK bots (X watch, news ingest, nightly merge)
├── AGENTS.md
└── package.json
```

## Run locally

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

## Project rules

See [`AGENTS.md`](./AGENTS.md), [`.cursor/rules/demwatch.mdc`](./.cursor/rules/demwatch.mdc), and [`docs/preferences.md`](./docs/preferences.md).

## Bots

Agent SDK projects live under [`bots/`](./bots/):

| Path | Role |
|------|------|
| `bots/demwatch-x-watch` | X/Twitter scan → sourced controversy items |
| `bots/demwatch-news-ingest` | News search/check → sourced calendar items |
| `bots/demwatch-nightly` | 11 PM America/Chicago merge → `calendars.json` + report |

Details: [`bots/README.md`](./bots/README.md).
