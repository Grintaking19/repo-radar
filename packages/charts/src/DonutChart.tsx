import { useMemo } from "react";
import { useTheme } from "@mui/material";
import { useEChart } from "./useECharts";
import { tooltipStyle } from "./Tooltipstyle";

export interface DonutDatum {
  name: string;
  value: number;
  color?: string;
}

interface Props {
  data: DonutDatum[];
  /** Big number in the middle of the ring, e.g. the total. */
  centerValue?: string;
  centerLabel?: string;
  height?: number;
  onSliceClick?: (datum: DonutDatum, index: number) => void;
}

export function DonutChart({
  data,
  centerValue,
  centerLabel,
  height = 200,
  onSliceClick,
}: Props) {
  const theme = useTheme();

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "item" as const,
        formatter: "{b}: {c} ({d}%)",
        ...tooltipStyle(theme),
      },
      title: centerValue
        ? {
            text: centerValue,
            subtext: centerLabel,
            left: "center",
            top: "middle",
            itemGap: 2,
            textStyle: {
              color: theme.palette.text.primary,
              fontSize: 24,
              fontWeight: 600,
              fontFamily: theme.typography.fontFamily,
            },
            subtextStyle: {
              color: theme.palette.text.secondary,
              fontSize: 12,
              fontFamily: theme.typography.fontFamily,
            },
          }
        : undefined,
      series: [
        {
          type: "pie" as const,
          radius: ["62%", "88%"],
          avoidLabelOverlap: true,
          label: { show: false },
          labelLine: { show: false },
          itemStyle: {
            borderColor: theme.palette.background.paper,
            borderWidth: 2,
          },
          emphasis: { scale: true, scaleSize: 4 },
          cursor: onSliceClick ? "pointer" : "default",
          data: data.map((d) => ({
            name: d.name,
            value: d.value,
            itemStyle: d.color ? { color: d.color } : undefined,
          })),
        },
      ],
    }),
    [data, centerValue, centerLabel, theme, onSliceClick],
  );

  const events = useMemo(
    () =>
      onSliceClick
        ? {
            click: (params: { dataIndex: number }) =>
              onSliceClick(data[params.dataIndex], params.dataIndex),
          }
        : undefined,
    [data, onSliceClick],
  );

  const ref = useEChart(option, events);
  return <div ref={ref} style={{ width: "100%", height }} />;
}