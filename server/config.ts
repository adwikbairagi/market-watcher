/**
 * Stock API Configuration
 * 
 * EASY TO MODIFY: Change these values to switch between different stock data providers.
 * 
 * Supported providers:
 * - Alpha Vantage (free tier: 25 requests/day)
 * - Finnhub (free tier: 60 requests/minute)
 * - Polygon.io (free tier: 5 requests/minute)
 * 
 * For demo purposes, this uses a mock data fallback when no API key is configured.
 */

// ============================================
// CONFIGURE YOUR STOCK DATA API HERE
// ============================================

// Set your API key here or via environment variable
export const STOCK_API_KEY = process.env.STOCK_API_KEY || "";

// Set your API base URL here
// Examples:
// - Alpha Vantage: "https://www.alphavantage.co"
// - Finnhub: "https://finnhub.io/api/v1"
// - Polygon.io: "https://api.polygon.io"
export const STOCK_API_BASE_URL = process.env.STOCK_API_BASE_URL || "https://finnhub.io/api/v1";

// API Provider type (for handling different response formats)
export type ApiProvider = "finnhub" | "alphavantage" | "polygon" | "mock";

export const STOCK_API_PROVIDER: ApiProvider = 
  STOCK_API_KEY ? 
    (STOCK_API_BASE_URL.includes("finnhub") ? "finnhub" : 
     STOCK_API_BASE_URL.includes("alphavantage") ? "alphavantage" :
     STOCK_API_BASE_URL.includes("polygon") ? "polygon" : "mock") 
  : "mock";

// ============================================
// END CONFIGURATION
// ============================================

export const config = {
  apiKey: STOCK_API_KEY,
  baseUrl: STOCK_API_BASE_URL,
  provider: STOCK_API_PROVIDER,
  useMockData: !STOCK_API_KEY,
};
