import type { Request, Response } from "express";
import { supabase } from "../supabase.js";


export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const numericProjectId = Number(projectId);
    const query = supabase.from("Task").select("*");
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
          ? supabase.from("User").select("*").in("userId", userIds)
          : Promise.resolve({ data: [], error: null }),
        taskIds.length
          ? supabase.from("Comment").select("*").in("taskId", taskIds)
          : Promise.resolve({ data: [], error: null }),
        taskIds.length
          ? supabase.from("Attachment").select("*").in("taskId", taskIds)
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

    res.json(hydratedTasks);
  } catch (error: any) {
    res.status(500).json({ message: `Failed to retireve tasks: ${error.message}` });
  }
};


export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } = req.body;
  try {
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
          projectId,
          authorUserId,
          assignedUserId,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};


export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status } = req.body;
  const { taskId } = req.params;
  try {
    const { data, error } = await supabase
      .from("Task")
      .update({ status })
      .eq("id", Number(taskId))
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating a task: ${error.message}` });
  }
};

export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const numericUserId = Number(userId);
    const { data: tasksData, error: tasksError } = await supabase
      .from("Task")
      .select("*")
      .or(`authorUserId.eq.${numericUserId},assignedUserId.eq.${numericUserId}`);

    if (tasksError) throw tasksError;

    const tasks = tasksData ?? [];
    const authorIds = [...new Set(tasks.map((task: any) => task.authorUserId).filter(Boolean))];
    const assigneeIds = [...new Set(tasks.map((task: any) => task.assignedUserId).filter(Boolean))];
    const userIds = [...new Set([...authorIds, ...assigneeIds])];

    const { data: usersData, error: usersError } = userIds.length
      ? await supabase.from("User").select("*").in("userId", userIds)
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

    res.json(hydratedTasks);
  } catch (error: any) {
    res.status(500).json({ message: `Failed to User's tasks: ${error.message}` });
  }
};