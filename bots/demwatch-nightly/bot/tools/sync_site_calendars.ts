import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { INGEST_ROOT, SITE_ROOT } from "../lib/ingest.js";

export default defineTool({
  description: prompt`
    If the DemWatch site checkout exists, copy merged/calendars.json into
    src/data/calendars.json. Otherwise report the store-only path for operators.
  `,
  effect: "idempotent",
  async execute() {
    const source = join(INGEST_ROOT, "merged", "calendars.json");
    const siteCalendars = join(SITE_ROOT, "src", "data", "calendars.json");
    const sitePresent = existsSync(SITE_ROOT);

    if (!existsSync(source)) {
      return {
        ok: false as const,
        sitePresent,
        error: `missing merged calendars at ${source}; run merge_ingest first`,
      };
    }

    if (!sitePresent) {
      return {
        ok: true as const,
        synced: false,
        sitePresent: false,
        source,
        hint: `Site not at ${SITE_ROOT}. Point DEMWATCH_SITE_ROOT at the checkout, or load ${source} from the sibling DemWatch machine.`,
      };
    }

    mkdirSync(dirname(siteCalendars), { recursive: true });
    copyFileSync(source, siteCalendars);
    return {
      ok: true as const,
      synced: true,
      sitePresent: true,
      source,
      destination: siteCalendars,
    };
  },
});
