import { supabase } from "@/lib/supabase";

type RecordDTO = {
  asset: string;
  currency: string;
  price: number;
  shares: number;
  clerk_id: string;
};

export const createRecord = async (recordDTO: RecordDTO) => {
  const { data, error } = await supabase.from("record").insert({
    asset: recordDTO.asset,
    currency: recordDTO.currency,
    price: recordDTO.price,
    shares: recordDTO.shares,
    user: recordDTO.clerk_id,
  });

  return { data, error };
};

export const getUserRecords = async (clerk_id: string) => {
  const { data, error } = await supabase
    .from("record")
    .select()
    .eq("user", clerk_id);

  return { data, error };
};

export const getCurrency = async (currencySymbol: string) => {
  const { data, error } = await supabase
    .from("currency")
    .select()
    .eq("symbol", currencySymbol)
    .single();

  return { data, error };
};

export const getUser = async (clerk_id: string) => {
  const { data, error } = await supabase
    .from("user")
    .select()
    .eq("clerk_id", clerk_id)
    .single();

  return { data, error };
};

export const getAsset = async (assetName: string) => {
  const { data, error } = await supabase
    .from("asset")
    .select()
    .eq("name", assetName)
    .single();

  return { data, error };
};
