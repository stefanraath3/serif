import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for static generation (build time).
 * Does NOT use cookies - only for public data queries in generateStaticParams.
 */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
  );
}
