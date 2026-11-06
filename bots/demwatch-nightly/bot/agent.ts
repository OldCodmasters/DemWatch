import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  name: "demwatch-nightly",
  description:
    "Nightly 11 PM America/Chicago merge of X + news ingest into DemWatch calendars and a short run report.",
  model: {
    id: "grok-4.7",
    params: [
      { id: "reasoning_effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
});
