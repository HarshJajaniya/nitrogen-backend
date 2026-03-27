import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin.from("Project").select("*");
        if (error) throw error;

        const projects = data ?? [];
        return Response.json(projects);
    } catch (error: any) {
        return Response.json(
            { message: `Failed to retireve project: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, startDate, endDate } = body;

        const { data, error } = await supabaseAdmin
            .from("Project")
            .insert([
                {
                    name,
                    description,
                    startDate: startDate ? new Date(startDate) : null,
                    endDate: endDate ? new Date(endDate) : null,
                },
            ])
            .select("*")
            .single();

        if (error) throw error;

        return Response.json(data, { status: 201 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
