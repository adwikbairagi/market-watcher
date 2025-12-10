import { useState } from "react";
import TimeRangeSelector from "../TimeRangeSelector";
import type { TimeRange } from "@/lib/stock-types";

export default function TimeRangeSelectorExample() {
  const [range, setRange] = useState<TimeRange>("1D");

  return (
    <div className="flex flex-col gap-2">
      <TimeRangeSelector selectedRange={range} onRangeChange={setRange} />
      <span className="text-sm text-muted-foreground">Selected: {range}</span>
    </div>
  );
}
