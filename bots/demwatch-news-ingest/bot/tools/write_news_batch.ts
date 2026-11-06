import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import {
  batchPath,
  mergeBatch,
  todayUtc,
  type CalendarEvent,
} from "../lib/ingest.js";

const Source = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

const Item = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1),
  description: z.string(),
  kind: z.enum(["news", "speech", "bill", "trend"]),
  sources: z.array(Source).min(1),
  officialId: z.string().min(1),
  pursuing: z
    .object({
      goal: z.string().min(1),
      sources: z.array(Source).min(1),
    })
    .optional(),
});

export default defineTool({
  description: prompt`
    Append or upsert verified news/speech/bill/trend items into the shared
    dated news batch. Requires real source URLs. Idempotent by item id.
  `,
  effect: "idempotent",
  inputSchema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    notes: z.string().optional(),
    items: z.array(Item).min(1),
  }),
  dryRunResult: ({ date, items }) => ({
    dryRun: true,
    path: batchPath("news", date ?? todayUtc()),
    itemCount: items.length,
  }),
  async execute({ date, notes, items }) {
    const day = date ?? todayUtc();
    const path = batchPath("news", day);
    const normalized = items as CalendarEvent[];
    const batch = mergeBatch(path, "demwatch-news-ingest", normalized, notes);
    return {
      path,
      itemCount: batch.items.length,
      writtenIds: normalized.map((i) => i.id),
    };
  },
});
