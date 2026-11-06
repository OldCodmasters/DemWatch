# DemWatch Agent SDK bots

Three Grok / Agent SDK (`@grok/agent-sdk@0.6.0`) bots that feed DemWatch controversy calendars and pursuing goals. **Sourced only** — never invent events.

| Bot | Role | Schedule |
|-----|------|----------|
| `demwatch-x-watch/` | Scan X for roster officials; write sourced tweet items | Manual / playground |
| `demwatch-news-ingest/` | Search/check news; write sourced news/speech/bill/trend items | Manual / playground |
| `demwatch-nightly/` | Merge X+news → calendars + report | **11:00 PM America/Chicago** (`bot/schedules/nightly-merge.md`) |

## Shared ingest

Default root: `/cursor/stores/self/internal/bot-ingest/` (Project store when DemWatch site and bots run on separate VMs).

Override with `DEMWATCH_INGEST_ROOT`. Site checkout override: `DEMWATCH_SITE_ROOT` (in this monorepo, set to the repo root so nightly can sync `src/data/calendars.json`).

Event shape matches `src/data/calendars.json` — see `docs/` preferences and controversy-calendar notes in the Project store.

## Local run

```bash
cd bots/demwatch-x-watch && npm install
npx --yes "@grok/agent-sdk@0.6.0" validate --dir .
npx --yes "@grok/agent-sdk@0.6.0" dev
# playground: http://127.0.0.1:3000/playground
```

Nightly schedules do not auto-fire under `--dev`. Dispatch:

```bash
curl -X POST http://127.0.0.1:3000/demwatch-nightly/v1/dev/schedules/nightly-merge
```

## Secrets

Copy `bots/.env.example` → `bots/<bot>/.env` (gitignored). Never commit values.

| Secret | Bot | How |
|--------|-----|-----|
| `X_BEARER_TOKEN` | demwatch-x-watch | Local `.env` or `printf %s "$TOKEN" \| npx --yes "@grok/agent-sdk@0.6.0" secret set demwatch-x-watch X_BEARER_TOKEN` after deploy |

## Deploy

Deploy each project directory separately (`bots/demwatch-nightly` first, then x-watch, then news-ingest). Requires a Cursor service account and a pushed git ref of this repo. See Project store doc `docs/demwatch-bots.md`.
