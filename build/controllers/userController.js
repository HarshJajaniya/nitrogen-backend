import { prisma } from "../lib/prisma.js";
export const getUsers = async (req, res) => {
    const { projectId } = req.query;
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: `Failed to retireve users: ${error.message}` });
    }
};
