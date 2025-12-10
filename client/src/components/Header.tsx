import { TrendingUp, TrendingDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import type { IndexData } from "@/lib/stock-types";

interface HeaderProps {
  indexData: IndexData;
  periodChangePercent: number;
  onExportCSV: () => void;
}

export default function Header({ indexData, periodChangePercent, onExportCSV }: HeaderProps) {
  const isPositive = indexData.changePercent >= 0;
  const isPeriodPositive = periodChangePercent >= 0;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <h1 className="text-lg font-semibold" data-testid="text-app-title">
              S&P 500 Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl font-bold font-mono" data-testid="text-sp500-value">
                {indexData.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <div className={`flex items-center gap-1 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-mono text-sm font-medium" data-testid="text-sp500-change">
                  {isPositive ? "+" : ""}{indexData.changePercent.toFixed(2)}%
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isPeriodPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`} data-testid="text-period-change">
                Period: {isPeriodPositive ? "+" : ""}{periodChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCSV}
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
