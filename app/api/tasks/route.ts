import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.replace("Bearer ", "");

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return Response.json(
                { message: "projectId is required" },
                { status: 400 }
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

        const { data, error } = await supabase
            .from("task")
            .select("*")
            .eq("projectId", Number(projectId)); // 🔥 MUST

        if (error) throw error;

        return Response.json(data ?? []);
    } catch (error: any) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.replace("Bearer ", "");

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

        // 🔥 GET LOGGED-IN USER
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error("User not authenticated");
        }

        const body = await request.json();

        const {
            title,
            description,
            status,
            priority,
            tags,
            startDate,
            dueDate,
            points,
            projectId,
            assignedUserId,
        } = body;

        if (!projectId) {
            throw new Error("projectId is required");
        }

        const { data, error } = await supabase
            .from("task")
            .insert([
                {
                    title,
                    description,
                    status,
                    priority,
                    tags,
                    startDate,
                    dueDate,
                    points,
                    projectId: Number(projectId),

                    // 🔥 FIX HERE
                    authorUserId: user.id, // ✅ ALWAYS from auth
                    assignedUserId: assignedUserId ?? null,
                },
            ])
            .select("*")
            .single();

        if (error) throw error;

        return Response.json(data, { status: 201 });

    } catch (error: any) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
