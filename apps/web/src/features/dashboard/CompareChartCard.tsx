import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { RankedBarChart, type ChartDatum } from "@repo-radar/charts";
import { useAppSelector } from "../../app/hooks";
import { formatCount } from "../../utils/format";
import { selectRepoInsights } from "./selectors";
import type { RepoInsight } from "./insights";
import { useStatusColors } from "./useStatusColors";

type Metric = "stars" | "forks" | "openIssues" | "idleDays";

const METRICS: Record<Metric, { label: string; short: string; format: (n: number) => string }> = {
  stars: { label: "Stars", short: "Stars", format: formatCount },
  forks: { label: "Forks", short: "Forks", format: formatCount },
  openIssues: { label: "Open issues and PRs", short: "Issues", format: formatCount },
  idleDays: { label: "Days since last commit", short: "Idle days", format: (n) => `${n}d` },
};

const TOP_N = 10;

export function CompareChartCard() {
  const repos = useAppSelector(selectRepoInsights);
  const statusColors = useStatusColors();
  const [metric, setMetric] = useState<Metric>("stars");

  const data = useMemo<ChartDatum[]>(() => {
    const valueOf = (r: RepoInsight) => r[metric];
    return repos
      .filter((r) => valueOf(r) !== null)
      .sort((a, b) => (valueOf(b) ?? 0) - (valueOf(a) ?? 0))
      .slice(0, TOP_N)
      .map((r) => ({
        name: r.fullName,
        value: valueOf(r) ?? 0,
        // Idle days are colored by status so problems stand out.
        color: metric === "idleDays" ? statusColors[r.status] : undefined,
      }));
  }, [repos, metric, statusColors]);

  const { label, format } = METRICS[metric];

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ justifyContent: "space-between", alignItems: { sm: "flex-start" }, mb: 2 }}
        >
          <div>
            <Typography variant="h2">Compare</Typography>
            <Typography variant="body2" color="text.secondary">
              {repos.length > TOP_N ? `Top ${TOP_N} by ` : "By "}
              {label.toLowerCase()}
            </Typography>
          </div>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={metric}
            onChange={(_, next: Metric | null) => next && setMetric(next)}
            aria-label="Metric to compare"
          >
            {(Object.keys(METRICS) as Metric[]).map((m) => (
              <ToggleButton key={m} value={m} sx={{ textTransform: "none", px: 1.25, py: 0.25 }}>
                {METRICS[m].short}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        {data.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
            No data for this metric yet.
          </Typography>
        ) : (
          <RankedBarChart
            data={data}
            metricLabel={label}
            valueFormatter={format}
            height={Math.max(140, data.length * 30 + 40)}
          />
        )}
      </CardContent>
    </Card>
  );
}