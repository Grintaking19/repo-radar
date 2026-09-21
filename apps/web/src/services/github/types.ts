/** Raw Repository data from GitHub API */
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  pushed_at: string;
  created_at: string;
  archived: boolean;
  topics?: string[];
  license?: { spdx_id: string | null } | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

/** Response shape of GET /search/repositories endpoint */
export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    } | null;
  };
}

export interface TrackedRepo {
  id: number;
  fullName: string;
  name: string;
  owner: string;
  ownerAvatarUrl: string;
  description: string | null;
  url: string;
  language: string | null;
  license: string | null;
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  archived: boolean;
  createdAt: string;
  pushedAt: string;

  /** Timestamp of the last commit on the default branch, null when cannot be fetched */
  lastCommitAt: string | null;

  /** Timestamp of when the repo was last fetched from GitHub */
  fetchedAt: number;
}

export interface ApiError {
  status: number;
  message: string;
  isRateLimitError?: boolean;
}


export type RepoSortField = "stars" | "forks" | "updated" ;

export interface SearchReposArgs {
  q: string;
  sort?: RepoSortField;
  order?: "asc" | "desc";
  page: number;
  perPage: number;
}

export interface SearchReposResult {
  totalCount: number;
  items: TrackedRepo[];
}