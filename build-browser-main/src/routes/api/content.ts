import { createFileRoute } from "@tanstack/react-router";

import { getMergedContent } from "@/lib/content-server";

// Public, read-only. Returns the fully-merged content (seed data + admin
// overrides/additions - deletions) that the whole site renders from.
export const Route = createFileRoute("/api/content")({
  server: {
    handlers: {
      GET: async () => {
        const content = await getMergedContent();
        return new Response(JSON.stringify(content), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
