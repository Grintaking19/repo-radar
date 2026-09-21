import type { GitHubRepo, GitHubCommit, TrackedRepo } from "./types";

export function toTrackedRepo(
  repo: GitHubRepo,
  commits?: GitHubCommit[],
): TrackedRepo {
  return {
    id: repo.id,
    fullName: repo.full_name,
    name: repo.name,
    owner: repo.owner.login,
    ownerAvatarUrl: repo.owner.avatar_url,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    license: repo.license?.spdx_id || null,
    topics: repo.topics ?? [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    archived: repo.archived,
    createdAt: repo.created_at,
    pushedAt: repo.pushed_at,
    lastCommitAt: commits?.[0]?.commit.author?.date || null,
    fetchedAt: Date.now(),
  };
}
