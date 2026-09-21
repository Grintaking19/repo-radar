import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectTrackedIds } from "../tracked/selectors";
import { RepoCard } from "./RepoCard";
import { RefreshAllButton } from "./RefreshAllButton";

export function DashboardPage() {
  //   const repos = useAppSelector(selectTrackedRepos);
  const ids = useAppSelector(selectTrackedIds);
  return (
    <Box>
      <RefreshAllButton />
      {ids.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You are not tracking any repositories yet. Use the search page to find
          and track repositories.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3, 1fr)",
              //   lg: "repeat(4, 1fr)",
            },
          }}
        >
          {ids.map((id) => (
            <RepoCard key={id} fullName={id} />
          ))}
        </Box>
      )}
    </Box>
  );
}
