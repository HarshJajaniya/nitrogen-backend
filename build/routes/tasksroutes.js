import { Router } from "express";
import { getTasks, updateTaskStatus } from "../controllers/taskController.js";
import { createTask } from "../controllers/taskController.js";
const tasksroutes = Router();
tasksroutes.get("/", getTasks);
tasksroutes.post("/", createTask);
tasksroutes.patch("/:taskId/status", updateTaskStatus);
export default tasksroutes;
