import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GitHubSearchResponse, TrackedRepo } from "./types";
import { toTrackedRepo } from "./transform";

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.github.com/",
    headers: {
      Accept: "application/vnd.github+json",
    },
  }),
  tagTypes: ["Repo"],
  keepUnusedDataFor: 300, // 5 minutes
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    searchRepos: builder.query<TrackedRepo[], string>({
      query: (q) => ({
        url: "search/repositories",
        params: { q, per_page: 10 },
      }),
      transformResponse: (response: GitHubSearchResponse) =>
        response.items.map((repo) => toTrackedRepo(repo)),
    }),
  }),
});

export const { useSearchReposQuery } = githubApi;