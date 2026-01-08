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

export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      cognitoId,
      profilePictureUrl = "i1.jpeg",
      teamId = 1,
    } = req.body;

    const newUser = await prisma.user.create({
      data: {
        username,
        cognitoId,
        profilePictureUrl,
        teamId,
      },
    });

    res.json({
      message: "User created successfully",
      newUser,
    });
  } catch (error: any) {
    res.status(500).json({
      message: `Failed to create user: ${error.message}`,
    });
  }
};
