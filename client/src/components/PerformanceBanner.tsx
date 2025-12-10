import { TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceBannerProps {
  sp500Change: number;
  selectionChange: number;
  timeRange: string;
}

export default function PerformanceBanner({ sp500Change, selectionChange, timeRange }: PerformanceBannerProps) {
  const difference = selectionChange - sp500Change;
  const outperformed = difference >= 0;

  const timeRangeLabel =
    timeRange === "1D" ? "today" :
    timeRange === "5D" ? "this week" :
    timeRange === "1M" ? "this month" :
    timeRange === "1Y" ? "this year" : "5 years";

  return (
    <div className="rounded-md bg-muted/50 border px-4 py-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">S&P 500:</span>
            <span className={`font-mono font-medium ${sp500Change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} data-testid="text-sp500-period-change">
              {sp500Change >= 0 ? "+" : ""}{sp500Change.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your Selection:</span>
            <span className={`font-mono font-medium ${selectionChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} data-testid="text-selection-change">
              {selectionChange >= 0 ? "+" : ""}{selectionChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-2 ${outperformed ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {outperformed ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          <span className="font-medium" data-testid="text-performance-comparison">
            Your selection {outperformed ? "outperformed" : "underperformed"} the S&P 500 by {Math.abs(difference).toFixed(2)}% {timeRangeLabel}.
          </span>
        </div>
      </div>
    </div>
  );
}
