export type RecordChartData = {
  asset: string;
  created_at: string;
  price: number;
  shares: number;
};

export type AssetChartData = {
  asset: string;
  shares: number;
  price: number;
  value: number;
};

export type AssetHistory = {
  asset: string;
  history: Array<{ date: string; price: number }>;
};
