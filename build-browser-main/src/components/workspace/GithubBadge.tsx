import { GitFork, Star } from "lucide-react";

import { formatRelativeTime, repoSlugFromUrl, useGithubRepoStats } from "@/lib/github";

export function GithubBadge({ repoUrl, className = "" }: { repoUrl?: string; className?: string }) {
  const slug = repoSlugFromUrl(repoUrl);
  const { stats, status } = useGithubRepoStats(slug);

  if (!slug || status === "idle" || status === "error") return null;

  if (status === "loading" && !stats) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/50 ${className}`}>
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-muted-foreground/30" />
        Fetching live stats…
      </span>
    );
  }

  if (!stats) return null;

  return (
    <span className={`inline-flex items-center gap-3 text-[11px] text-muted-foreground ${className}`}>
      <span className="inline-flex items-center gap-1" title="Stars">
        <Star className="h-3 w-3" />
        {stats.stars}
      </span>
      <span className="inline-flex items-center gap-1" title="Forks">
        <GitFork className="h-3 w-3" />
        {stats.forks}
      </span>
      {stats.pushedAt && <span title={new Date(stats.pushedAt).toLocaleString()}>Updated {formatRelativeTime(stats.pushedAt)}</span>}
    </span>
  );
}
