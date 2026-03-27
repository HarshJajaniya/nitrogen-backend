import { createClient } from "@supabase/supabase-js";

type SupabaseClient = any;

let cachedAdminClient: SupabaseClient | null = null;

export const getSupabaseAdmin = (): SupabaseClient => {
    if (cachedAdminClient) return cachedAdminClient;

    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            "Missing Supabase admin env vars. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
        );
    }

    cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });

    return cachedAdminClient;
};
