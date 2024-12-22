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

export type AssetHistoryData = {
  [assetName: string]: Array<{
    date: string;
    price: number;
  }>;
};

export type AssetHistory = Array<{
  asset: string;
  date: string;
  price: number;
}>;
