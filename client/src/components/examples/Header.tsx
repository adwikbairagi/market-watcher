import { ThemeProvider } from "@/lib/theme-context";
import Header from "../Header";

export default function HeaderExample() {
  // todo: remove mock functionality
  const mockIndexData = {
    value: 5842.31,
    change: 23.45,
    changePercent: 0.40,
  };

  return (
    <ThemeProvider>
      <Header
        indexData={mockIndexData}
        periodChangePercent={1.25}
        onExportCSV={() => console.log("Export CSV clicked")}
      />
    </ThemeProvider>
  );
}
