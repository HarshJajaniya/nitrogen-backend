import { prisma } from "../../../src/prisma";

export async function GET() {
    try {
        const projects = await prisma.project.findMany();
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

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            },
        });

        return Response.json(newProject, { status: 201 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}
