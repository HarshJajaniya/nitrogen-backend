import { supabase } from "../../../../lib/supabase";

export async function GET() {
    try {
        const { data, error } = await supabase.from("test").select("*");

        if (error) throw error;

        return Response.json(
            {
                connected: true,
                message: "Supabase connection successful",
                data,
            },
            { status: 200 }
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
