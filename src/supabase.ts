import { createClient } from "@supabase/supabase-js";

type SupabaseClient = any;

let cachedClient: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
    if (cachedClient) return cachedClient;

    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            "Missing Supabase env vars. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
        );
    }

    cachedClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });

    return cachedClient;
};
