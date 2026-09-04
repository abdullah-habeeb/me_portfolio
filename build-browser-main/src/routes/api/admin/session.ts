import { createFileRoute } from "@tanstack/react-router";

import { isAuthorized } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response(JSON.stringify({ authenticated: isAuthorized(request) }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
