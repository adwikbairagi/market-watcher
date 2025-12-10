import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import StatisticsCards from "@/components/StatisticsCards";
import PerformanceBanner from "@/components/PerformanceBanner";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SelectionControls from "@/components/SelectionControls";
import StockChart from "@/components/StockChart";
import StockTable from "@/components/StockTable";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import type { TimeRange, SelectionMode, Stock, IndexData, ChartData } from "@/lib/stock-types";

export default function Dashboard() {
  // Selection state
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("topN");
  const [topN, setTopN] = useState(10);
  const [manualSelectedSymbols, setManualSelectedSymbols] = useState<Set<string>>(new Set());

  // Time range state
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");

  // Fetch stocks data
  const {
    data: stocks = [],
    isLoading: stocksLoading,
    error: stocksError,
    refetch: refetchStocks,
  } = useQuery<Stock[]>({
    queryKey: ["/api/stocks"],
  });

  // Fetch index data
  const {
    data: indexData,
    isLoading: indexLoading,
    error: indexError,
    refetch: refetchIndex,
  } = useQuery<IndexData>({
    queryKey: ["/api/index"],
  });

  // Get selected stocks based on mode
  const selectedStocks = useMemo(() => {
    if (selectionMode === "topN") {
      const sorted = [...stocks].sort((a, b) => b.price - a.price);
      return sorted.slice(0, Math.min(topN, stocks.length));
    } else {
      return stocks.filter((s) => manualSelectedSymbols.has(s.symbol));
    }
  }, [stocks, selectionMode, topN, manualSelectedSymbols]);

  // Get selected symbols for historical data query
  const selectedSymbols = useMemo(() => 
    selectedStocks.map(s => s.symbol).join(","),
    [selectedStocks]
  );

  // Fetch historical data
  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
    refetch: refetchChart,
  } = useQuery<ChartData>({
    queryKey: ["/api/historical", timeRange, selectedSymbols],
    queryFn: async () => {
      const response = await fetch(`/api/historical?timeRange=${timeRange}&symbols=${selectedSymbols}`);
      if (!response.ok) throw new Error("Failed to fetch historical data");
      return response.json();
    },
    enabled: selectedStocks.length > 0,
  });

  // Calculate statistics for selected stocks
  const statistics = useMemo(() => {
    if (selectedStocks.length === 0) {
      return { average: 0, highest: 0, lowest: 0 };
    }
    const prices = selectedStocks.map((s) => s.price);
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return {
      average: sum / prices.length,
      highest: Math.max(...prices),
      lowest: Math.min(...prices),
    };
  }, [selectedStocks]);

  // Calculate performance percentages
  const sp500Change = useMemo(() => {
    if (!chartData?.sp500 || chartData.sp500.length < 2) return 0;
    const first = chartData.sp500[0].value;
    const last = chartData.sp500[chartData.sp500.length - 1].value;
    return ((last - first) / first) * 100;
  }, [chartData]);

  const selectionChange = useMemo(() => {
    if (!chartData?.average || chartData.average.length < 2) return 0;
    const first = chartData.average[0].value;
    const last = chartData.average[chartData.average.length - 1].value;
    return ((last - first) / first) * 100;
  }, [chartData]);

  // Export CSV functionality
  const handleExportCSV = useCallback(() => {
    const headers = ["Symbol", "Company Name", "Price", "Change", "Change %"];
    const rows = stocks.map((stock) => [
      stock.symbol,
      `"${stock.name}"`,
      stock.price.toFixed(2),
      stock.change.toFixed(2),
      stock.changePercent.toFixed(2),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sp500_stocks_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [stocks]);

  const handleRetry = useCallback(() => {
    refetchStocks();
    refetchIndex();
    refetchChart();
  }, [refetchStocks, refetchIndex, refetchChart]);

  // Loading state
  const isLoading = stocksLoading || indexLoading;
  
  // Error state
  const error = stocksError || indexError;
  const errorMessage = error instanceof Error 
    ? error.message 
    : "Unable to load stock data. Please check your connection and try again.";

  // Default index data while loading
  const displayIndexData: IndexData = indexData || {
    value: 0,
    change: 0,
    changePercent: 0,
  };

  // Default chart data
  const displayChartData: ChartData = chartData || {
    sp500: [],
    average: [],
    highest: [],
    lowest: [],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        indexData={displayIndexData}
        periodChangePercent={sp500Change}
        onExportCSV={handleExportCSV}
      />

      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <SelectionControls
            mode={selectionMode}
            onModeChange={setSelectionMode}
            topN={topN}
            onTopNChange={setTopN}
            manualCount={manualSelectedSymbols.size}
          />
          <TimeRangeSelector
            selectedRange={timeRange}
            onRangeChange={setTimeRange}
          />
        </div>

        <StatisticsCards
          average={statistics.average}
          highest={statistics.highest}
          lowest={statistics.lowest}
          selectedCount={selectedStocks.length}
        />

        <PerformanceBanner
          sp500Change={sp500Change}
          selectionChange={selectionChange}
          timeRange={timeRange}
        />

        <div className="rounded-md border bg-card p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Price History</h2>
          {chartLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-muted-foreground">Loading chart data...</div>
            </div>
          ) : (
            <StockChart data={displayChartData} timeRange={timeRange} />
          )}
        </div>

        <div className="rounded-md border bg-card p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">S&P 500 Companies</h2>
          <StockTable
            stocks={stocks}
            selectionMode={selectionMode}
            selectedSymbols={
              selectionMode === "topN"
                ? new Set(selectedStocks.map((s) => s.symbol))
                : manualSelectedSymbols
            }
            onSelectionChange={setManualSelectedSymbols}
          />
        </div>
      </main>
    </div>
  );
}
