import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") ?? "";

    try {
        const supabaseAdmin = getSupabaseAdmin();
        const queryText = String(query).trim();
        const pattern = `%${queryText}%`;

        const [tasksResult, projectsResult, usersResult] = await Promise.all([
            supabaseAdmin
                .from("task")
                .select("*")
                .or(`title.ilike.${pattern},description.ilike.${pattern}`),
            supabaseAdmin
                .from("projects")
                .select("*")
                .or(`name.ilike.${pattern},description.ilike.${pattern}`),
            supabaseAdmin.from("users").select("*").ilike("username", pattern),
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
