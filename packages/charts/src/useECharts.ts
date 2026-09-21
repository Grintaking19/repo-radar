import { useEffect, useRef } from "react";
import * as echarts from "echarts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler = (params: any) => void;

// Connect React Lifecycle with ECharts (Create instance of ECharts, set options, resize on window resize, dispose on unmount)
export function useEChart(
  options: echarts.EChartsOption,
  events?: Record<string, EventHandler>,
) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chartRef.current = chart;

    // Resize with the container (cards change width without a window resize)
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(options, true);
  }, [options]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !events) return;
    for (const [name, handler] of Object.entries(events)) chart.on(name, handler);
    return () => {
      for (const [name, handler] of Object.entries(events)) chart.off(name, handler);
    };
  }, [events]);

  return ref;
}