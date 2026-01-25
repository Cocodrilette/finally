import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../database.types";

type RecordDTO = {
  asset: string;
  currency: string;
  price: number;
  shares: number;
  user_id: string;
  note?: string | null;
};

type ExpenseDTO = {
  expense: string;
  value: number;
  currency: string;
  payment_method?: string;
  payment_date?: string;
  payment_day?: number;
  type: string;
  user_id: string;
};

export const createExpense = async (
  supabase: SupabaseClient<Database>,
  expenseDTO: ExpenseDTO
) => {
  const currency = await getOrCreateCurrency(supabase, expenseDTO.currency);
  if (currency.error || !currency.data) {
    return { data: null, error: currency.error };
  }

  const { data, error } = await supabase.from("expense").insert({
    currency: currency.data.symbol,
    name: expenseDTO.expense,
    value: expenseDTO.value,
    user: expenseDTO.user_id,
    payment_method: expenseDTO.payment_method ?? "",
    payment_date: expenseDTO.payment_date ?? null,
    payment_day: expenseDTO.payment_day,
    type: expenseDTO.type,
  });

  return { data, error };
};

export const createRecord = async (
  supabase: SupabaseClient<Database>,
  recordDTO: RecordDTO
) => {
  const asset = await getOrCreateAsset(supabase, recordDTO.asset);
  if (asset.error || !asset.data) {
    return { data: null, error: asset.error };
  }

  const currency = await getOrCreateCurrency(supabase, recordDTO.currency);
  if (currency.error || !currency.data) {
    return { data: null, error: currency.error };
  }

  const { data, error } = await supabase.from("record").insert({
    asset: asset.data.name,
    currency: currency.data.symbol,
    price: recordDTO.price,
    shares: recordDTO.shares,
    user_id: recordDTO.user_id,
    note: recordDTO.note,
  });

  return { data, error };
};

export const updateRecord = async (
  supabase: SupabaseClient<Database>,
  recordDTO: RecordDTO,
  record_id: number
) => {
  const asset = await getOrCreateAsset(supabase, recordDTO.asset);
  if (asset.error || !asset.data) {
    return { data: null, error: asset.error };
  }

  const currency = await getOrCreateCurrency(supabase, recordDTO.currency);
  if (currency.error || !currency.data) {
    return { data: null, error: currency.error };
  }

  const { data, error } = await supabase
    .from("record")
    .update({
      asset: asset.data.name,
      currency: currency.data.symbol,
      price: recordDTO.price,
      shares: recordDTO.shares,
      user_id: recordDTO.user_id,
      note: recordDTO.note,
    })
    .eq("id", record_id);

  return { data, error };
};

export const getLastUserRecords = async (
  supabase: SupabaseClient<Database>,
  user_id: string
) => {
  const { data, error } = await supabase.rpc("get_user_records", {
    p_user_id: user_id,
  });

  return { data, error };
};

// Server-side cached version for use in Server Components only
export const getLastUserRecordsCached = async (
  supabase: SupabaseClient<Database>,
  user_id: string
) => {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase.rpc("get_user_records", {
        p_user_id: user_id,
      });
      return { data, error };
    },
    [`user-records-${user_id}`],
    {
      revalidate: 30,
      tags: [`user-records-${user_id}`],
    }
  )();
};

export const getOrCreateCurrency = async (
  supabase: SupabaseClient<Database>,
  currencySymbol: string
) => {
  const { data, error } = await getCurrency(supabase, currencySymbol);
  if (data && !error) {
    return { data, error: null };
  }

  const { data: newData, error: newError } = await supabase
    .from("currency")
    .insert([{ symbol: currencySymbol }]);

  return { data: newData, error: newError };
};

export const getCurrency = async (
  supabase: SupabaseClient<Database>,
  currencySymbol: string
) => {
  const { data, error } = await supabase
    .from("currency")
    .select()
    .eq("symbol", currencySymbol)
    .maybeSingle();

  return { data, error };
};

export const getUserOrThrow = async (
  supabase: SupabaseClient<Database>,
  user_id: string
) => {
  const { data, error } = await getUser(supabase, user_id);
  if (error || !data) {
    throw new Error("Unauthorized. Request access to the Fnlly team.");
  }

  return data;
};

export const getUser = async (
  supabase: SupabaseClient<Database>,
  user_id: string
) => {
  const { data, error } = await supabase
    .from("user")
    .select()
    .eq("clerk_id", user_id)
    .maybeSingle();

  return { data, error };
};

export const getOrCreateUser = async (
  supabase: SupabaseClient<Database>,
  user_id: string
) => {
  const { data, error } = await getUser(supabase, user_id);
  
  // If user exists, return it
  if (data && !error) {
    return { data, error: null };
  }

  // If user doesn't exist, create it
  const { data: newData, error: newError } = await supabase
    .from("user")
    .insert([{ clerk_id: user_id }])
    .select()
    .maybeSingle();

  return { data: newData, error: newError };
};

export const getAssetCountByUser = async (
  supabase: SupabaseClient<Database>,
  user_id: string
) => {
  const { data, error } = await getAssetsByUser(supabase, user_id);
  if (error || !data) {
    return { data: 0, error };
  }

  return { data: data.length, error };
};

export const getAssetsByUser = async (
  supabase: SupabaseClient<Database>,
  user_id: string
) => {
  const { data, error } = await supabase.from("asset").select();

  return { data, error };
};

export const getOrCreateAsset = async (
  supabase: SupabaseClient<Database>,
  assetName: string
) => {
  const asset = await getAsset(supabase, assetName);
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

export const getAsset = async (
  supabase: SupabaseClient<Database>,
  assetName: string
) => {
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

export const getRecordsByUser = async (
  supabase: SupabaseClient<Database>,
  user_id: string
) => {
  const { data, error } = await supabase
    .from("record")
    .select()
    .eq("user_id", user_id);

  return { data, error };
};

// Server-side cached version for use in Server Components only
export const getRecordsByUserCached = async (
  supabase: SupabaseClient<Database>,
  user_id: string
) => {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("record")
        .select()
        .eq("user_id", user_id);
      return { data, error };
    },
    [`records-by-user-${user_id}`],
    {
      revalidate: 30,
      tags: [`records-by-user-${user_id}`],
    }
  )();
};
