import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import { chicagoHourNow } from "../lib/ingest.js";

export default defineTool({
  description: prompt`
    Return the current America/Chicago local hour and whether it is 11 PM CT
    (the nightly window). Schedule fires at 04:00 and 05:00 UTC; only one should proceed.
  `,
  effect: "read",
  async execute() {
    const now = new Date();
    const hour = chicagoHourNow(now);
    return {
      isoUtc: now.toISOString(),
      chicagoHour: hour,
      isElevenPmChicago: hour === 23,
      timezone: "America/Chicago",
    };
  },
});
