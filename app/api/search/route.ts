import { prisma } from "../../../src/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") ?? "";

    try {
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { title: { contains: String(query) } },
                    { description: { contains: String(query) } },
                ],
            },
        });

        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { name: { contains: String(query) } },
                    { description: { contains: String(query) } },
                ],
            },
        });

        const users = await prisma.user.findMany({
            where: {
                OR: [{ username: { contains: String(query) } }],
            },
        });

        return Response.json({ tasks, projects, users });
    } catch (error: any) {
        return Response.json(
            { message: `Failed performing search: ${error.message}` },
            { status: 500 }
        );
    }
}
