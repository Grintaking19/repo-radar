import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSearchReposQuery } from "../../services/github/githubApi.ts";
import { useDebounce } from "../../utils/useDebounce.ts";
import { SearchBar } from "./SearchBar.tsx";
import { SearchResultItem } from "./SearchResultItem.tsx";
import { formatCount, formatRelative } from "../../utils/format.ts";
import { TrackButton } from "../tracked/TrackButton.tsx";

const MIN_QUERY_LENGTH = 3;

export function SearchPage() {
  console.log("SearchPage rendered");
  const [input, setInput] = useState("");
  const query = useDebounce(input, 700);
  const trimmed = query.trim();

  const { data, isFetching, error } = useSearchReposQuery(trimmed, {
    skip: trimmed.length < MIN_QUERY_LENGTH,
  });

  return (
    <>
      <SearchBar value={input} onChange={setInput} />
      {trimmed.length < MIN_QUERY_LENGTH && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Please enter at least {MIN_QUERY_LENGTH} characters to search.
        </Typography>
      )}
      {isFetching && <CircularProgress sx={{ mt: 2 }} />}

      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          An error occurred while fetching data.
        </Typography>
      )}

      {data && (
        <Box
          component="ul"
          aria-label="Search results"
          sx={{ listStyle: "none", p: 0, mt: 2 }}
        >
          {data?.map((repo) => (
            <SearchResultItem
              key={repo.id}
              avatarUrl={repo.ownerAvatarUrl}
              fullName={repo.fullName}
              url={repo.url}
              description={repo.description}
              topics={repo.topics}
              language={repo.language}
              stars={formatCount(repo.stars)}
              updatedLabel={formatRelative(repo.pushedAt)}
              archived={repo.archived}
              action={<TrackButton repo={repo} />}
            />
          ))}
        </Box>
      )}
    </>
  );
}
