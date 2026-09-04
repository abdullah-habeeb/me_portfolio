import { createFileRoute } from "@tanstack/react-router";

import { AdminRoot } from "@/components/admin/AdminRoot";

export const Route = createFileRoute("/admin")({
  component: AdminRoot,
  head: () => ({
    meta: [{ title: "Portfolio CMS" }],
  }),
});
