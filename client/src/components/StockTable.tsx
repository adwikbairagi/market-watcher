import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Stock, SelectionMode } from "@/lib/stock-types";

type SortField = "name" | "symbol" | "price" | "changePercent";
type SortDirection = "asc" | "desc";

interface StockTableProps {
  stocks: Stock[];
  selectionMode: SelectionMode;
  selectedSymbols: Set<string>;
  onSelectionChange: (symbols: Set<string>) => void;
}

export default function StockTable({
  stocks,
  selectionMode,
  selectedSymbols,
  onSelectionChange,
}: StockTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("price");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedStocks = useMemo(() => {
    let result = [...stocks];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (stock) =>
          stock.name.toLowerCase().includes(searchLower) ||
          stock.symbol.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "changePercent":
          comparison = a.changePercent - b.changePercent;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [stocks, search, sortField, sortDirection]);

  const toggleSelection = (symbol: string) => {
    const newSelected = new Set(selectedSymbols);
    if (newSelected.has(symbol)) {
      newSelected.delete(symbol);
    } else {
      newSelected.add(symbol);
    }
    onSelectionChange(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedSymbols.size === filteredAndSortedStocks.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(filteredAndSortedStocks.map((s) => s.symbol)));
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by company name or ticker..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      <ScrollArea className="h-[400px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {selectionMode === "manual" && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSymbols.size === filteredAndSortedStocks.length && filteredAndSortedStocks.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                    data-testid="checkbox-select-all"
                  />
                </TableHead>
              )}
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("symbol")}
              >
                <div className="flex items-center gap-2">
                  Ticker
                  <SortIcon field="symbol" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Company
                  <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end gap-2">
                  Price
                  <SortIcon field="price" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => handleSort("changePercent")}
              >
                <div className="flex items-center justify-end gap-2">
                  Change
                  <SortIcon field="changePercent" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStocks.map((stock) => (
              <TableRow
                key={stock.symbol}
                className={`hover-elevate ${selectedSymbols.has(stock.symbol) ? "bg-muted/50" : ""}`}
                data-testid={`row-stock-${stock.symbol}`}
              >
                {selectionMode === "manual" && (
                  <TableCell>
                    <Checkbox
                      checked={selectedSymbols.has(stock.symbol)}
                      onCheckedChange={() => toggleSelection(stock.symbol)}
                      aria-label={`Select ${stock.name}`}
                      data-testid={`checkbox-stock-${stock.symbol}`}
                    />
                  </TableCell>
                )}
                <TableCell className="font-mono font-medium" data-testid={`text-symbol-${stock.symbol}`}>
                  {stock.symbol}
                </TableCell>
                <TableCell data-testid={`text-name-${stock.symbol}`}>{stock.name}</TableCell>
                <TableCell className="text-right font-mono" data-testid={`text-price-${stock.symbol}`}>
                  ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className={`flex items-center justify-end gap-1 font-mono ${
                      stock.changePercent >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                    data-testid={`text-change-${stock.symbol}`}
                  >
                    {stock.changePercent >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stock.changePercent >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <p className="text-sm text-muted-foreground">
        Showing {filteredAndSortedStocks.length} of {stocks.length} companies
      </p>
    </div>
  );
}
