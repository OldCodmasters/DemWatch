import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";

export default defineTool({
  description: prompt`
    Check whether X API credentials are configured for this agent.
    Never prints secret values — only whether X_BEARER_TOKEN is set.
  `,
  effect: "read",
  async execute() {
    const hasBearer = Boolean(process.env.X_BEARER_TOKEN?.trim());
    return {
      hasBearer,
      envNames: ["X_BEARER_TOKEN"],
      nextStep: hasBearer
        ? "Bearer present. Use verified X evidence only; do not invent posts."
        : "Set secret X_BEARER_TOKEN via `agent-sdk secret set demwatch-x-watch X_BEARER_TOKEN` (piped stdin) or local .env — never paste the value in chat.",
    };
  },
});
