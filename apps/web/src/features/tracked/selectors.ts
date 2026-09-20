import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const selectTrackedIds = (state: RootState) => state.tracked.ids;
export const selectTrackedSnapshots = (state: RootState) =>
  state.tracked.snapshots;

export const selectIsTracked = (state: RootState, fullName: string) =>
  state.tracked.ids.includes(fullName);

export const selectTrackedCount = (state: RootState) =>
  state.tracked.ids.length;

export const selectTrackedRepos = createSelector(
  [selectTrackedIds, selectTrackedSnapshots],
  (ids, snapshots) => ids.flatMap((id) => snapshots[id] ?? []),
);
