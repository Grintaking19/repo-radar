import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { formatRelative } from "../../utils/format";
import type { ActivityStatus } from "./metrics";
import { CompareChartCard } from "./CompareChartCard";
import { EmptyTracked } from "./EmptyTracked";
import { HealthCard } from "./HealthCard";
import { RefreshAllButton } from "./RefreshAllButton";
import { RepoCard } from "./RepoCard";
import { SummaryTiles } from "./SummaryTiles";
import { TrackedFiltersBar } from "./TrackedFilterBar";
import {
  DEFAULT_TRACKED_FILTERS,
  parseTrackedParams,
  toTrackedParams,
  type TrackedFilters,
} from "./filters";
import { selectTrackedSummary, selectVisibleRepos } from "./selectors";

export function DashboardPage() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseTrackedParams(params), [params]);

  const summary = useAppSelector(selectTrackedSummary);
  const visible = useAppSelector((state) => selectVisibleRepos(state, filters));

  const update = useCallback(
    (patch: Partial<TrackedFilters>) =>
      setParams(
        (prev) => toTrackedParams({ ...parseTrackedParams(prev), ...patch }),
        { replace: true },
      ),
    [setParams],
  );

  const toggleStatus = useCallback(
    (status: ActivityStatus) =>
      setParams(
        (prev) => {
          const current = parseTrackedParams(prev);
          const statuses = current.statuses.includes(status)
            ? current.statuses.filter((s) => s !== status)
            : [...current.statuses, status];
          return toTrackedParams({ ...current, statuses });
        },
        { replace: true },
      ),
    [setParams],
  );

  const resetFilters = () => update({ ...DEFAULT_TRACKED_FILTERS, sort: filters.sort });

  if (summary.count === 0) {
    return (
      <Stack spacing={2}>
        <Typography variant="h1">Tracked repositories</Typography>
        <EmptyTracked />
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        useFlexGap
        sx={{ flexWrap: "wrap", gap: 2, justifyContent: "space-between", alignItems: "flex-end" }}
      >
        <Box>
          <Typography variant="h1">Tracked repositories</Typography>
          {summary.oldestFetchedAt !== null && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Data refreshed {formatRelative(new Date(summary.oldestFetchedAt).toISOString())}
            </Typography>
          )}
        </Box>
        <RefreshAllButton />
      </Stack>

      <SummaryTiles summary={summary} />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
          alignItems: "stretch",
        }}
      >
        <HealthCard summary={summary} onStatusToggle={toggleStatus} />
        <CompareChartCard />
      </Box>

      <Stack spacing={2} component="section" aria-labelledby="repos-heading">
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
          <Typography variant="h2" id="repos-heading">
            Repositories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {visible.length === summary.count
              ? `${summary.count} tracked`
              : `Showing ${visible.length} of ${summary.count}`}
          </Typography>
        </Stack>

        <TrackedFiltersBar
          filters={filters}
          statusCounts={summary.statusCounts}
          languages={summary.languages}
          onChange={update}
          onStatusToggle={toggleStatus}
          onReset={resetFilters}
        />

        {visible.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="subtitle1">No repositories match these filters</Typography>
            <Button size="small" onClick={resetFilters} sx={{ mt: 1 }}>
              Clear filters
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
            }}
          >
            {visible.map((repo) => (
              <RepoCard key={repo.fullName} fullName={repo.fullName} />
            ))}
          </Box>
        )}
      </Stack>
    </Stack>
  );
}