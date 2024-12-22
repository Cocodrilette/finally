import { getRecordsByUser } from "@/db";
import { AssetHistory } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const copIntl = new Intl.NumberFormat("es-CO", {
  style: "decimal",
  currency: "COP",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function formatCurrency(value: number) {
  return copIntl.format(value);
}

export function generateHexColor(input: string): string {
  // Hash the input string to produce a consistent number
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}

export const getAssetsHistory = async (
  clerk_id: string
): Promise<{ data: AssetHistory | null; error: any | null }> => {
  const records = await getRecordsByUser(clerk_id);
  if (records.error || !records.data) {
    return { data: null, error: records.error };
  }

  // Group records by asset
  const groupedByAsset = records.data.reduce((acc, record) => {
    if (!acc[record.asset]) {
      acc[record.asset] = [];
    }
    acc[record.asset].push(record);
    return acc;
  }, {} as Record<string, typeof records.data>);

  // Filter assets whose last record price is not 0
  const validAssets = Object.keys(groupedByAsset).filter((asset) => {
    const assetRecords = groupedByAsset[asset];
    const lastRecord = assetRecords[assetRecords.length - 1];
    return lastRecord.price > 0;
  });

  // Map only valid assets to history format
  const history = records.data
    .filter((record) => validAssets.includes(record.asset))
    .map((record) => ({
      asset: record.asset,
      date: record.created_at,
      price: record.price,
      color: generateHexColor(record.asset),
    }));

  console.log(history);
  return { data: history, error: null };
};
