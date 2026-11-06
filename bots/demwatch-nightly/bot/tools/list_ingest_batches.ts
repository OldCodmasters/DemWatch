import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import { INGEST_ROOT, listBatchFiles, readJson, type BatchEnvelope } from "../lib/ingest.js";

export default defineTool({
  description: prompt`
    List dated X and news batch files in the shared ingest root, with item counts.
  `,
  effect: "read",
  async execute() {
    const summarize = (kind: "x" | "news") =>
      listBatchFiles(kind).map((path) => {
        const batch = readJson<BatchEnvelope>(path, {
          runAt: "",
          agent: "",
          items: [],
        });
        return {
          path,
          runAt: batch.runAt,
          agent: batch.agent,
          itemCount: batch.items.length,
        };
      });
    return {
      ingestRoot: INGEST_ROOT,
      x: summarize("x"),
      news: summarize("news"),
    };
  },
});
