import { prisma } from "../../../src/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    try {
        const tasks = await prisma.task.findMany({
            where: {
                projectId: Number(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            },
        });
        return Response.json(tasks);
    } catch (error: any) {
        return Response.json(
            { message: `Failed to retireve tasks: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            title,
            description,
            status,
            priority,
            tags,
            startDate,
            dueDate,
            points,
            projectId,
            authorUserId,
            assignedUserId,
        } = body;

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                tags,
                startDate,
                dueDate,
                points,
                projectId,
                authorUserId,
                assignedUserId,
            },
        });

        return Response.json(newTask, { status: 201 });
    } catch (error: any) {
        return Response.json(
            { message: `Error creating a task: ${error.message}` },
            { status: 500 }
        );
    }
}
