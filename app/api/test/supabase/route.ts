import { supabaseAnonKey, supabaseUrl } from "../../../../lib/supabase";

export async function GET() {
    try {
        const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
            method: "GET",
            headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`,
            },
            cache: "no-store",
        });

        const body = await response.text();

        return Response.json(
            {
                connected: response.ok,
                status: response.status,
                statusText: response.statusText,
                message: response.ok
                    ? "Supabase connection successful"
                    : "Supabase responded, but check URL/key validity",
                body,
            },
            { status: response.ok ? 200 : 502 }
        );
    } catch (error: any) {
        return Response.json(
            {
                connected: false,
                message: "Failed to reach Supabase",
                error: error?.message ?? "Unknown error",
            },
            { status: 500 }
        );
    }
}
