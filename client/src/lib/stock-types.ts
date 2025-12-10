export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface IndexData {
  value: number;
  change: number;
  changePercent: number;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  value: number;
}

export interface ChartData {
  sp500: HistoricalDataPoint[];
  average: HistoricalDataPoint[];
  highest: HistoricalDataPoint[];
  lowest: HistoricalDataPoint[];
}

export type TimeRange = "1D" | "5D" | "1M" | "1Y" | "5Y";

export type SelectionMode = "topN" | "manual";
