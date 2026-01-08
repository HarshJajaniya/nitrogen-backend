import { Router } from "express";
import { getUsers, postUser } from "../controllers/userController.js";
const tasksroutes = Router();
tasksroutes.get("/", getUsers);
tasksroutes.post("/", postUser);
export default tasksroutes;
