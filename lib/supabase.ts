// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;

export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type SupabaseClient = any;

let cachedClient: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
    if (cachedClient) return cachedClient;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error(
            "Missing Supabase env variables"
        );
    }

    cachedClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });

    return cachedClient;
};