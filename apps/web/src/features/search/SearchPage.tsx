import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { useSearchReposQuery } from "../../services/github/githubApi";
import { describeApiError } from "../../services/github/errors.ts";
import { formatCount, formatRelative } from "../../utils/format";
import { TrackButton } from "../tracked/TrackButton";
import { SearchBar } from "./SearchBar";
import { SearchFiltersBar } from "./SearchFiltersBar";
import { SearchResultItem } from "./SearchResultItem";
import { SearchResultsSkeleton } from "./SearchResultsSkeleton";
import { buildQuery } from "./buildQuery";
import {
  DEFAULT_FILTERS,
  MAX_RESULTS,
  MIN_QUERY_LENGTH,
  PER_PAGE,
  parseSearchParams,
  toSearchParams,
  type SearchFilters,
} from "./filters";
import { searchParamsChanged } from "./searchSlice";

const TYPING_DEBOUNCE_MS = 500;

export function SearchPage() {
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseSearchParams(params), [params]);

  /**
   * Writes a filter change to the URL (the source of truth).
   * Uses the functional form so a delayed write never overwrites a newer
   * filter change. Any change except paging goes back to page 1.
   */
  const update = useCallback(
    (patch: Partial<SearchFilters>) => {
      setParams(
        (prev) => {
          const current = parseSearchParams(prev);
          const next = toSearchParams({ ...current, page: 1, ...patch });
          // e.g. a trailing space was typed: nothing changed, so stay on the current page
          const isNoop =
            patch.page === undefined &&
            next.toString() === toSearchParams({ ...current, page: 1 }).toString();
          return isNoop ? prev : next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  // The input is local so typing stays instant; the URL is updated once typing pauses.
  const [input, setInput] = useState(filters.text);
  const typingTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  const handleInputChange = (value: string) => {
    setInput(value);
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(
      () => update({ text: value.trim() }),
      TYPING_DEBOUNCE_MS,
    );
  };

  // URL → input: when the URL changes from outside (logo, back button, shared link),
  // mirror it in the input. Adjusting state during render avoids an extra effect pass.
  const [syncedText, setSyncedText] = useState(filters.text);
  if (filters.text !== syncedText) {
    setSyncedText(filters.text);
    if (filters.text !== input.trim()) setInput(filters.text);
  }

  // Remember the last search so the header's "Search" link can restore it.
  useEffect(() => {
    dispatch(searchParamsChanged(params.toString()));
  }, [params, dispatch]);

  const canSearch = filters.text.length >= MIN_QUERY_LENGTH;
  const args = useMemo(() => buildQuery(filters), [filters]);
  const { data, isFetching, error, refetch } = useSearchReposQuery(args, {
    skip: !canSearch,
  });

  const pageCount = data
    ? Math.min(
        Math.ceil(data.totalCount / PER_PAGE),
        Math.floor(MAX_RESULTS / PER_PAGE),
      )
    : 0;

  return (
    <Stack spacing={2} >
      <Box>
        <Typography variant="h1">Search repositories</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Find open-source projects on GitHub and track the ones you depend on.
        </Typography>
      </Box>

      <SearchBar value={input} onChange={handleInputChange} />
      <SearchFiltersBar
        filters={filters}
        onChange={update}
        onReset={() => update({ ...DEFAULT_FILTERS, text: filters.text })}
      />

      {!canSearch ? (
        <EmptyState
          title="Find repositories to track"
          body={`Type at least ${MIN_QUERY_LENGTH} characters, then narrow results by language, stars or archive status.`}
        />
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          {describeApiError(error)}
        </Alert>
      ) : !data ? (
        <SearchResultsSkeleton />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No repositories found"
          body="Try a different term or remove a filter."
        />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary">
            {formatCount(data.totalCount)} repositories
            {pageCount > 1 && ` · page ${filters.page} of ${pageCount}`}
          </Typography>

          <Card
            component="ul"
            aria-label="Search results"
            aria-busy={isFetching}
            sx={{
              listStyle: "none",
              px:2,
              py:2,
              m: 0,
              opacity: isFetching ? 0.6 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {data.items.map((repo) => (
              <SearchResultItem
                key={repo.id}
                avatarUrl={repo.ownerAvatarUrl}
                fullName={repo.fullName}
                url={repo.url}
                description={repo.description}
                topics={repo.topics}
                language={repo.language}
                stars={formatCount(repo.stars)}
                forks={formatCount(repo.forks)}
                license={repo.license}
                updatedLabel={formatRelative(repo.pushedAt)}
                archived={repo.archived}
                action={<TrackButton repo={repo} />}
              />
            ))}
          </Card>

          {pageCount > 1 && (
            <Pagination
              page={filters.page}
              count={pageCount}
              shape="rounded"
              color="primary"
              onChange={(_, page) => {
                update({ page });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              sx={{ alignSelf: "center" }}
            />
          )}
        </>
      )}
    </Stack>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Box sx={{ textAlign: "center", py: 6 }}>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {body}
      </Typography>
    </Box>
  );
}