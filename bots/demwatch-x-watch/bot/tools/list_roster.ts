import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import { INGEST_ROOT, loadRoster, rosterPath } from "../lib/ingest.js";

export default defineTool({
  description: prompt`
    Load the DemWatch roster from shared ingest (ids, names, xHandle).
    Use this before scanning X for officials.
  `,
  effect: "read",
  async execute() {
    const officials = loadRoster();
    return {
      ingestRoot: INGEST_ROOT,
      rosterPath: rosterPath(),
      count: officials.length,
      officials,
      hint:
        officials.length === 0
          ? "roster.json missing or empty — copy roster.example.json to roster.json and fill handles."
          : undefined,
    };
  },
});
