import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/env";

export function getServerSupabase() {
  const { url, serviceRoleKey } = getSupabaseConfig();
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
