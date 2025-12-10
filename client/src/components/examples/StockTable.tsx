import { useState } from "react";
import StockTable from "../StockTable";
import { generateMockStocks } from "@/lib/mock-data";

export default function StockTableExample() {
  // todo: remove mock functionality
  const stocks = generateMockStocks();
  const [selectedSymbols, setSelectedSymbols] = useState<Set<string>>(new Set(["AAPL", "MSFT"]));

  return (
    <StockTable
      stocks={stocks}
      selectionMode="manual"
      selectedSymbols={selectedSymbols}
      onSelectionChange={setSelectedSymbols}
    />
  );
}
