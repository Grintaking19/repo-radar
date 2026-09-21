import type { SearchReposArgs } from "../../services/github/types";
import { PER_PAGE, type SearchFilters } from "./filters";

const addQuotes = (s: string) => (/\s/.test(s) ? `"${s}"` : s);

export function buildQuery(
  filters: SearchFilters,
  perPage = PER_PAGE,
): SearchReposArgs {
  const qualifiers: string[] = [];
  if (filters.language) {
    qualifiers.push(`language:${addQuotes(filters.language)}`);
  }
  if (filters.minStars > 0) {
    qualifiers.push(`stars:>=${filters.minStars}`);
  }
  if (filters.hideArchived) {
    qualifiers.push(`archived:false`);
  }

  const q = [filters.text.trim(), ...qualifiers].filter(Boolean).join(" ");

  return filters.sort === "best-match"
    ? { q, page: filters.page, perPage }
    : { q, sort: filters.sort, order: "desc", page: filters.page, perPage };
}
