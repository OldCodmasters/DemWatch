# DemWatch

Interactive tracker for **2026 midterm Democratic winners** and **Democrats already in office** (Senate, House caucus, governors): map, promises, hard-goal Pursuing, vote history, and sourced controversy calendars.

## Layout

```
/
├── src/                 # Vite + React + TypeScript web app
├── public/              # portraits, map geometry
├── docs/                # preferences + coverage notes
├── .cursor/rules/       # Cursor project rules
├── bots/                # reserved — bots arrive from another worker
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

`bots/` is intentionally empty (placeholder README only). Bot packages will be added by a separate worker.
