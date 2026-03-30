import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PATCH(request: Request) {
    try {
        const supabaseAdmin = getSupabaseAdmin();

        // Extract taskId from the URL
        const url = new URL(request.url);
        const pathParts = url.pathname.split("/");
        // Find the index of 'tasks' and get the next part as taskId
        const taskIndex = pathParts.findIndex((part) => part === "tasks");
        const taskId = taskIndex !== -1 ? pathParts[taskIndex + 1] : undefined;

        const body = await request.json();
        const { status } = body;

        // ✅ Validation

        if (!status) {
            return Response.json(
                { message: "Status is required" },
                { status: 400 }
            );
        }
        if (!taskId) {
            return Response.json(
                { message: "Task ID is required in the URL" },
                { status: 400 }
            );
        }

        const { data: updateTask, error } = await supabaseAdmin
            .from("Task")
            .update({ status })
            .eq("id", Number(taskId))
            .select("*")
            .single();

        if (error) throw error;

        if (!updateTask) {
            return Response.json(
                { message: "Task not found" },
                { status: 404 }
            );
        }

        return Response.json(updateTask, { status: 200 }); // ✅ fixed
    } catch (error: any) {
        return Response.json(
            { message: `Error updating a task: ${error.message}` },
            { status: 500 }
        );
    }
}