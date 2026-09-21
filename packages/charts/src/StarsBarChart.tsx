import { useMemo } from "react";
import { useEChart } from "./useECharts";
import { useTheme } from "@mui/material";

export interface ChartDatum {
  name: string;
  value: number;
}

interface Props {
  data: ChartDatum[];
  metricLabel: string;
  height?: number;
}

export function StarsBarChart({
  data,
  metricLabel = "Stars",
  height = 320,
}: Props) {
  const theme = useTheme();
  const option = useMemo(
    () => ({
      grid: { left: 8, right: 24, top: 16, bottom: 8, containLabel: true },
      tooltip: {
        trigger: "axis" as const,
        axisPointer: {
          type: "shadow" as const,
        },
      },
      xAxis: {
        type: "value" as const,
        axisLabel: {
          color: theme.palette.text.secondary,
        },
        splitLine: {
          lineStyle: {
            color: theme.palette.divider,
          },
        },
      },
      yAxis: {
        type: "category" as const,
        data: data.map((d) => d.name),
        axisLabel: {
          color: theme.palette.text.secondary,
        },
        axisLine: {
          lineStyle: {
            color: theme.palette.divider,
          },
        },
      },
      series: [
        {
          name: metricLabel,
          type: "bar" as const,
          data: data.map((d) => d.value),
          itemStyle: {
            color: theme.palette.primary.main,
            borderRadius: [0, 4, 4, 0],
          },
          barMaxWidth: 28,
        },
      ],
    }),
    [data, metricLabel, theme],
  );
  const ref = useEChart(option);

  return <div ref={ref} style={{ width: "100%", height }} />;
}
