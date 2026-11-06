import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  name: "demwatch-news-ingest",
  description:
    "Search and check news about the DemWatch roster; write structured sourced items into shared ingest.",
  model: {
    id: "grok-4.7",
    params: [
      { id: "reasoning_effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
});
