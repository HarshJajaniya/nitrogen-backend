import { prisma } from "../../../../../src/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: { taskId: string } }
) {
    try {
        const body = await request.json();
        const { status } = body;

        const updateTask = await prisma.task.update({
            where: {
                id: Number(params.taskId),
            },
            data: {
                status,
            },
        });

        return Response.json(updateTask, { status: 201 });
    } catch (error: any) {
        return Response.json(
            { message: `Error updating a task: ${error.message}` },
            { status: 500 }
        );
    }
}
