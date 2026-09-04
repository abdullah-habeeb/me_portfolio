import { createFileRoute } from "@tanstack/react-router";

import { buildSessionCookie, createSessionToken, verifyAdminPassword } from "@/lib/admin-auth.server";

type LoginBody = { password?: unknown };

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
          return new Response(JSON.stringify({ ok: false, error: "Admin login is not configured on this server." }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const { password } = (await request.json()) as LoginBody;
        if (typeof password !== "string" || !verifyAdminPassword(password)) {
          return new Response(JSON.stringify({ ok: false, error: "Incorrect password." }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const token = createSessionToken();
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "set-cookie": buildSessionCookie(token, request.url),
          },
        });
      },
    },
  },
});
