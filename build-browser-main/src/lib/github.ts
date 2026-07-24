import { useEffect, useState } from "react";

export type GithubRepoStats = {
  stars: number;
  forks: number;
  openIssues: number;
  pushedAt: string;
};

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes
const memoryCache = new Map<string, { data: GithubRepoStats; ts: number }>();

function readCache(repo: string): GithubRepoStats | null {
  const mem = memoryCache.get(repo);
  if (mem && Date.now() - mem.ts < CACHE_TTL_MS) return mem.data;
  try {
    const raw = window.sessionStorage.getItem(`gh:${repo}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: GithubRepoStats; ts: number };
    if (Date.now() - parsed.ts < CACHE_TTL_MS) {
      memoryCache.set(repo, parsed);
      return parsed.data;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeCache(repo: string, data: GithubRepoStats) {
  const entry = { data, ts: Date.now() };
  memoryCache.set(repo, entry);
  try {
    window.sessionStorage.setItem(`gh:${repo}`, JSON.stringify(entry));
  } catch {
    /* ignore */
  }
}

export function useGithubRepoStats(repo: string | null) {
  const [stats, setStats] = useState<GithubRepoStats | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    repo ? "loading" : "idle",
  );

  useEffect(() => {
    if (!repo) {
      setStatus("idle");
      return;
    }
    const cached = readCache(repo);
    if (cached) {
      setStats(cached);
      setStatus("ready");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const data: GithubRepoStats = {
          stars: json.stargazers_count ?? 0,
          forks: json.forks_count ?? 0,
          openIssues: json.open_issues_count ?? 0,
          pushedAt: json.pushed_at ?? "",
        };
        writeCache(repo, data);
        setStats(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [repo]);

  return { stats, status };
}

export function formatRelativeTime(iso: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}y ago`;
}

export function repoSlugFromUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
  return match ? match[1].replace(/\.git$/, "") : null;
}
