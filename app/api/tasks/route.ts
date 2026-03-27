import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
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

        const { data, error } = await supabase
            .from("task")
            .select("*");

        if (error) throw error;

        const tasks = data ?? [];
        const taskIds = tasks.map((task: any) => task.id);
        const authorIds = [...new Set(tasks.map((task: any) => task.authorUserId).filter(Boolean))];
        const assigneeIds = [...new Set(tasks.map((task: any) => task.assignedUserId).filter(Boolean))];
        const userIds = [...new Set([...authorIds, ...assigneeIds])];

        const [{ data: usersData, error: usersError }, { data: commentsData, error: commentsError }, { data: attachmentsData, error: attachmentsError }] =
            await Promise.all([
                userIds.length
                    ? supabase.from("users").select("*").in("userId", userIds)
                    : Promise.resolve({ data: [], error: null }),
                taskIds.length
                    ? supabase.from("comments").select("*").in("taskId", taskIds)
                    : Promise.resolve({ data: [], error: null }),
                taskIds.length
                    ? supabase.from("attachments").select("*").in("taskId", taskIds)
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
