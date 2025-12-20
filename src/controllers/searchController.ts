import type { Request, Response } from "express";
import {prisma }from "../lib/prisma.js";

export const search = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query;
    try {
        const tasks = await prisma.task.findMany({
            where:{
                OR: [
                    { title: { contains: String(query) } },
                    { description: { contains: String(query) } },
                ], 
            },
        }); 
        const projects = await prisma.project.findMany({
            where:{
                OR: [
                    { name: { contains: String(query) } },
                    { description: { contains: String(query) } },
                ], 
            },
        }); 
        const users = await prisma.user.findMany({
            where:{
                OR: [
                    { username: { contains: String(query) } },
                ], 
            },
        }); 
        res.json({ tasks, projects, users });
    }  catch (error: any) {
        res.status(500).json({message: `Failed performing search: ${error.message}` });
    }
};
