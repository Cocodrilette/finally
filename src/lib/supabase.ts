import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// This is a basic client for server-side operations
// For auth-aware operations, use the SSR client from @/lib/supabase/server or @/lib/supabase/client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
