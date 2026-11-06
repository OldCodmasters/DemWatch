import { defineEval } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "Loads roster and reports X credential status without inventing posts.",
  async test(t) {
    await t.send(
      "Call list_roster and x_credentials_status. Do not invent any tweets. Summarize roster count and whether a bearer token is configured.",
    );
    t.succeeded();
    t.calledTool("list_roster");
    t.calledTool("x_credentials_status");
    t.notCalledTool("write_x_batch");
  },
});
