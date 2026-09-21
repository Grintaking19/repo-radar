import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetTrackedRepoQuery } from "../../services/github/githubApi";
import { selectTrackedSnapshots } from "../tracked/selectors";
import { repoSnapshotUpdated, repoUntracked } from "../tracked/trackedSlice";
import { RepoCardSkeleton } from "./RepoCardSkeleton";
import { RepoCardError } from "./RepoCardError";
import {
  ACTIVITY_COLOR,
  ACTIVITY_LABEL,
  getActivityStatus,
} from "../../utils/metrics";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { RefreshCwIcon } from "lucide-react";
import { formatCount, formatRelative } from "../../utils/format";

export function RepoCard({ fullName }: { fullName: string }) {
  const dispatch = useAppDispatch();
  const snapshots = useAppSelector(selectTrackedSnapshots)[fullName];

  const { data, isFetching, isError, error, refetch } =
    useGetTrackedRepoQuery(fullName);

  useEffect(() => {
    if (data) {
      // Update the snapshot in the store
      dispatch(repoSnapshotUpdated(data));
    }
  }, [data, dispatch]);

  const repo = data ?? snapshots;

  if (!repo && isFetching) {
    return <RepoCardSkeleton />;
  }

  if (!repo && isError) {
    const status = (error as { status?: number })?.status;
    return (
      <RepoCardError
        fullName={fullName}
        message={
          status === 403 || status === 429
            ? "API rate limit exceeded. Please try again later."
            : status === 404
              ? "Repository not found."
              : "Could not fetch repository data. Please try again later."
        }
        onRetry={refetch}
        onUntrack={() => dispatch(repoUntracked(fullName))}
      />
    );
  }

  if (!repo) {
    return null;
  }

  const status = getActivityStatus(repo.lastCommitAt, repo.archived);

  return (
    <Card sx={{ opacity: isFetching ? 0.5 : 1, transition: "opacity 0.3s" }}>
      <CardContent>
        <Stack>
          <Link
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="subtitle2"
            underline="hover"
            noWrap
            sx={{ minWidth: 0 }}
          >
            {repo.fullName}
          </Link>
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={refetch}
              disabled={isFetching}
              aria-label={`Refresh ${repo.fullName}`}
            >
              <RefreshCwIcon size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => dispatch(repoUntracked(repo.fullName))}
              aria-label={`Untrack ${repo.fullName}`}
            >
              ✕
            </IconButton>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.5 }}
        >
          <Chip
            label={ACTIVITY_LABEL[status]}
            color={ACTIVITY_COLOR[status]}
            variant="outlined"
          />
          {repo.archived && (
            <Chip
              label="Archived"
              color={ACTIVITY_COLOR["archived"]}
              variant="outlined"
            />
          )}
          {repo.license && (
            <Chip label={repo.license} color="default" variant="outlined" />
          )}
        </Stack>

        {repo.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {repo.description}
          </Typography>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            ★ {formatCount(repo.stars)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ⑂ {formatCount(repo.forks)}
          </Typography>
          <Tooltip title="Open issues and pull requests">
            <Typography variant="caption" color="text.secondary">
              ⚠ {formatCount(repo.openIssues)}
            </Typography>
          </Tooltip>
          {repo.lastCommitAt && (
            <Typography variant="caption" color="text.secondary">
              Last commit {formatRelative(repo.lastCommitAt)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
