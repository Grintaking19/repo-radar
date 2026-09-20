import type { TrackedRepo } from "../../services/github/types";
import { loadTracked } from "../../utils/storage";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TrackedState {
  ids: string[];
  snapshots: Record<string, TrackedRepo>;
}

const initialState: TrackedState = loadTracked() ?? {
  ids: [],
  snapshots: {},
};

const trackedSlice = createSlice({
  name: "tracked",
  initialState,
  reducers: {
    repoTracked(state, action: PayloadAction<TrackedRepo>) {
      const repo = action.payload;
      if (state.ids.includes(repo.fullName)) return;
      state.ids.push(repo.fullName);
      state.snapshots[repo.fullName] = repo;
    },
    repoUntracked(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
      delete state.snapshots[action.payload];
    },
    repoSnapshotUpdated(state, action: PayloadAction<TrackedRepo>) {
      const repo = action.payload;
      if (!state.ids.includes(repo.fullName)) return;
      state.snapshots[repo.fullName] = repo;
    },
  },
});

export const { repoTracked, repoUntracked, repoSnapshotUpdated } =
  trackedSlice.actions;
export default trackedSlice.reducer;
