import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { SelectionMode } from "@/lib/stock-types";

interface SelectionControlsProps {
  mode: SelectionMode;
  onModeChange: (mode: SelectionMode) => void;
  topN: number;
  onTopNChange: (n: number) => void;
  manualCount: number;
}

export default function SelectionControls({
  mode,
  onModeChange,
  topN,
  onTopNChange,
  manualCount,
}: SelectionControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant={mode === "topN" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("topN")}
          data-testid="button-mode-topn"
        >
          Top N
        </Button>
        <Button
          variant={mode === "manual" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("manual")}
          data-testid="button-mode-manual"
        >
          Manual Select
        </Button>
      </div>

      {mode === "topN" ? (
        <div className="flex items-center gap-2">
          <Label htmlFor="topN" className="text-sm whitespace-nowrap">
            Show top
          </Label>
          <Input
            id="topN"
            type="number"
            min={1}
            max={500}
            value={topN}
            onChange={(e) => onTopNChange(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
            className="w-20 font-mono"
            data-testid="input-top-n"
          />
          <span className="text-sm text-muted-foreground">companies by price</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">
          {manualCount} {manualCount === 1 ? "company" : "companies"} selected from table below
        </span>
      )}
    </div>
  );
}
