import { createClient } from "@supabase/supabase-js";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
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

        const { userId } = await params;
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("userId", userId)
            .maybeSingle();

        if (error) throw error;

        return Response.json(user);
    } catch (error: any) {
        return Response.json(
            { message: `Failed to retireve user: ${error.message}` },
            { status: 500 }
        );
    }
}
