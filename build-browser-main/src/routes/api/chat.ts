import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { createGeminiProvider } from "@/lib/gemini.server";
import { getMergedContent } from "@/lib/content-server";
import { buildSystemPrompt, type ContextKey } from "@/lib/portfolio-content";

type ChatRequestBody = { messages?: unknown; context?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, context } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
          return new Response("Missing GEMINI_API_KEY", { status: 500 });
        }
        const ctx = typeof context === "string" ? (context as ContextKey) : null;
        const content = await getMergedContent();
        const gemini = createGeminiProvider(key);
        const result = streamText({
          model: gemini("gemini-3.6-flash"),
          system: buildSystemPrompt(ctx, content),
          messages: await convertToModelMessages(messages as UIMessage[]),
        });
        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
