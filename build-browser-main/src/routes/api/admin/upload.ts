import { createFileRoute } from "@tanstack/react-router";
import { put } from "@vercel/blob";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { isAuthorized } from "@/lib/admin-auth.server";
import { isVercelRuntime, setUploadedAssetUrl } from "@/lib/content-server";

// In local dev this writes straight into public/ at a fixed filename — the
// file is immediately served at its existing URL (/Abdullah_Resume.pdf,
// /abdullah.jpg), exactly as before. In production (Vercel), the
// filesystem isn't persistent across requests, so uploads go to Vercel
// Blob instead, each under a unique timestamped pathname (so the URL
// itself changes on every upload — simplest possible cache-busting, no
// stale CDN/browser copies to worry about), and the resulting URL is
// written into the content store so every page picks it up immediately.
const TARGETS: Record<string, { filename: string; extension: string; maxBytes: number; types: string[] }> = {
  resume: { filename: "Abdullah_Resume.pdf", extension: "pdf", maxBytes: 15 * 1024 * 1024, types: ["application/pdf"] },
  photo: { filename: "abdullah.jpg", extension: "jpg", maxBytes: 8 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp"] },
};

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthorized(request)) {
          return new Response(JSON.stringify({ ok: false, error: "Unauthorized." }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const form = await request.formData();
        const kind = form.get("kind");
        const file = form.get("file");
        if (typeof kind !== "string" || !(kind in TARGETS) || !(file instanceof File)) {
          return new Response(JSON.stringify({ ok: false, error: "Missing or invalid kind/file." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        const assetKind = kind as "resume" | "photo";

        const target = TARGETS[kind];
        if (!target.types.includes(file.type)) {
          return new Response(JSON.stringify({ ok: false, error: `Expected one of: ${target.types.join(", ")}` }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        if (file.size > target.maxBytes) {
          return new Response(JSON.stringify({ ok: false, error: "File too large." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const bytes = Buffer.from(await file.arrayBuffer());
        let url: string;

        if (isVercelRuntime()) {
          const blob = await put(`${kind}-${Date.now()}.${target.extension}`, bytes, {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: file.type,
          });
          url = blob.url;
          await setUploadedAssetUrl(assetKind, url);
        } else {
          const dest = path.resolve(process.cwd(), "public", target.filename);
          await writeFile(dest, bytes);
          url = `/${target.filename}`;
        }

        return new Response(JSON.stringify({ ok: true, url }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
