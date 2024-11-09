import { supabase } from "@/lib/supabase";

type RecordDTO = {
  asset: string;
  currency: string;
  price: number;
  shares: number;
  clerk_id: string;
  note: string | null | undefined;
};

export const createRecord = async (recordDTO: RecordDTO) => {
  const user = await getUserOrThrow(recordDTO.clerk_id);

  const asset = await getOrCreateAsset(recordDTO.asset);
  if (asset.error || !asset.data) {
    return { data: null, error: asset.error };
  }

  const currency = await getOrCreateCurrency(recordDTO.currency);
  if (currency.error || !currency.data) {
    return { data: null, error: currency.error };
  }

  const { data, error } = await supabase.from("record").insert({
    asset: asset.data.name,
    currency: currency.data.symbol,
    price: recordDTO.price,
    shares: recordDTO.shares,
    user: user.clerk_id,
    note: recordDTO.note,
  });

  return { data, error };
};

export const getLastUserRecords = async (clerk_id: string) => {
  const { data, error } = await supabase.rpc("get_user_records", {
    user_id: clerk_id,
  });

  return { data, error };
};

export const getOrCreateCurrency = async (currencySymbol: string) => {
  const { data, error } = await getCurrency(currencySymbol);
  if (data && !error) {
    return { data, error: null };
  }

  const { data: newData, error: newError } = await supabase
    .from("currency")
    .insert([{ symbol: currencySymbol }]);

  return { data: newData, error: newError };
};

export const getCurrency = async (currencySymbol: string) => {
  const { data, error } = await supabase
    .from("currency")
    .select()
    .eq("symbol", currencySymbol)
    .maybeSingle();

  return { data, error };
};

export const getUserOrThrow = async (clerk_id: string) => {
  const { data, error } = await getUser(clerk_id);
  if (error || !data) {
    throw new Error("Unauthorized. Request access to the Fnlly team.");
  }

  return data;
};

export const getUser = async (clerk_id: string) => {
  const { data, error } = await supabase
    .from("user")
    .select()
    .eq("clerk_id", clerk_id)
    .maybeSingle();

  return { data, error };
};

export const getAssetCountByUser = async (clerk_id: string) => {
  const { data, error } = await getAssetsByUser(clerk_id);
  if (error || !data) {
    return { data: 0, error };
  }

  return { data: data.length, error };
};

export const getAssetsByUser = async (clerk_id: string) => {
  const { data, error } = await supabase.from("asset").select();

  return { data, error };
};

export const getOrCreateAsset = async (assetName: string) => {
  const asset = await getAsset(assetName);
  if (asset.data && !asset.error) {
    return { data: asset.data, error: null };
  }

  const { data: newData, error: newError } = await supabase
    .from("asset")
    .insert([{ name: assetName }])
    .select()
    .maybeSingle();

  return { data: newData, error: newError };
};

export const getAsset = async (assetName: string) => {
  const { data, error } = await supabase
    .from("asset")
    .select()
    .eq("name", assetName)
    .maybeSingle();

  if (data) {
    return { data, error };
  }

  return { data: null, error };
};

export const getRecordsByUser = async (clerk_id: string) => {
  const { data, error } = await supabase
    .from("record")
    .select()
    .eq("user", clerk_id);

  return { data, error };
};
