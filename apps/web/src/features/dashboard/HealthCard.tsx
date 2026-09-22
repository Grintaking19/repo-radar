import { useCallback, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { formatRelative } from "../../utils/format";
import { DonutChart, type DonutDatum } from "@repo-radar/charts";
import {
  ACTIVITY_LABEL,
  ACTIVITY_ORDER,
  ACTIVITY_RULE,
  type ActivityStatus,
} from "./metrics";
import type { TrackedSummary } from "./insights";
import { useStatusColors } from "./useStatusColors";

interface Props {
  summary: TrackedSummary;
  /** Clicking a slice toggles that status in the repo filters. */
  onStatusToggle: (status: ActivityStatus) => void;
}

export function HealthCard({ summary, onStatusToggle }: Props) {
  const colors = useStatusColors();
  const data = useMemo<(DonutDatum & { status: ActivityStatus })[]>(
    () =>
      ACTIVITY_ORDER.filter((s) => summary.statusCounts[s] > 0).map((status) => ({
        status,
        name: ACTIVITY_LABEL[status],
        value: summary.statusCounts[status],
        color: colors[status],
      })),
    [summary, colors],
  );
  const rows = data.map((d) => d.status);

  const handleSliceClick = useCallback(
    (_datum: DonutDatum, index: number) => onStatusToggle(data[index].status),
    [data, onStatusToggle],
  );

  const healthyShare =
    summary.count > 0
      ? Math.round((summary.statusCounts.active / summary.count) * 100)
      : 0;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h2">Health</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Based on the latest commit on the default branch
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: "center" }}
        >
          <Box sx={{ width: 180, flexShrink: 0 }}>
            <DonutChart
              data={data}
              centerValue={`${healthyShare}%`}
              centerLabel="active"
              height={180}
              onSliceClick={handleSliceClick}
            />
          </Box>

          <Stack component="ul" spacing={1} sx={{ listStyle: "none", p: 0, m: 0, flexGrow: 1, width: "100%" }}>
            {rows.map((status) => (
              <Tooltip key={status} title={ACTIVITY_RULE[status]} placement="left">
                <Stack
                  component="li"
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "2px",
                      bgcolor: colors[status],
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {ACTIVITY_LABEL[status]}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {summary.statusCounts[status]}
                  </Typography>
                </Stack>
              </Tooltip>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" color="text.secondary" component="h3" sx={{ mb: 1 }}>
          Needs attention
        </Typography>
        {summary.attentionRepos.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nothing is stale or archived right now.
          </Typography>
        ) : (
          <Stack component="ul" spacing={0.75} sx={{ listStyle: "none", p: 0, m: 0 }}>
            {summary.attentionRepos.map((repo) => (
              <Stack
                key={repo.fullName}
                component="li"
                direction="row"
                sx={{ alignItems: "baseline", justifyContent: "space-between", gap: 1, minWidth: 0 }}
              >
                <Link
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  variant="body2"
                  noWrap
                  sx={{ minWidth: 0, flexShrink: 1 }}
                >
                  {repo.fullName}
                </Link>
                <Typography
                  variant="caption"
                  sx={{ flexShrink: 0, color: colors[repo.status] }}
                >
                  {repo.status === "archived"
                    ? "Archived"
                    : `Last commit ${formatRelative(repo.lastCommitAt ?? "")}`}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}