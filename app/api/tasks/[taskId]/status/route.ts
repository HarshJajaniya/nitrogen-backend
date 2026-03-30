import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PATCH(
    request: Request,
    { params }: { params: { taskId: string } }
) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { taskId } = params;

        const body = await request.json();
        const { status } = body;

        // ✅ Validation
        if (!status) {
            return Response.json(
                { message: "Status is required" },
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