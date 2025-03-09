import { createClient } from '@supabase/supabase-js';

if (
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL !== 'string' ||
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'string'
) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
