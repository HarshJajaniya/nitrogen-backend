import type { Request, Response } from "express";
import {prisma }from "../lib/prisma.js";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.query;
    try {
        const users= await prisma.user.findMany();
        res.json(users);
    }  catch (error: any) {
        res.status(500).json({message: `Failed to retireve users: ${error.message}` });
    }
};


