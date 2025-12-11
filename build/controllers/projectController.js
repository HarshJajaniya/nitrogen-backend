import { prisma } from "../lib/prisma.js";
export const getProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany();
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: `Failed to retireve project: ${error.message}` });
    }
};
export const createProjects = async (req, res) => {
    const { name, description, startDate, endDate } = req.body;
    try {
        const newproject = await prisma.project.create({
            data: {
                name,
                description,
                startDate,
                endDate
            }
        });
        res.status(201).json(newproject);
    }
    catch (error) {
        res.status(500).json({ message: `Failed to create project: ${error.message}` });
    }
};
