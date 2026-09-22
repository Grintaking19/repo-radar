import type { TrackedRepo } from "../../services/github/types";
import {
  ACTIVITY_ORDER,
  daysSince,
  getActivityStatus,
  type ActivityStatus,
} from "./metrics";
import type { TrackedFilters } from "./filters";

/**
 * Pure functions behind the dashboard selectors.
 * Kept free of Redux so they are trivial to unit test.
 */

export interface RepoInsight extends TrackedRepo {
  status: ActivityStatus;
  /** Days since the latest default-branch commit; null when unknown. */
  idleDays: number | null;
  /** Position in the tracked list (0 = tracked first). */
  trackedIndex: number;
}

export interface TrackedSummary {
  count: number;
  /** Stale + archived. */
  needsAttention: number;
  /** The stale/archived repos idle the longest (at most 3). */
  attentionRepos: RepoInsight[];
  totalStars: number;
  medianIdleDays: number | null;
  statusCounts: Record<ActivityStatus, number>;
  /** Languages across tracked repos, most common first. */
  languages: string[];
  /** When the least recently fetched repo was fetched (how fresh the data is). */
  oldestFetchedAt: number | null;
}

export function toInsights(repos: TrackedRepo[]): RepoInsight[] {
  return repos.map((repo, trackedIndex) => ({
    ...repo,
    status: getActivityStatus(repo.lastCommitAt, repo.archived),
    idleDays: daysSince(repo.lastCommitAt),
    trackedIndex,
  }));
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function summarize(insights: RepoInsight[]): TrackedSummary {
  const statusCounts = Object.fromEntries(
    ACTIVITY_ORDER.map((s) => [s, 0]),
  ) as Record<ActivityStatus, number>;
  const languageCounts = new Map<string, number>();

  for (const repo of insights) {
    statusCounts[repo.status] += 1;
    if (repo.language) {
      languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }
  }

  return {
    count: insights.length,
    needsAttention: statusCounts.stale + statusCounts.archived,
    attentionRepos: insights
      .filter((r) => r.status === "stale" || r.status === "archived")
      .sort((a, b) => (b.idleDays ?? -1) - (a.idleDays ?? -1))
      .slice(0, 3),
    totalStars: insights.reduce((sum, r) => sum + r.stars, 0),
    medianIdleDays: median(
      insights.flatMap((r) => (r.idleDays === null ? [] : [r.idleDays])),
    ),
    statusCounts,
    languages: [...languageCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([language]) => language),
    oldestFetchedAt:
      insights.length > 0 ? Math.min(...insights.map((r) => r.fetchedAt)) : null,
  };
}

const matchesText = (repo: RepoInsight, text: string) => {
  const needle = text.trim().toLowerCase();
  if (!needle) return true;
  return (
    repo.fullName.toLowerCase().includes(needle) ||
    (repo.description?.toLowerCase().includes(needle) ?? false) ||
    repo.topics.some((t) => t.toLowerCase().includes(needle))
  );
};

const COMPARATORS: Record<TrackedFilters["sort"], (a: RepoInsight, b: RepoInsight) => number> = {
  recent: (a, b) => b.trackedIndex - a.trackedIndex,
  stars: (a, b) => b.stars - a.stars,
  // Most recent commit first; unknown dates last.
  "last-commit": (a, b) =>
    (a.idleDays ?? Number.POSITIVE_INFINITY) - (b.idleDays ?? Number.POSITIVE_INFINITY),
  name: (a, b) => a.fullName.localeCompare(b.fullName),
};

export function applyTrackedFilters(
  insights: RepoInsight[],
  filters: TrackedFilters,
): RepoInsight[] {
  return insights
    .filter(
      (repo) =>
        matchesText(repo, filters.text) &&
        (filters.statuses.length === 0 || filters.statuses.includes(repo.status)) &&
        (filters.language === null || repo.language === filters.language),
    )
    .sort(COMPARATORS[filters.sort]);
}