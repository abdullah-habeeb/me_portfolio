import { createFileRoute } from "@tanstack/react-router";

import { isAuthorized } from "@/lib/admin-auth.server";
import { applyMutation, ContentMutationError, type MutationInput } from "@/lib/content-server";

export const Route = createFileRoute("/api/admin/mutate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthorized(request)) {
          return new Response(JSON.stringify({ ok: false, error: "Unauthorized." }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        let body: MutationInput;
        try {
          body = (await request.json()) as MutationInput;
        } catch {
          return new Response(JSON.stringify({ ok: false, error: "Malformed request body." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        try {
          const content = await applyMutation(body);
          return new Response(JSON.stringify({ ok: true, content }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          const message = err instanceof ContentMutationError || err instanceof Error ? err.message : "Invalid request.";
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
