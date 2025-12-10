import ErrorState from "../ErrorState";

export default function ErrorStateExample() {
  return (
    <ErrorState
      message="We couldn't connect to the stock data service. Please check your internet connection and try again."
      onRetry={() => console.log("Retry clicked")}
    />
  );
}
