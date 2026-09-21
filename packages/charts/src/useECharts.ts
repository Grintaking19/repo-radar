import { useEffect, useRef } from "react";
import * as echarts from "echarts";

// Connect React Lifecycle with ECharts (Create instance of ECharts, set options, resize on window resize, dispose on unmount)
export function useEChart(options: echarts.EChartsOption, theme?: string) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, theme);
    chartRef.current = chart;

    // Resize chart on window resize
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(options, true);
  }, [options]);

  return ref;
}
