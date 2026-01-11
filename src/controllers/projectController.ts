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
  try {
    const { name, description, startDate, endDate } = req.body;

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};



