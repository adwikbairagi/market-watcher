import { config } from "./config";

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

// S&P 500 companies list (subset for demo - full list would come from API)
const SP500_COMPANIES = [
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
  { symbol: "ORCL", name: "Oracle Corporation" },
  { symbol: "AMD", name: "Advanced Micro Devices" },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "DIS", name: "The Walt Disney Company" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "IBM", name: "IBM Corporation" },
  { symbol: "GE", name: "General Electric Co." },
  { symbol: "BA", name: "Boeing Company" },
  { symbol: "CAT", name: "Caterpillar Inc." },
  { symbol: "GS", name: "Goldman Sachs Group" },
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

function generateHistoricalData(
  days: number,
  baseValue: number,
  volatility: number = 0.02
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  let value = baseValue;

  const pointsPerDay = days <= 1 ? 78 : days <= 5 ? 39 : 1;
  const totalPoints = Math.min(days * pointsPerDay, 500);

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

export class StockService {
  private apiKey: string;
  private baseUrl: string;
  private provider: string;
  private useMockData: boolean;

  constructor() {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.provider = config.provider;
    this.useMockData = config.useMockData;

    if (this.useMockData) {
      console.log("Stock API: Using mock data (no API key configured)");
      console.log("To use real data, set STOCK_API_KEY environment variable");
    } else {
      console.log(`Stock API: Using ${this.provider} provider`);
    }
  }

  async getStocks(): Promise<Stock[]> {
    if (this.useMockData) {
      return this.getMockStocks();
    }

    try {
      return await this.fetchRealStocks();
    } catch (error) {
      console.error("Error fetching stocks, falling back to mock data:", error);
      return this.getMockStocks();
    }
  }

  async getIndexData(): Promise<IndexData> {
    if (this.useMockData) {
      return this.getMockIndexData();
    }

    try {
      return await this.fetchRealIndexData();
    } catch (error) {
      console.error("Error fetching index data, falling back to mock:", error);
      return this.getMockIndexData();
    }
  }

  async getHistoricalData(
    timeRange: string,
    selectedSymbols: string[]
  ): Promise<ChartData> {
    const days =
      timeRange === "1D" ? 1 :
      timeRange === "5D" ? 5 :
      timeRange === "1M" ? 30 :
      timeRange === "1Y" ? 365 : 1825;

    if (this.useMockData) {
      return this.getMockHistoricalData(days);
    }

    try {
      return await this.fetchRealHistoricalData(days, selectedSymbols);
    } catch (error) {
      console.error("Error fetching historical data, falling back to mock:", error);
      return this.getMockHistoricalData(days);
    }
  }

  // Mock data generators
  private getMockStocks(): Stock[] {
    return SP500_COMPANIES.map((company, index) => {
      const basePrice = 800 - index * 12 + Math.random() * 50;
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

  private getMockIndexData(): IndexData {
    const changePercent = (Math.random() - 0.5) * 2;
    return {
      value: 5842.31 + Math.random() * 50 - 25,
      change: changePercent * 58,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  }

  private getMockHistoricalData(days: number): ChartData {
    return {
      sp500: generateHistoricalData(days, 5842, 0.01),
      average: generateHistoricalData(days, 450, 0.015),
      highest: generateHistoricalData(days, 780, 0.02),
      lowest: generateHistoricalData(days, 180, 0.025),
    };
  }

  // Real API calls (implement based on provider)
  private async fetchRealStocks(): Promise<Stock[]> {
    if (this.provider === "finnhub") {
      return this.fetchFinnhubStocks();
    }
    // Add other providers here
    return this.getMockStocks();
  }

  private async fetchRealIndexData(): Promise<IndexData> {
    if (this.provider === "finnhub") {
      return this.fetchFinnhubIndex();
    }
    return this.getMockIndexData();
  }

  private async fetchRealHistoricalData(
    days: number,
    _selectedSymbols: string[]
  ): Promise<ChartData> {
    // For now, return mock historical data
    // Real implementation would fetch from provider
    return this.getMockHistoricalData(days);
  }

  // Finnhub-specific implementations
  private async fetchFinnhubStocks(): Promise<Stock[]> {
    const stocks: Stock[] = [];
    
    // Batch requests to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < Math.min(SP500_COMPANIES.length, 50); i += batchSize) {
      const batch = SP500_COMPANIES.slice(i, i + batchSize);
      const promises = batch.map(async (company) => {
        try {
          const response = await fetch(
            `${this.baseUrl}/quote?symbol=${company.symbol}&token=${this.apiKey}`
          );
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          return {
            symbol: company.symbol,
            name: company.name,
            price: data.c || 0,
            change: data.d || 0,
            changePercent: data.dp || 0,
          };
        } catch (error) {
          console.error(`Error fetching ${company.symbol}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      stocks.push(...results.filter((s): s is Stock => s !== null));
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < SP500_COMPANIES.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return stocks.length > 0 ? stocks : this.getMockStocks();
  }

  private async fetchFinnhubIndex(): Promise<IndexData> {
    try {
      // Finnhub uses ^GSPC for S&P 500
      const response = await fetch(
        `${this.baseUrl}/quote?symbol=^GSPC&token=${this.apiKey}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return {
        value: data.c || 5842.31,
        change: data.d || 0,
        changePercent: data.dp || 0,
      };
    } catch (error) {
      console.error("Error fetching S&P 500 index:", error);
      return this.getMockIndexData();
    }
  }
}

export const stockService = new StockService();
