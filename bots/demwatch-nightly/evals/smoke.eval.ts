import { defineEval } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "Checks Chicago time and lists ingest batches without inventing events.",
  async test(t) {
    await t.send(
      "This is a manual playground smoke (not a schedule fire). Call chicago_time_check and list_ingest_batches. Do not invent calendar events. Summarize what you see.",
    );
    t.succeeded();
    t.calledTool("chicago_time_check");
    t.calledTool("list_ingest_batches");
    t.notCalledTool("write_run_report");
  },
});
