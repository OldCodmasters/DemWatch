import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import { join } from "node:path";
import { INGEST_ROOT, ensureDir, todayUtc } from "../lib/ingest.js";
import { writeFileSync } from "node:fs";

export default defineTool({
  description: prompt`
    Write a short Markdown nightly run report under merged/reports/YYYY-MM-DD.md.
  `,
  effect: "idempotent",
  inputSchema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    summary: z.string().min(1),
    scanned: z.number().int().nonnegative().optional(),
    kept: z.number().int().nonnegative().optional(),
    dropped: z.number().int().nonnegative().optional(),
    syncedToSite: z.boolean().optional(),
    blockers: z.array(z.string()).optional(),
  }),
  async execute({
    date,
    summary,
    scanned,
    kept,
    dropped,
    syncedToSite,
    blockers,
  }) {
    const day = date ?? todayUtc();
    const dir = join(INGEST_ROOT, "merged", "reports");
    ensureDir(dir);
    const path = join(dir, `${day}.md`);
    const lines = [
      `# DemWatch nightly report — ${day}`,
      "",
      summary,
      "",
      "## Counts",
      "",
      `- scanned: ${scanned ?? "n/a"}`,
      `- kept: ${kept ?? "n/a"}`,
      `- dropped: ${dropped ?? "n/a"}`,
      `- syncedToSite: ${syncedToSite ?? false}`,
      "",
      "## Blockers",
      "",
      ...(blockers && blockers.length
        ? blockers.map((b) => `- ${b}`)
        : ["- none"]),
      "",
    ];
    writeFileSync(path, `${lines.join("\n")}\n`, "utf8");
    return { path, date: day };
  },
});
