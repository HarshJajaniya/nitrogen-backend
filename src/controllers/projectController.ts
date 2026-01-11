import type { Request, Response } from "express";
import { prisma } from "../prisma.js";


export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const projects = await prisma.project.findMany();
        res.json(projects);
    }  catch (error: any) {
        res.status(500).json({message: `Failed to retireve project: ${error.message}` });
    }
};
export const createProjects = async (req: Request, res: Response): Promise<void> => {
    const { name, description,startDate,endDate } = req.body;
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
     catch (error: any) {
        res.status(500).json({message: `Failed to create project: ${error.message}` });
    }
};


