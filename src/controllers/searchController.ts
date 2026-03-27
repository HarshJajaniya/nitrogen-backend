import type { Request, Response } from "express";
import { getSupabase } from "../supabase.js";


export const search = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query;
    try {
        const supabase = getSupabase();
        const queryText = String(query ?? "").trim();
        const pattern = `%${queryText}%`;

        const [tasksResult, projectsResult, usersResult] = await Promise.all([
            supabase
                .from("Task")
                .select("*")
                .or(`title.ilike.${pattern},description.ilike.${pattern}`),
            supabase
                .from("Project")
                .select("*")
                .or(`name.ilike.${pattern},description.ilike.${pattern}`),
            supabase
                .from("User")
                .select("*")
                .ilike("username", pattern),
        ]);

        if (tasksResult.error) throw tasksResult.error;
        if (projectsResult.error) throw projectsResult.error;
        if (usersResult.error) throw usersResult.error;

        const tasks = tasksResult.data ?? [];
        const projects = projectsResult.data ?? [];
        const users = usersResult.data ?? [];

        res.json({ tasks, projects, users });
    } catch (error: any) {
        res.status(500).json({ message: `Failed performing search: ${error.message}` });
    }
};
