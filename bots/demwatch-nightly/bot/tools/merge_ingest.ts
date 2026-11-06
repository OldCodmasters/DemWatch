import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import { join } from "node:path";
import {
  INGEST_ROOT,
  listBatchFiles,
  readJson,
  writeJson,
  type BatchEnvelope,
  type CalendarEvent,
  type Source,
} from "../lib/ingest.js";

type PursuingEntry = {
  id: string;
  goal: string;
  date?: string;
  sources: Source[];
};

function isValid(item: CalendarEvent): boolean {
  return Boolean(
    item.id &&
      item.date &&
      item.title &&
      item.kind &&
      item.officialId &&
      Array.isArray(item.sources) &&
      item.sources.length > 0 &&
      item.sources.every((s) => s.label && s.url),
  );
}

export default defineTool({
  description: prompt`
    Merge all x/ and news/ batch files into merged/calendars.json and
    merged/pursuing.json. Drops unsourced or incomplete items. Idempotent rebuild.
  `,
  effect: "idempotent",
  async execute() {
    const byOfficial = new Map<string, Map<string, CalendarEvent>>();
    const pursuingByOfficial = new Map<string, Map<string, PursuingEntry>>();
    let scanned = 0;
    let kept = 0;
    let dropped = 0;

    for (const kind of ["x", "news"] as const) {
      for (const path of listBatchFiles(kind)) {
        const batch = readJson<BatchEnvelope>(path, {
          runAt: "",
          agent: "",
          items: [],
        });
        for (const item of batch.items) {
          scanned += 1;
          if (!isValid(item) || !item.officialId) {
            dropped += 1;
            continue;
          }
          kept += 1;
          const bucket =
            byOfficial.get(item.officialId) ??
            new Map<string, CalendarEvent>();
          bucket.set(item.id, item);
          byOfficial.set(item.officialId, bucket);

          if (item.pursuing?.goal && item.pursuing.sources?.length) {
            const pBucket =
              pursuingByOfficial.get(item.officialId) ??
              new Map<string, PursuingEntry>();
            pBucket.set(item.id, {
              id: item.id,
              goal: item.pursuing.goal,
              date: item.date,
              sources: item.pursuing.sources,
            });
            pursuingByOfficial.set(item.officialId, pBucket);
          }
        }
      }
    }

    const calendars: Record<string, CalendarEvent[]> = {};
    for (const [officialId, map] of byOfficial) {
      calendars[officialId] = [...map.values()].sort((a, b) =>
        a.date === b.date
          ? a.id.localeCompare(b.id)
          : a.date.localeCompare(b.date),
      );
    }

    const pursuing: Record<string, PursuingEntry[]> = {};
    for (const [officialId, map] of pursuingByOfficial) {
      pursuing[officialId] = [...map.values()];
    }

    const calendarsPath = join(INGEST_ROOT, "merged", "calendars.json");
    const pursuingPath = join(INGEST_ROOT, "merged", "pursuing.json");
    writeJson(calendarsPath, { calendars });
    writeJson(pursuingPath, { pursuing });

    return {
      calendarsPath,
      pursuingPath,
      scanned,
      kept,
      dropped,
      officialCount: Object.keys(calendars).length,
    };
  },
});
