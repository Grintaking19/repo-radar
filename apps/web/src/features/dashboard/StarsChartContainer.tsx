import { useMemo } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { StarsBarChart } from "@repo-radar/charts";
import { useAppSelector } from "../../app/hooks";
import { selectTrackedRepos } from "../tracked/selectors";

export function StarsChartContainer() {
  const repos = useAppSelector(selectTrackedRepos);
  const data = useMemo(
    () =>
      [...repos]
        .sort((a, b) => b.stars - a.stars)
        .map((repo) => ({
          name: repo.name,
          value: repo.stars,
        })),
    [repos],
  );

  if (data.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Stars per Repository
        </Typography>
        <StarsBarChart data={data} metricLabel="Stars" height={320} />
      </CardContent>
    </Card>
  );
}
