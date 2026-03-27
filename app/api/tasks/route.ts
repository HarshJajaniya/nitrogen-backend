import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    try {
        const numericProjectId = Number(projectId);
        const query = supabaseAdmin.from("Task").select("*");
        const { data: tasksData, error: tasksError } = Number.isFinite(numericProjectId)
            ? await query.eq("projectId", numericProjectId)
            : await query;

        if (tasksError) throw tasksError;

        const tasks = tasksData ?? [];
        const taskIds = tasks.map((task: any) => task.id);
        const authorIds = [...new Set(tasks.map((task: any) => task.authorUserId).filter(Boolean))];
        const assigneeIds = [...new Set(tasks.map((task: any) => task.assignedUserId).filter(Boolean))];
        const userIds = [...new Set([...authorIds, ...assigneeIds])];

        const [{ data: usersData, error: usersError }, { data: commentsData, error: commentsError }, { data: attachmentsData, error: attachmentsError }] =
            await Promise.all([
                userIds.length
                    ? supabaseAdmin.from("User").select("*").in("userId", userIds)
                    : Promise.resolve({ data: [], error: null }),
                taskIds.length
                    ? supabaseAdmin.from("Comment").select("*").in("taskId", taskIds)
                    : Promise.resolve({ data: [], error: null }),
                taskIds.length
                    ? supabaseAdmin.from("Attachment").select("*").in("taskId", taskIds)
                    : Promise.resolve({ data: [], error: null }),
            ]);

        if (usersError) throw usersError;
        if (commentsError) throw commentsError;
        if (attachmentsError) throw attachmentsError;

        const usersById = new Map((usersData ?? []).map((user: any) => [user.userId, user]));
        const commentsByTaskId = new Map<number, any[]>();
        for (const comment of commentsData ?? []) {
            const bucket = commentsByTaskId.get(comment.taskId) ?? [];
            bucket.push(comment);
            commentsByTaskId.set(comment.taskId, bucket);
        }

        const attachmentsByTaskId = new Map<number, any[]>();
        for (const attachment of attachmentsData ?? []) {
            const bucket = attachmentsByTaskId.get(attachment.taskId) ?? [];
            bucket.push(attachment);
            attachmentsByTaskId.set(attachment.taskId, bucket);
        }

        const hydratedTasks = tasks.map((task: any) => ({
            ...task,
            author: usersById.get(task.authorUserId) ?? null,
            assignee: task.assignedUserId
                ? usersById.get(task.assignedUserId) ?? null
                : null,
            comments: commentsByTaskId.get(task.id) ?? [],
            attachments: attachmentsByTaskId.get(task.id) ?? [],
        }));

        return Response.json(hydratedTasks);
    } catch (error: any) {
        return Response.json(
            { message: `Failed to retireve tasks: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
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
            authorUserId,
            assignedUserId,
        } = body;

        const { data, error } = await supabaseAdmin
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
                    projectId,
                    authorUserId,
                    assignedUserId,
                },
            ])
            .select("*")
            .single();

        if (error) throw error;

        return Response.json(data, { status: 201 });
    } catch (error: any) {
        return Response.json(
            { message: `Error creating a task: ${error.message}` },
            { status: 500 }
        );
    }
}
