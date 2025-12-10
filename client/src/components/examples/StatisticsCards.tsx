import StatisticsCards from "../StatisticsCards";

export default function StatisticsCardsExample() {
  // todo: remove mock functionality
  return (
    <StatisticsCards
      average={423.56}
      highest={782.31}
      lowest={156.78}
      selectedCount={10}
    />
  );
}
