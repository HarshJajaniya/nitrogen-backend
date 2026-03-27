import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ taskId: string }> }
) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { taskId } = await params;
        const body = await request.json();
        const { status } = body;

        const { data: updateTask, error } = await supabaseAdmin
            .from("Task")
            .update({ status })
            .eq("id", Number(taskId))
            .select("*")
            .single();

        if (error) throw error;

        return Response.json(updateTask, { status: 201 });
    } catch (error: any) {
        return Response.json(
            { message: `Error updating a task: ${error.message}` },
            { status: 500 }
        );
    }
}
