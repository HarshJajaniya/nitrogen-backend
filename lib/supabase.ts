// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;

export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type SupabaseClient = any;

let cachedClient: SupabaseClient | null = null;

const getSupabaseClient = (): SupabaseClient => {
    if (cachedClient) return cachedClient;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error(
            "Missing Supabase env vars. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
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

export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const client = getSupabaseClient() as any;
        const value = client[prop];
        return typeof value === "function" ? value.bind(client) : value;
    },
});

export const createSupabaseAdminClient = () => {
    if (!supabaseServiceRoleKey) {
        throw new Error(
            "Missing SUPABASE_SERVICE_ROLE_KEY for admin Supabase operations."
        );
    }

    if (!supabaseUrl) {
        throw new Error(
            "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) for admin Supabase operations."
        );
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
};