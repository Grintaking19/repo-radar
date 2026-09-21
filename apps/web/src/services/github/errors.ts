import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/** Turn query errors into user friendly messages*/
export function describeApiError(
  error: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (error && "status" in error) {
    switch (error.status) {
      case 403:
      case 429:
        return "GitHub's rate limit was reached. Wait a minute and try again.";
      case 404:
        return "Repository not found.";
      case 422:
        return "GitHub couldn't process this search. Try simplifying it.";
      case "FETCH_ERROR":
        return "Network error. Check your connection and try again.";
    }
  }
  return "Something went wrong while talking to GitHub.";
}
