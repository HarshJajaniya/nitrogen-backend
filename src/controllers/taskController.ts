import type { Request, Response } from "express";
import {prisma }from "../lib/prisma.js";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.query;
    try {
        const tasks = await prisma.task.findMany({
            where:{
                projectId:Number(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            }
        }); 
        res.json(tasks);
    }  catch (error: any) {
        res.status(500).json({message: `Failed to retireve tasks: ${error.message}` });
    }
};


export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};


export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status } = req.body;
    const { taskId } = req.params;
  try {
    const updateTask = await prisma.task.update({
      where: {
        id: Number(taskId), 
      },
      data: {
        status: status,
      },
    });
    res.status(201).json(updateTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating a task: ${error.message}` });
  }
};

export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    try {
        const tasks = await prisma.task.findMany({
            where:{
                OR:[
                  {authorUserId:Number(userId)},
                  {assignedUserId:Number(userId)}
                ]
            },
            include: {
                author: true,
                assignee: true,
            }
        }); 
        res.json(tasks);
    }  catch (error: any) {
        res.status(500).json({message: `Failed to User's tasks: ${error.message}` });
    }
};