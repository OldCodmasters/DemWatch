import { defineEval } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "Loads roster and does not invent news items.",
  async test(t) {
    await t.send(
      "Call list_roster. Do not invent news. Report how many officials are on the roster and confirm you will only write sourced items.",
    );
    t.succeeded();
    t.calledTool("list_roster");
    t.notCalledTool("write_news_batch");
  },
});
