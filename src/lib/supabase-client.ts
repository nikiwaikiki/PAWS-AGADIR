import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Use placeholder values during build time when env vars are not set
// This allows the build to complete without actual credentials
// In production runtime, the actual environment variables MUST be provided
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only warn in browser context (not during build) when credentials are missing
if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.error('CRITICAL: Missing Supabase environment variables! Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create client with fallback placeholders for build time
// At runtime, ensure actual credentials are provided in .env file
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'X-Client-Info': 'paws-agadir@1.0.0',
    },
  },
});
