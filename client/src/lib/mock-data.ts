import type { Stock, IndexData, HistoricalDataPoint, ChartData } from "./stock-types";

// todo: remove mock functionality - replace with real API data

const sp500Companies = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc." },
  { symbol: "UNH", name: "UnitedHealth Group Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "XOM", name: "Exxon Mobil Corporation" },
  { symbol: "HD", name: "The Home Depot Inc." },
  { symbol: "MA", name: "Mastercard Inc." },
  { symbol: "CVX", name: "Chevron Corporation" },
  { symbol: "MRK", name: "Merck & Co. Inc." },
  { symbol: "ABBV", name: "AbbVie Inc." },
  { symbol: "LLY", name: "Eli Lilly and Company" },
  { symbol: "PFE", name: "Pfizer Inc." },
  { symbol: "COST", name: "Costco Wholesale Corp." },
  { symbol: "KO", name: "The Coca-Cola Company" },
  { symbol: "PEP", name: "PepsiCo Inc." },
  { symbol: "TMO", name: "Thermo Fisher Scientific" },
  { symbol: "AVGO", name: "Broadcom Inc." },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "MCD", name: "McDonald's Corporation" },
  { symbol: "CSCO", name: "Cisco Systems Inc." },
  { symbol: "ABT", name: "Abbott Laboratories" },
  { symbol: "DHR", name: "Danaher Corporation" },
  { symbol: "ACN", name: "Accenture plc" },
  { symbol: "CMCSA", name: "Comcast Corporation" },
  { symbol: "VZ", name: "Verizon Communications" },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "NKE", name: "NIKE Inc." },
  { symbol: "TXN", name: "Texas Instruments Inc." },
  { symbol: "NEE", name: "NextEra Energy Inc." },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "PM", name: "Philip Morris International" },
];

function randomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomChange(): { change: number; changePercent: number } {
  const changePercent = (Math.random() - 0.5) * 6;
  const change = changePercent * (Math.random() * 10 + 1);
  return {
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  };
}

export function generateMockStocks(): Stock[] {
  return sp500Companies.map((company, index) => {
    const basePrice = 800 - index * 15 + Math.random() * 50;
    const { change, changePercent } = randomChange();
    return {
      symbol: company.symbol,
      name: company.name,
      price: Math.round(basePrice * 100) / 100,
      change,
      changePercent,
    };
  });
}

export function generateMockIndexData(): IndexData {
  return {
    value: 5842.31,
    change: 23.45,
    changePercent: 0.40,
  };
}

export function generateHistoricalData(
  days: number,
  baseValue: number,
  volatility: number = 0.02
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  let value = baseValue;

  const pointsPerDay = days <= 1 ? 78 : days <= 5 ? 39 : 1;
  const totalPoints = days * pointsPerDay;

  for (let i = totalPoints; i >= 0; i--) {
    const timestamp = new Date(now);
    if (days <= 1) {
      timestamp.setMinutes(timestamp.getMinutes() - i * 5);
    } else if (days <= 5) {
      timestamp.setMinutes(timestamp.getMinutes() - i * 10);
    } else {
      timestamp.setDate(timestamp.getDate() - i);
    }

    value = value * (1 + (Math.random() - 0.5) * volatility);
    data.push({
      timestamp,
      value: Math.round(value * 100) / 100,
    });
  }

  return data;
}

export function generateMockChartData(timeRange: string): ChartData {
  const days =
    timeRange === "1D" ? 1 :
    timeRange === "5D" ? 5 :
    timeRange === "1M" ? 30 :
    timeRange === "1Y" ? 365 : 1825;

  return {
    sp500: generateHistoricalData(days, 5842, 0.01),
    average: generateHistoricalData(days, 450, 0.015),
    highest: generateHistoricalData(days, 780, 0.02),
    lowest: generateHistoricalData(days, 180, 0.025),
  };
}
