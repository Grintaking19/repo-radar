import { useMemo } from "react";
import { useTheme } from "@mui/material";
import { useEChart } from "./useECharts";
import { tooltipStyle } from "./Tooltipstyle";

export interface ChartDatum {
  name: string;
  value: number;
  /** Optional per-bar color (e.g. by activity status). Defaults to the primary color. */
  color?: string;
}

interface Props {
  /** Bars are drawn top to bottom in the given order. */
  data: ChartDatum[];
  metricLabel: string;
  valueFormatter?: (value: number) => string;
  height?: number;
}

const MAX_LABEL = 24;

/** Horizontal bar chart for comparing one metric across a ranked list. */
export function RankedBarChart({
  data,
  metricLabel,
  valueFormatter = (v) => v.toLocaleString(),
  height = 320,
}: Props) {
  const theme = useTheme();

  const option = useMemo(() => {
    // ECharts draws category axes bottom-up; reverse so the first datum is on top.
    const rows = [...data].reverse();
    return {
      grid: { left: 8, right: 24, top: 8, bottom: 8, containLabel: true },
      tooltip: {
        trigger: "axis" as const,
        axisPointer: { type: "shadow" as const },
        valueFormatter: (v: unknown) => valueFormatter(Number(v)),
        ...tooltipStyle(theme),
      },
      xAxis: {
        type: "value" as const,
        axisLabel: {
          color: theme.palette.text.secondary,
          formatter: (v: number) => valueFormatter(v),
        },
        splitLine: { lineStyle: { color: theme.palette.divider } },
      },
      yAxis: {
        type: "category" as const,
        data: rows.map((d) => d.name),
        axisLabel: {
          color: theme.palette.text.secondary,
          formatter: (name: string) =>
            name.length > MAX_LABEL ? `${name.slice(0, MAX_LABEL)}…` : name,
        },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: theme.palette.divider } },
      },
      series: [
        {
          name: metricLabel,
          type: "bar" as const,
          data: rows.map((d) => ({
            value: d.value,
            itemStyle: { color: d.color ?? theme.palette.primary.main },
          })),
          itemStyle: { borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 20,
        },
      ],
    };
  }, [data, metricLabel, valueFormatter, theme]);

  const ref = useEChart(option);
  return <div ref={ref} style={{ width: "100%", height }} />;
}