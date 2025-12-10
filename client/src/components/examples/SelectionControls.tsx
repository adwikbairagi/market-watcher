import { useState } from "react";
import SelectionControls from "../SelectionControls";
import type { SelectionMode } from "@/lib/stock-types";

export default function SelectionControlsExample() {
  const [mode, setMode] = useState<SelectionMode>("topN");
  const [topN, setTopN] = useState(10);

  return (
    <SelectionControls
      mode={mode}
      onModeChange={setMode}
      topN={topN}
      onTopNChange={setTopN}
      manualCount={5}
    />
  );
}
