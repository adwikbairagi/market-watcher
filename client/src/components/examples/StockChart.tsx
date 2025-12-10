import { ThemeProvider } from "@/lib/theme-context";
import StockChart from "../StockChart";
import { generateMockChartData } from "@/lib/mock-data";

export default function StockChartExample() {
  // todo: remove mock functionality
  const chartData = generateMockChartData("1M");

  return (
    <ThemeProvider>
      <StockChart data={chartData} timeRange="1M" />
    </ThemeProvider>
  );
}
