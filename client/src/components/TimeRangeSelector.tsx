import { Button } from "@/components/ui/button";
import type { TimeRange } from "@/lib/stock-types";

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const ranges: TimeRange[] = ["1D", "5D", "1M", "1Y", "5Y"];

export default function TimeRangeSelector({ selectedRange, onRangeChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {ranges.map((range) => (
        <Button
          key={range}
          variant={selectedRange === range ? "default" : "outline"}
          size="sm"
          onClick={() => onRangeChange(range)}
          data-testid={`button-range-${range}`}
        >
          {range}
        </Button>
      ))}
    </div>
  );
}
