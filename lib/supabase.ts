import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://acdwmmzaeuxuxldwjrpl.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZHdtbXphZXV4dXhsZHdqcnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTQwMzQsImV4cCI6MjA4NjQ5MDAzNH0.3weJidS_sjG0I2mQRWuTW6bsbKqTZee40ISpTe-Rl5M";

export const supabase =
  url && key
    ? createClient<Database>(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
    : null;
