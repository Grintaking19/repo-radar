import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { githubApi } from "../services/github/githubApi";
import trackedReducer from "../features/tracked/trackedSlice";
import { saveTracked, saveColorMode} from "../utils/storage";
import themeReducer from "../features/theme/themeSlice";
import searchReducer from "../features/search/searchSlice";


export const store = configureStore({
  reducer: {
    tracked: trackedReducer,
    theme: themeReducer,
    search: searchReducer,
    [githubApi.reducerPath]: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware),
});

setupListeners(store.dispatch);

let {tracked: lastTracked, theme: lastTheme} = store.getState()
store.subscribe(() => {
  const {tracked, theme} = store.getState();
  if (tracked !== lastTracked) {
    lastTracked = tracked;
    saveTracked(tracked);
  }
  if (theme.colorMode !== lastTheme.colorMode) {
    lastTheme = theme;
    saveColorMode(theme.colorMode);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
