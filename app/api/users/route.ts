import { prisma } from "../../../src/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany();
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

        const newUser = await prisma.user.create({
            data: {
                username,
                cognitoId,
                profilePictureUrl,
                teamId,
            },
        });

        return Response.json({
            message: "User created successfully",
            newUser,
        });
    } catch (error: any) {
        return Response.json(
            { message: `Failed to create user: ${error.message}` },
            { status: 500 }
        );
    }
}
