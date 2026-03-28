import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { auth } from "firebase-admin";



export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.replace("Bearer ", "");
        console.log("AUTH HEADER:", authHeader);
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return Response.json(
                { message: "Authorization header is missing" },
                { status: 401 }
            );
        }

        if (!token || token.split(".").length !== 3) {
            return Response.json(
                { message: "Invalid token format" },
                { status: 401 }
            );
        }
        const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            }
        );

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        let query = supabase.from("Task").select("*");

        // 🔥 CRITICAL FILTER
        if (projectId) {
            query = query.eq("projectId", Number(projectId));
        }

        const { data, error } = await query;

        if (error) throw error;

        return Response.json(data ?? []);

    } catch (error: any) {
        return Response.json(
            { message: `Failed to retrieve tasks: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const body = await request.json();
        const { name, description, startDate, endDate } = body;

        const { data, error } = await supabaseAdmin
            .from("Project")
            .insert([
                {
                    name,
                    description,
                    startDate: startDate ? new Date(startDate) : null,
                    endDate: endDate ? new Date(endDate) : null,
                },
            ])
            .select("*")
            .single();

        if (error) throw error;

        return Response.json(data, { status: 201 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
