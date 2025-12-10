import PerformanceBanner from "../PerformanceBanner";

export default function PerformanceBannerExample() {
  // todo: remove mock functionality
  return (
    <PerformanceBanner
      sp500Change={1.25}
      selectionChange={2.48}
      timeRange="1M"
    />
  );
}
