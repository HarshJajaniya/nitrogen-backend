import { Router } from "express";
import { getTasks, getUserTasks, updateTaskStatus } from "../controllers/taskController";
import { createTask } from "../controllers/taskController";

const tasksroutes = Router();

tasksroutes.get("/", getTasks);
tasksroutes.post("/", createTask);
tasksroutes.patch("/:taskId/status", updateTaskStatus);
tasksroutes.get("/user/:userId", getUserTasks);
export default tasksroutes;