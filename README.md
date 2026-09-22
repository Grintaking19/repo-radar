# Repo Radar

Keep an eye on the open-source repositories you depend on. Search GitHub, track the repos that matter to you, and see at a glance which ones are active, which are slowing down, and which have gone stale.

**Live demo:**  https://repo-radar-web.vercel.app/

## Features

### Search
- Debounced search of GitHub repositories (starts at 3 characters)
- Filters for **language**, **minimum stars**, **sort** (best match, stars, forks, recently updated) and **hide archived**
- Pagination, capped at the 1,000 results GitHub's search API returns
- The query, filters and page live in the **URL**, so a search can be shared and survives a reload. Coming back from the Tracked page restores it, and results cached in the last 5 minutes are not refetched
- Skeleton loading, empty states, and readable errors (rate limit, network) with Retry

### Tracked repositories
- **Track and untrack** from search results. The list persists across reloads (localStorage)
- **Summary**: repos tracked, how many need attention (stale or archived), total stars, and median time since the last commit
- **Health** donut by activity status, plus a short list of the repos that have been idle the longest. Clicking a slice filters the grid by that status
- **Compare** chart: top 10 repos by stars, forks, open issues, or days since the last commit (colored by status)
- **Filter and sort** the grid by text (name, description, topics), status, and language. Sort by recently tracked, stars, latest commit, or name. These filters live in the URL too
- **Instant first paint**: cards render from a stored snapshot, then refresh from GitHub in the background
- **Per-card loading**: each card has its own skeleton, error state with Retry, and refresh button. One failing repo never blocks the others
- **Refresh all** in one click

### General
- Light and dark themes with a GitHub (Primer) palette. The OS preference is the default and your choice is persisted

### Activity status

Status is based on the date of the **latest commit on the default branch**:

| Status   | Rule                         |
| -------- | ---------------------------- |
| Active   | last commit < 30 days ago    |
| Slowing  | 30–179 days                  |
| Stale    | ≥ 180 days                   |
| Archived | archived on GitHub           |
| Unknown  | commit date unavailable      |

## Getting started

Requirements: Node 22 LTS and pnpm 9 or newer.

```bash
pnpm install
pnpm dev                  # apps/web at http://localhost:5173
pnpm build                # type-check + production build of apps/web
pnpm --filter web lint
```

No environment variables are needed. The app calls the public GitHub REST API without authentication.

## Tech stack

React 19 - TypeScript - Vite - Redux Toolkit + RTK Query - React Router - MUI - ECharts - pnpm workspaces - Vercel

## Project structure
The project's structure is a monorepo feature-based, you will it's divided into 2 main repos:
  1. `apps/web`: This for the core logic of the website, it's ***Feature-based**. Everything related to a certain feature is grouped in the same folder.
  2. `packages`: hold **presentational code only**,They take plain props, never import Redux or the API layer, and know nothing about GitHub. Containers in `apps/web/src/features/*` select and shape the data. It's divided into 2 main sections:
    - `packages/ui/*`: focuses on pure UI components derived from MUI.
    - `packages/charts/*`: focues on Echarts components.

This allows for reusing 2 things: 
  1. **Princple of least previlage**: every folder and component has only the data it needs.
  2. **Reusability of `packages`' components**: There are clear decoupling of purely presentational code.

```
apps/
  web/                        # the application
    src/
      app/                    # store, typed hooks, theme provider
      layout/                 # AppLayout, AppHeader
      features/
        search/               # page, filters (URL <-> state), buildQuery, result list
        tracked/              # tracked slice, base selectors, TrackButton
        dashboard/            # tracked page: tiles, health, compare, filters, repo cards
        theme/                # color-mode slice and toggle
      services/github/        # RTK Query API, raw types, response -> domain transform, error copy
      utils/                  # formatting, activity metrics, storage, useDebounce
packages/
  ui/                         # MUI theme and presentational components (StatTile, LanguageDot, Logo)
  charts/                     # presentational ECharts components (DonutChart, RankedBarChart)
```

## Architecture

Every kind of state has exactly one owner, and everything else is derived from it. Redux is the single source of truth for app state: components read it through selectors and change it only by dispatching actions. They never call `fetch` or touch localStorage directly.

- **Server state: RTK Query.** Requests are cached by endpoint and arguments, shared between components, and kept for 5 minutes after their last use. GitHub responses are converted to a typed domain model in one place (`services/github/transform.ts`).
- **Client state: Redux slices.** The tracked repos and the color mode are persisted. They load from localStorage once at startup, and a store subscriber writes back only the slices that changed. localStorage is a backup for reloads, not live state. The API cache is never persisted.
- **URL state: filters.** The search query, filters and page, plus the dashboard filters, live in the URL, so they can be shared and bookmarked and the back button works. Redux only remembers the last search string so the nav link can restore it.
- **Derived state: memoized selectors.** Status, summaries and chart data are never stored. They are computed from pure, testable functions.

### Where state lives

| Kind of state | Where | Examples |
| --- | --- | --- |
| Server state | RTK Query (`githubApi`) | search results, fresh repo data |
| Client state | Redux slices | tracked ids + snapshots, color mode, last search |
| URL state | `useSearchParams` | search query, filters and page; dashboard filters |
| Derived state | memoized selectors over pure functions | insights, summary, visible repos, chart data |

### Package boundaries

`packages/*` hold **presentational code only**. They take plain props, never import Redux or the API layer, and know nothing about GitHub. Containers in `apps/web/src/features/*` select and shape the data. For example, `CompareChartCard` ranks tracked repos by the chosen metric, and `RankedBarChart` only draws the bars.

### Derived data

`features/dashboard/insights.ts` holds pure functions: `toInsights` (adds status and idle days), `summarize`, and `applyTrackedFilters`. `selectors.ts` wraps them in `createSelector`, so they recompute only when snapshots or filters change.

The summary (tiles and health) always describes **everything tracked**. Filters narrow only the repository grid, so the overview never changes under you while you search for one repo.

### How a tracked repo is loaded

1. **Track** stores a snapshot of the search result in the `tracked` slice, keyed by `owner/name`, and persists it to localStorage.
2. Each `RepoCard` shows its snapshot right away, then fetches the repo and its latest commit (2 requests) through its own `useGetTrackedRepoQuery`. The fresh result replaces the snapshot, which updates every chart and tile. Loading, errors and retries stay isolated per card. For an empty repo the commit request fails (409), so the card just shows no commit date.
3. **Refresh all** invalidates the `Repo` tag, and every mounted card refetches independently.


## Decisions and trade-offs

- **Latest commit instead of `pushed_at`.** `pushed_at` changes on a push to *any* branch, so a repo with only bot or feature-branch activity still looks alive. Other option was to make extra request (More Github Tokens)

- **One query per card.** Each repo has its own loading, error, retry and cache entry, so one failing repo never blocks the others and a single card can refresh on its own. The REST API needs two requests per repo (repo details and latest commit), so a full refresh costs N×2 requests. That's the same as fetching everything in one combined query, because REST can't batch. GitHub's GraphQL API could fetch all repos in one request, but it requires a token.

- **Snapshots duplicate part of the RTK Query cache on purpose.** The RTK Query cache lives in memory. Snapshots give an instant dashboard on reload, keep cards useful during rate limiting, and let all dashboard analytics run client-side without extra requests.
