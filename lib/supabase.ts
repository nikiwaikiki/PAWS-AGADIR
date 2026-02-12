import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}

export const supabase =
  url && key
    ? createClient<Database>(url, key, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null;
