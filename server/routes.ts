import type { Express } from "express";
import { createServer, type Server } from "http";
import { stockService } from "./stock-service";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all S&P 500 stocks with current prices
  app.get("/api/stocks", async (_req, res) => {
    try {
      const stocks = await stockService.getStocks();
      res.json(stocks);
    } catch (error) {
      console.error("Error in /api/stocks:", error);
      res.status(500).json({ 
        error: "Failed to fetch stock data. Please try again later." 
      });
    }
  });

  // Get S&P 500 index data
  app.get("/api/index", async (_req, res) => {
    try {
      const indexData = await stockService.getIndexData();
      res.json(indexData);
    } catch (error) {
      console.error("Error in /api/index:", error);
      res.status(500).json({ 
        error: "Failed to fetch index data. Please try again later." 
      });
    }
  });

  // Get historical data for chart
  app.get("/api/historical", async (req, res) => {
    try {
      const timeRange = (req.query.timeRange as string) || "1D";
      const symbolsParam = req.query.symbols as string;
      const selectedSymbols = symbolsParam ? symbolsParam.split(",") : [];
      
      const chartData = await stockService.getHistoricalData(timeRange, selectedSymbols);
      res.json(chartData);
    } catch (error) {
      console.error("Error in /api/historical:", error);
      res.status(500).json({ 
        error: "Failed to fetch historical data. Please try again later." 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
