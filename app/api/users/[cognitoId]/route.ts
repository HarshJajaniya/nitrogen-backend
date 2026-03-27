import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ cognitoId: string }> }
) {
    try {
        const { cognitoId } = await params;
        const { data: user, error } = await supabaseAdmin
            .from("User")
            .select("*")
            .eq("cognitoId", cognitoId)
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
