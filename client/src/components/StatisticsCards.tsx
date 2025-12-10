import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticsCardsProps {
  average: number;
  highest: number;
  lowest: number;
  selectedCount: number;
}

export default function StatisticsCards({ average, highest, lowest, selectedCount }: StatisticsCardsProps) {
  const stats = [
    { label: "AVERAGE PRICE", value: average, icon: Minus },
    { label: "HIGHEST PRICE", value: highest, icon: TrendingUp },
    { label: "LOWEST PRICE", value: lowest, icon: TrendingDown },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <span
                className="text-3xl md:text-4xl font-bold font-mono"
                data-testid={`text-stat-${stat.label.toLowerCase().replace(" ", "-")}`}
              >
                ${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Based on {selectedCount} selected {selectedCount === 1 ? "company" : "companies"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
