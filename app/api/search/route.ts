import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") ?? "";

    try {
        const queryText = String(query).trim();
        const pattern = `%${queryText}%`;

        const [tasksResult, projectsResult, usersResult] = await Promise.all([
            supabaseAdmin
                .from("Task")
                .select("*")
                .or(`title.ilike.${pattern},description.ilike.${pattern}`),
            supabaseAdmin
                .from("Project")
                .select("*")
                .or(`name.ilike.${pattern},description.ilike.${pattern}`),
            supabaseAdmin.from("User").select("*").ilike("username", pattern),
        ]);

        if (tasksResult.error) throw tasksResult.error;
        if (projectsResult.error) throw projectsResult.error;
        if (usersResult.error) throw usersResult.error;

        const tasks = tasksResult.data ?? [];
        const projects = projectsResult.data ?? [];
        const users = usersResult.data ?? [];

        return Response.json({ tasks, projects, users });
    } catch (error: any) {
        return Response.json(
            { message: `Failed performing search: ${error.message}` },
            { status: 500 }
        );
    }
}
