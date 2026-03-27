import { createClient } from "@supabase/supabase-js";

type SupabaseClient = any;

let cachedClient: SupabaseClient | null = null;

const getSupabaseClient = (): SupabaseClient => {
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

export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const client = getSupabaseClient() as any;
        const value = client[prop];
        return typeof value === "function" ? value.bind(client) : value;
    },
});
