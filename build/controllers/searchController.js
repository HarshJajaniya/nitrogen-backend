import { prisma } from "../prisma.js";
export const search = async (req, res) => {
    const { query } = req.query;
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
                OR: [
                    { username: { contains: String(query) } },
                ],
            },
        });
        res.json({ tasks, projects, users });
    }
    catch (error) {
        res.status(500).json({ message: `Failed performing search: ${error.message}` });
    }
};
