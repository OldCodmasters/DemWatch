/**
 * Shared ingest path helpers for DemWatch bots.
 * Each bot copies or imports this into bot/lib/ingest.ts (package boundary).
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const INGEST_ROOT =
  process.env.DEMWATCH_INGEST_ROOT ??
  "/cursor/stores/self/internal/bot-ingest";

export const SITE_ROOT =
  process.env.DEMWATCH_SITE_ROOT ?? "/agent/demwatch";

export type Source = { label: string; url: string };

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  kind: "tweet" | "speech" | "news" | "bill" | "trend";
  sources: Source[];
  officialId?: string;
  engagement?: {
    likes?: number;
    replies?: number;
    reposts?: number;
    quotes?: number;
    views?: number;
  };
  pursuing?: { goal: string; sources: Source[] };
};

export type BatchEnvelope = {
  runAt: string;
  agent: string;
  notes?: string;
  items: CalendarEvent[];
};

export type RosterOfficial = {
  id: string;
  name: string;
  chamber?: string;
  state?: string;
  district?: string;
  xHandle?: string;
};

export function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function writeJson(path: string, value: unknown): void {
  ensureDir(join(path, ".."));
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function rosterPath(): string {
  return join(INGEST_ROOT, "roster.json");
}

export function loadRoster(): RosterOfficial[] {
  const data = readJson<{ officials?: RosterOfficial[] }>(rosterPath(), {
    officials: [],
  });
  return data.officials ?? [];
}

export function batchPath(kind: "x" | "news", date = todayUtc()): string {
  return join(INGEST_ROOT, kind, `${date}.json`);
}

export function mergeBatch(
  path: string,
  agent: string,
  items: CalendarEvent[],
  notes?: string,
): BatchEnvelope {
  const existing = readJson<BatchEnvelope>(path, {
    runAt: new Date().toISOString(),
    agent,
    items: [],
  });
  const byId = new Map<string, CalendarEvent>();
  for (const item of existing.items) byId.set(item.id, item);
  for (const item of items) byId.set(item.id, item);
  const next: BatchEnvelope = {
    runAt: new Date().toISOString(),
    agent,
    notes: notes ?? existing.notes,
    items: [...byId.values()].sort((a, b) =>
      a.date === b.date ? a.id.localeCompare(b.id) : a.date.localeCompare(b.date),
    ),
  };
  writeJson(path, next);
  return next;
}

export function listBatchFiles(kind: "x" | "news"): string[] {
  const dir = join(INGEST_ROOT, kind);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => join(dir, f));
}

export function chicagoHourNow(now = new Date()): number {
  const raw = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    hourCycle: "h23",
  }).format(now);
  return Number(raw);
}
