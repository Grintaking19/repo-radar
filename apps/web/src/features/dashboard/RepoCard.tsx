import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetTrackedRepoQuery } from "../../services/github/githubApi";
import { repoSnapshotUpdated, repoUntracked } from "../tracked/trackedSlice";
import { RepoCardSkeleton } from "./RepoCardSkeleton";
import { RepoCardError } from "./RepoCardError";
import {
  ACTIVITY_COLOR,
  ACTIVITY_LABEL,
  getActivityStatus,
} from "./metrics";
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
import { RefreshCwIcon, X } from "lucide-react";
import { LanguageDot } from "@repo-radar/ui";
import { describeApiError } from "../../services/github/errors";
import { formatCount, formatRelative } from "../../utils/format";

export function RepoCard({ fullName }: { fullName: string }) {
  const dispatch = useAppDispatch();
  const snapshot = useAppSelector((s) => s.tracked.snapshots[fullName]);

  const { data, isFetching, isError, error, refetch } =
    useGetTrackedRepoQuery(fullName);

  useEffect(() => {
    if (data) {
      // Update the snapshot in the store
      dispatch(repoSnapshotUpdated(data));
    }
  }, [data, dispatch]);

  const repo = data ?? snapshot;

  if (!repo && isFetching) {
    return <RepoCardSkeleton />;
  }

  if (!repo && isError) {
    return (
      <RepoCardError
        fullName={fullName}
        message={describeApiError(error)}
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
    <Card
      sx={{ height: "100%", opacity: isFetching ? 0.6 : 1, transition: "opacity 0.3s" }}
      aria-busy={isFetching}
    >
      <CardContent>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5, gap: 1 }}>
          <Link
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="subtitle1"
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
              <X size={16} />
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
          {repo.license && (
            <Chip label={repo.license} color="default" variant="outlined" />
          )}
        </Stack>

        {repo.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              overflowWrap: "anywhere",
            }}
          >
            {repo.description}
          </Typography>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5 }}>
          {repo.language && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", gridColumn: "1 / -1" }}>
              <LanguageDot language={repo.language} />
              <Typography variant="caption" color="text.secondary">
                {repo.language}
              </Typography>
            </Stack>
          )}
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