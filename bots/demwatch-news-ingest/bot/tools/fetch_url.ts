import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";

const MAX_CHARS = 20_000;

export default defineTool({
  description: prompt`
    Fetch a public HTTP(S) URL and return truncated text for verification.
    Use only for source pages you intend to cite. Do not invent content if fetch fails.
  `,
  effect: "read",
  inputSchema: z.object({
    url: z.string().url(),
  }),
  async execute({ url }) {
    if (url.startsWith("file:")) {
      return { ok: false as const, url, error: "file URLs are not allowed" };
    }
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": "demwatch-news-ingest/0.1 (+agent-sdk)" },
      });
      const raw = await res.text();
      const text = raw
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAX_CHARS);
      return {
        ok: res.ok,
        url,
        status: res.status,
        truncated: text.length >= MAX_CHARS,
        text,
      };
    } catch (err) {
      return {
        ok: false as const,
        url,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
});
