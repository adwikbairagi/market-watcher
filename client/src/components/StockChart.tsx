import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { useTheme } from "@/lib/theme-context";
import type { ChartData as StockChartData, TimeRange } from "@/lib/stock-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface StockChartProps {
  data: StockChartData;
  timeRange: TimeRange;
}

export default function StockChart({ data, timeRange }: StockChartProps) {
  const { theme } = useTheme();

  const chartData = useMemo(() => ({
    datasets: [
      {
        label: "S&P 500 Index",
        data: data.sp500.map((d) => ({ x: d.timestamp, y: d.value })),
        borderColor: "hsl(217, 91%, 60%)",
        backgroundColor: "hsla(217, 91%, 60%, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: "y1",
      },
      {
        label: "Average (Selected)",
        data: data.average.map((d) => ({ x: d.timestamp, y: d.value })),
        borderColor: "hsl(173, 80%, 40%)",
        backgroundColor: "hsla(173, 80%, 40%, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: "y",
      },
      {
        label: "Highest (Selected)",
        data: data.highest.map((d) => ({ x: d.timestamp, y: d.value })),
        borderColor: "hsl(43, 74%, 49%)",
        backgroundColor: "hsla(43, 74%, 49%, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: "y",
      },
      {
        label: "Lowest (Selected)",
        data: data.lowest.map((d) => ({ x: d.timestamp, y: d.value })),
        borderColor: "hsl(27, 87%, 55%)",
        backgroundColor: "hsla(27, 87%, 55%, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: "y",
      },
    ],
  }), [data]);

  const options = useMemo(() => {
    const gridColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
    const textColor = theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: textColor,
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: theme === "dark" ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.95)",
          titleColor: theme === "dark" ? "#fff" : "#000",
          bodyColor: theme === "dark" ? "#fff" : "#000",
          borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
          borderWidth: 1,
          padding: 12,
        },
      },
      scales: {
        x: {
          type: "time" as const,
          time: {
            unit: (timeRange === "1D" ? "hour" : timeRange === "5D" ? "day" : timeRange === "1M" ? "day" : "month") as "hour" | "day" | "month",
            displayFormats: {
              hour: "HH:mm",
              day: "MMM d",
              month: "MMM yyyy",
            },
          },
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
          },
        },
        y: {
          type: "linear" as const,
          display: true,
          position: "left" as const,
          title: {
            display: true,
            text: "Stock Price ($)",
            color: textColor,
          },
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
            callback: (value: number | string) => `$${Number(value).toFixed(0)}`,
          },
        },
        y1: {
          type: "linear" as const,
          display: true,
          position: "right" as const,
          title: {
            display: true,
            text: "S&P 500 Index",
            color: textColor,
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: textColor,
            callback: (value: number | string) => Number(value).toFixed(0),
          },
        },
      },
    };
  }, [theme, timeRange]);

  return (
    <div className="h-96 md:h-[28rem] w-full" data-testid="chart-stock">
      <Line data={chartData} options={options} />
    </div>
  );
}
