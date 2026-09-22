import { ACTIVITY_ORDER, type ActivityStatus } from "./metrics";

export type TrackedSort = "recent" | "stars" | "last-commit" | "name";

export interface TrackedFilters {
  /** Matches name, description and topics (case-insensitive). */
  text: string;
  /** Empty means every status. */
  statuses: ActivityStatus[];
  language: string | null;
  sort: TrackedSort;
}

export const TRACKED_SORT_OPTIONS: { value: TrackedSort; label: string }[] = [
  { value: "recent", label: "Recently tracked" },
  { value: "stars", label: "Most stars" },
  { value: "last-commit", label: "Latest commit" },
  { value: "name", label: "Name" },
];

export const DEFAULT_TRACKED_FILTERS: TrackedFilters = {
  text: "",
  statuses: [],
  language: null,
  sort: "recent",
};

export function hasActiveTrackedFilters(f: TrackedFilters): boolean {
  return f.text !== "" || f.statuses.length > 0 || f.language !== null;
}

/** URL → filters. Unknown values are dropped, so a hand-edited URL stays valid. */
export function parseTrackedParams(params: URLSearchParams): TrackedFilters {
  const statuses = (params.get("status") ?? "")
    .split(",")
    .filter((s): s is ActivityStatus =>
      (ACTIVITY_ORDER as readonly string[]).includes(s),
    );
  const sort = params.get("sort");

  return {
    text: params.get("q") ?? "",
    statuses: ACTIVITY_ORDER.filter((s) => statuses.includes(s)),
    language: params.get("lang") || null,
    sort:
      TRACKED_SORT_OPTIONS.find((o) => o.value === sort)?.value ?? "recent",
  };
}

/** Filters → URL. Defaults are omitted to keep URLs short. */
export function toTrackedParams(f: TrackedFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (f.text) params.set("q", f.text);
  if (f.statuses.length > 0) params.set("status", f.statuses.join(","));
  if (f.language) params.set("lang", f.language);
  if (f.sort !== "recent") params.set("sort", f.sort);
  return params;
}