# S&P 500 Stock Market Dashboard

## Overview
A responsive web application displaying S&P 500 stock market data with interactive charts, statistics, and comparison tools. Built with React, Express, and Chart.js.

## Features
- **S&P 500 Index Display**: Current value with daily/period percentage change
- **Stock Table**: All S&P 500 companies with name, price, and change - searchable and sortable
- **Selection Modes**: Choose top N companies by price OR manually select specific tickers
- **Statistics Cards**: Average, highest, and lowest prices for selected companies
- **Performance Comparison**: Shows if your selection outperformed/underperformed S&P 500
- **Interactive Chart**: Line chart with 4 data series (S&P 500, average, highest, lowest)
- **Time Ranges**: 1D, 5D, 1M, 1Y, 5Y views
- **CSV Export**: Download stock data
- **Dark/Light Theme**: Toggle between themes

## Architecture

### Frontend (client/)
- **React** with TypeScript
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Chart.js** with react-chartjs-2 for charts
- **Tailwind CSS** with shadcn/ui components
- **Theme Context** for dark/light mode

### Backend (server/)
- **Express.js** API server
- **Stock Service** with configurable data provider

### Key Files
- `server/config.ts` - **API configuration (edit here to add real API key)**
- `server/stock-service.ts` - Stock data service with provider abstraction
- `server/routes.ts` - API endpoints
- `client/src/pages/Dashboard.tsx` - Main dashboard component
- `client/src/components/` - Reusable UI components

## API Configuration

### Using Mock Data (Default)
When no API key is configured, the app uses realistic mock data. This is useful for development and demos.

### Using Real Stock Data
To use real stock market data, set these environment variables:

```bash
STOCK_API_KEY=
STOCK_API_BASE_URL=https://finnhub.io/api/v1  # or your provider's URL
```

Supported providers:
- **Finnhub** (free tier: 60 requests/minute)
- **Alpha Vantage** (free tier: 25 requests/day)
- **Polygon.io** (free tier: 5 requests/minute)

The provider is auto-detected from the base URL.

## API Endpoints
- `GET /api/stocks` - Returns list of S&P 500 stocks with current prices
- `GET /api/index` - Returns S&P 500 index data
- `GET /api/historical?timeRange=1D&symbols=AAPL,MSFT` - Returns historical chart data
- `GET /api/health` - Health check endpoint

## Development
```bash
npm run dev  # Start development server
```

The app runs on port 5000 with hot reload enabled.

## User Preferences
- Theme preference is saved to localStorage
- Selection mode and time range are session-based

## Recent Changes
- **December 2024**: Initial implementation
  - Full dashboard with mock data fallback
  - Configurable API provider support
  - Chart.js integration with dual Y-axes
  - CSV export functionality
  - Light/dark theme toggle
