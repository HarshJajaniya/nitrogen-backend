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

        const { data, error } = await supabase.from("users").select("*");
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

        // Get authenticated user from token
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error("User not authenticated");
        }

        const body = await request.json();
        const {
            username,
            email,
            profilePictureUrl = "i1.jpeg",
            teamId = 1,
        } = body;

        if (!username || !email) {
            throw new Error("username and email are required");
        }

        const { data, error } = await supabase
            .from("users")
            .insert([
                {
                    userId: user.id, // UUID from Supabase auth
                    username,
                    email,
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
