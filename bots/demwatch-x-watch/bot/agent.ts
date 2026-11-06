import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  name: "demwatch-x-watch",
  description:
    "Scan X/Twitter for DemWatch roster officials; flag sourced controversial posts into shared ingest.",
  model: {
    id: "grok-4.7",
    params: [
      { id: "reasoning_effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
  hosting: {
    secretNames: ["X_BEARER_TOKEN"],
    egressDomains: ["api.x.com", "api.twitter.com"],
  },
});
