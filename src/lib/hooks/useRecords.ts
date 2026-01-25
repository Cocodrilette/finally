import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getLastUserRecords, getRecordsByUser } from "@/db";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "../../../database.types";
import { AssetHistory } from "@/types";
import { useMemo } from "react";

export function useUserRecords(
  userId: string | null,
  options?: Partial<UseQueryOptions<Array<Tables<"record">>, Error>>
) {
  const supabase = useMemo(() => createClient(), []);
  
  return useQuery({
    queryKey: ["user-records", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const { data, error } = await getLastUserRecords(supabase, userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
    ...options,
  });
}

export function useAssetsHistory(
  userId: string | null,
  options?: Partial<UseQueryOptions<AssetHistory, Error>>
) {
  const supabase = useMemo(() => createClient(), []);
  
  return useQuery({
    queryKey: ["assets-history", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const records = await getRecordsByUser(supabase, userId);
      if (records.error || !records.data) {
        throw records.error || new Error("Failed to fetch records");
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

      return history;
    },
    enabled: !!userId,
    ...options,
  });
}

function generateHexColor(input: string): string {
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
