import { useQuery, useQueryClient } from "@tanstack/react-query";

import { SEED_ABOUT } from "@/data/about.seed";
import { SEED_CERTIFICATIONS } from "@/data/certifications.seed";
import { SEED_CONTACT } from "@/data/contact.seed";
import { SEED_COURSES } from "@/data/courses.seed";
import { SEED_EXPERIENCE } from "@/data/experience.seed";
import { SEED_PROJECTS } from "@/data/projects.seed";
import { SEED_RESEARCH } from "@/data/research.seed";
import { SEED_RESUME } from "@/data/resume.seed";
import { SEED_SKILL_GROUPS } from "@/data/skillGroups.seed";
import type { MergedContent } from "@/data/types";

// Client-safe fallback: exactly what's compiled into the app today. Used as
// `initialData` so the site never flashes empty while /api/content resolves,
// and works unchanged if the fetch fails for any reason.
export const SEED_CONTENT: MergedContent = {
  projects: SEED_PROJECTS,
  research: SEED_RESEARCH,
  certifications: SEED_CERTIFICATIONS,
  courses: SEED_COURSES,
  skillGroups: SEED_SKILL_GROUPS,
  about: SEED_ABOUT,
  experience: SEED_EXPERIENCE,
  contact: SEED_CONTACT,
  resume: SEED_RESUME,
};

export const CONTENT_QUERY_KEY = ["content"] as const;

async function fetchContent(): Promise<MergedContent> {
  const res = await fetch("/api/content");
  if (!res.ok) throw new Error("Failed to load content");
  return res.json();
}

export function useContent() {
  const query = useQuery({
    queryKey: CONTENT_QUERY_KEY,
    queryFn: fetchContent,
    // initialData paints the seed content instantly on first load — but it
    // must never be mistaken for "fresh": with a nonzero staleTime a fresh
    // page load would sit on that seed data for the whole staleTime window
    // (admin edits included) before ever fetching the real thing. Fetch on
    // every mount instead; the payload is tiny and same-origin.
    initialData: SEED_CONTENT,
    staleTime: 0,
    refetchOnMount: "always",
  });
  return query.data;
}

export function useInvalidateContent() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
}

// --- Admin mutations (client-side helpers for the GUI CMS) -----------------

export class AdminApiError extends Error {}

async function parseJsonOrThrow(res: Response): Promise<{ ok: boolean; error?: string; content?: MergedContent }> {
  const json = await res.json().catch(() => ({ ok: false, error: "Malformed server response." }));
  if (!res.ok || !json.ok) throw new AdminApiError(json.error ?? "Request failed.");
  return json;
}

export function useAdminMutate() {
  const queryClient = useQueryClient();
  return async (input: object): Promise<MergedContent> => {
    const res = await fetch("/api/admin/mutate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const json = await parseJsonOrThrow(res);
    // setQueryData is synchronous and immediately notifies every mounted
    // subscriber with the fresh merged content from the mutation response —
    // no need to wait on anything else. Fire an invalidation too (not
    // awaited — it must never block the caller) as a defensive background
    // reconciliation in case this response ever diverges from server state.
    queryClient.setQueryData(CONTENT_QUERY_KEY, json.content);
    void queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    return json.content!;
  };
}

export function useAdminUpload() {
  const queryClient = useQueryClient();
  return async (kind: "resume" | "photo", file: File): Promise<string> => {
    const form = new FormData();
    form.append("kind", kind);
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const json = await res.json().catch(() => ({ ok: false, error: "Malformed server response." }));
    if (!res.ok || !json.ok) throw new AdminApiError(json.error ?? "Upload failed.");
    // In production the URL genuinely changes on every upload (unique blob
    // pathname) and the server already persisted it — refetch so every
    // consumer (this form, the public site) picks it up immediately.
    void queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    return json.url as string;
  };
}

export async function adminLogin(password: string): Promise<void> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password }),
  });
  await parseJsonOrThrow(res);
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" });
}

export async function adminCheckSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/session");
    const json = (await res.json()) as { authenticated?: boolean };
    return !!json.authenticated;
  } catch {
    return false;
  }
}
