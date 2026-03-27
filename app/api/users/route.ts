import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin.from("User").select("*");
        if (error) throw error;

        const users = data ?? [];
        return Response.json(users);
    } catch (error: any) {
        return Response.json(
            { message: `Failed to retireve users: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            username,
            cognitoId,
            profilePictureUrl = "i1.jpeg",
            teamId = 1,
        } = body;

        const { data, error } = await supabaseAdmin
            .from("User")
            .insert([
                {
                    username,
                    cognitoId,
                    profilePictureUrl,
                    teamId,
                },
            ])
            .select("*")
            .single();

        if (error) throw error;

        return Response.json({
            message: "User created successfully",
            newUser: data,
        });
    } catch (error: any) {
        return Response.json(
            { message: `Failed to create user: ${error.message}` },
            { status: 500 }
        );
    }
}
