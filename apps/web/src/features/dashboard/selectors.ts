import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { selectTrackedRepos } from "../tracked/selectors";
import type { TrackedFilters } from "./filters";
import { applyTrackedFilters, summarize, toInsights } from "./insights";

/** Tracked repos enriched with derived fields (status, idle days). */
export const selectRepoInsights = createSelector([selectTrackedRepos], toInsights);

/** Overview numbers for the whole tracked list (ignores filters). */
export const selectTrackedSummary = createSelector([selectRepoInsights], summarize);

/** The repos shown in the grid, after the page's filters and sort. */
export const selectVisibleRepos = createSelector(
  [selectRepoInsights, (_state: RootState, filters: TrackedFilters) => filters],
  applyTrackedFilters,
);