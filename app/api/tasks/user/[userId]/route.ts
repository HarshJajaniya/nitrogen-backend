import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const numericUserId = Number(userId);
        const { data: tasksData, error: tasksError } = await supabaseAdmin
            .from("Task")
            .select("*")
            .or(`authorUserId.eq.${numericUserId},assignedUserId.eq.${numericUserId}`);

        if (tasksError) throw tasksError;

        const tasks = tasksData ?? [];
        const authorIds = [...new Set(tasks.map((task: any) => task.authorUserId).filter(Boolean))];
        const assigneeIds = [...new Set(tasks.map((task: any) => task.assignedUserId).filter(Boolean))];
        const userIds = [...new Set([...authorIds, ...assigneeIds])];

        const { data: usersData, error: usersError } = userIds.length
            ? await supabaseAdmin.from("User").select("*").in("userId", userIds)
            : { data: [], error: null };

        if (usersError) throw usersError;

        const usersById = new Map((usersData ?? []).map((user: any) => [user.userId, user]));
        const hydratedTasks = tasks.map((task: any) => ({
            ...task,
            author: usersById.get(task.authorUserId) ?? null,
            assignee: task.assignedUserId
                ? usersById.get(task.assignedUserId) ?? null
                : null,
        }));

        return Response.json(hydratedTasks);
    } catch (error: any) {
        return Response.json(
            { message: `Failed to User's tasks: ${error.message}` },
            { status: 500 }
        );
    }
}
