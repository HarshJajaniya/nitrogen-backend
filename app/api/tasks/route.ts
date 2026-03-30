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
            .from("Task")
            .select("*")
            .eq("projectId", Number(projectId)); // 🔥 MUST

        if (error) throw error;

        // Ensure priority is always uppercase in the response
        const normalized = (data ?? []).map((task: any) => ({
            ...task,
            priority: task.priority ? String(task.priority).toUpperCase() : task.priority,
        }));
        return Response.json(normalized);
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
            .from("Task")
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

                    authorUserId: user.id,              // creator
                    assignedUserId: assignedUserId || null, // selected user
                },
            ])
            .select("*")
            .single();

        if (error) throw error;

        // Ensure priority is always uppercase in the response
        const normalized = data ? {
            ...data,
            priority: data.priority ? String(data.priority).toUpperCase() : data.priority,
        } : data;
        return Response.json(normalized, { status: 201 });

    } catch (error: any) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
