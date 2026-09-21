import type { RepoSortField } from "../../services/github/types";

export type SortKey = "best-match" | RepoSortField;

export interface SearchFilters {
  text: string;
  language: string | null;
  minStars: number;
  sort: SortKey;
  hideArchived: boolean;
  page: number;
}

export const MIN_QUERY_LENGTH = 3;
export const PER_PAGE = 20;

// Github API's Max result items
export const MAX_RESULTS = 1000;

export const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Kotlin",
  "Swift",
  "C++",
  "C#",
  "C",
  "Ruby",
  "PHP",
  "Dart",
  "Vue",
  "HTML",
  "CSS",
  "Shell",
] as const;

export const MIN_STARS_OPTIONS = [
  { value: 0, label: "Any stars" },
  { value: 100, label: "100+" },
  { value: 1000, label: "1k+" },
  { value: 10000, label: "10k+" },
  { value: 50000, label: "50k+" },
] as const;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "best-match", label: "Best match" },
  { value: "stars", label: "Most stars" },
  { value: "forks", label: "Most forks" },
  { value: "updated", label: "Recently updated" },
];

export const DEFAULT_FILTERS: SearchFilters = {
  text: "",
  language: null,
  minStars: 0,
  sort: "best-match",
  hideArchived: false,
  page: 1,
};

// Check if I have to apply any filters other than the default ones
export function hasActiveFilters(filters: SearchFilters): boolean {
  return (
    filters.language !== null ||
    filters.minStars > 0 ||
    filters.sort !== "best-match" ||
    filters.hideArchived
  );
}

/**
 *  parse the search filters from the URLSearchParams object.
 *  handles invalid urls
 */
export function parseSearchParams(params: URLSearchParams): SearchFilters {
  const lang = params.get("lang")?.toLowerCase();
  const stars = Number(params.get("stars"));
  const sort = params.get("sort") as SortKey | null;
  const page = Number(params.get("page"));

  return {
    text: params.get("q")?.trim() ?? "",
    language: LANGUAGES.find((l) => l.toLowerCase() === lang) ?? null,
    minStars: MIN_STARS_OPTIONS.some((opt) => opt.value === stars) ? stars : 0,
    sort: SORT_OPTIONS.some((opt) => opt.value === sort)
      ? (sort as SortKey)
      : "best-match",
    hideArchived: params.get("archived") === "hide",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

// like toTransform for API request types and app types
export function toSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.text) params.set("q", filters.text);
  if (filters.language) params.set("lang", filters.language);
  if (filters.minStars > 0) params.set("stars", String(filters.minStars));
  if (filters.sort !== "best-match") params.set("sort", filters.sort);
  if (filters.hideArchived) params.set("archived", "hide");
  if (filters.page > 1) params.set("page", String(filters.page));
  return params;
}
