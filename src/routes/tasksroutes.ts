import { Router } from "express";
import { getTasks, getUserTasks, updateTaskStatus } from "../controllers/taskController.js";
import { createTask } from "../controllers/taskController.js";

const tasksroutes = Router();

tasksroutes.get("/", getTasks);
tasksroutes.post("/", createTask);
tasksroutes.patch("/:taskId/status", updateTaskStatus);
tasksroutes.get("/user/:userId", getUserTasks);
export default tasksroutes;