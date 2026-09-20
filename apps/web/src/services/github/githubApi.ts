import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  GitHubRepo,
  GitHubSearchResponse,
  TrackedRepo,
  GitHubCommit,
} from "./types";
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
    getTrackedRepo: builder.query<TrackedRepo, string>({
      async queryFn(fullName, _queryApi, _extraOptions, baseQuery) {
        const repoResponse = await baseQuery(`repos/${fullName}`);

        if (repoResponse.error) {
          return { error: repoResponse.error };
        }

        // Commits endpoint returns 409 for empty repos, so we need to handle that case
        const commitsResponse = await baseQuery(
          `repos/${fullName}/commits?per_page=1`,
        );

        const commits = commitsResponse.error
          ? undefined
          : (commitsResponse.data as GitHubCommit[]);

        return {
          data: toTrackedRepo(repoResponse.data as GitHubRepo, commits),
        };
      },
      providesTags: (_res, _err, fullName) => [{ type: "Repo", id: fullName }],
    }),
  }),
});

export const { useSearchReposQuery, useGetTrackedRepoQuery } = githubApi;
