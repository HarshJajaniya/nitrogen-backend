import { prisma } from "../../../../../src/prisma";

export async function GET(
    _request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { authorUserId: Number(params.userId) },
                    { assignedUserId: Number(params.userId) },
                ],
            },
            include: {
                author: true,
                assignee: true,
            },
        });

        return Response.json(tasks);
    } catch (error: any) {
        return Response.json(
            { message: `Failed to User's tasks: ${error.message}` },
            { status: 500 }
        );
    }
}
