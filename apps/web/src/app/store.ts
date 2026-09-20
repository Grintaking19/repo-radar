import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { githubApi } from "../services/github/githubApi";
import trackedReducer from "../features/tracked/trackedSlice";
import { saveTracked } from "../utils/storage";

export const store = configureStore({
  reducer: {
    tracked: trackedReducer,
    [githubApi.reducerPath]: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware),
});

setupListeners(store.dispatch);

let lastTrackedState = store.getState().tracked;
store.subscribe(() => {
  const currentTrackedState = store.getState().tracked;
  if (currentTrackedState !== lastTrackedState) {
    lastTrackedState = currentTrackedState;
    saveTracked(currentTrackedState);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
